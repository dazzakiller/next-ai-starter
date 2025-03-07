import { NextRequest, NextResponse } from "next/server";
import { logger } from "./logging";

// Track login attempts per IP to detect brute force attempts
const loginAttempts: Record<string, { count: number, timestamp: number }> = {};

// Time window for rate limiting (in milliseconds)
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

// Maximum number of failed attempts allowed in the window
const MAX_FAILED_ATTEMPTS = 5;

/**
 * Reset login attempts counter after the window expires
 */
function cleanupStaleEntries() {
  const now = Date.now();

  Object.keys(loginAttempts).forEach(ip => {
    if (now - loginAttempts[ip].timestamp > RATE_LIMIT_WINDOW) {
      delete loginAttempts[ip];
    }
  });
}

/**
 * Track failed login attempts by IP address to detect brute force attacks
 */
export function trackLoginAttempt(ip: string, success: boolean) {
  // Clean up any stale entries first
  cleanupStaleEntries();

  // If login was successful and we were tracking this IP, reset the counter
  if (success) {
    if (loginAttempts[ip]) {
      delete loginAttempts[ip];
    }
    return true;
  }

  // Handle failed login
  if (!loginAttempts[ip]) {
    loginAttempts[ip] = { count: 1, timestamp: Date.now() };
  } else {
    loginAttempts[ip].count++;
    loginAttempts[ip].timestamp = Date.now();

    // Log suspicious activity if multiple failures
    if (loginAttempts[ip].count >= 3) {
      logger.warn(`Multiple failed login attempts detected from IP: ${ip}`, {
        source: ip,
        attempts: loginAttempts[ip].count,
        securityEvent: "multiple_failed_logins"
      });
    }

    // Check if we've exceeded the maximum allowed attempts
    if (loginAttempts[ip].count > MAX_FAILED_ATTEMPTS) {
      logger.error(`Possible brute force attack detected from IP: ${ip}`, {
        source: ip,
        attempts: loginAttempts[ip].count,
        securityEvent: "brute_force_suspected"
      });
      return false; // Indicate that this request should be blocked
    }
  }

  return true; // Allow the request to proceed
}

/**
 * Get the client IP address from the request
 */
function getClientIP(request: NextRequest): string {
  // Try various headers to get the client IP
  return (
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Middleware for rate limiting API requests by IP
 */
export function rateLimitMiddleware(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  requestsPerMinute: number = 60
): Promise<NextResponse> {
  const ip = getClientIP(request);
  const path = request.nextUrl.pathname;

  // Rate limit key combines IP and path
  const rateLimitKey = `${ip}:${path}`;

  // Check if this IP is already on a suspicious list
  if (loginAttempts[ip] && loginAttempts[ip].count > MAX_FAILED_ATTEMPTS) {
    logger.warn(`Request blocked due to rate limiting: ${rateLimitKey}`, {
      source: ip,
      path,
      securityEvent: "rate_limit_blocked"
    });

    return Promise.resolve(
      new NextResponse(
        JSON.stringify({ error: "Too many requests, please try again later" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      )
    );
  }

  // For actual rate limiting implementation, you would use a proper
  // solution like Redis with a sliding window, token bucket, or
  // fixed window counter algorithm

  // Proceed with the request
  return handler();
}

/**
 * Log security-relevant events
 */
export function logSecurityEvent(
  eventType: string,
  details: Record<string, any> = {},
  severity: "info" | "warn" | "error" = "info"
): void {
  const logData = {
    securityEvent: eventType,
    ...details,
    timestamp: new Date().toISOString()
  };

  switch (severity) {
    case "error":
      logger.error(`Security event: ${eventType}`, logData);
      break;
    case "warn":
      logger.warn(`Security event: ${eventType}`, logData);
      break;
    default:
      logger.info(`Security event: ${eventType}`, logData);
  }
}

/**
 * Detect and log potential SQL injection attempts in query parameters
 */
export function detectSQLInjection(query: string): boolean {
  // Basic SQL injection patterns
  const sqlPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /insert|update|delete|select|drop|union|exec|declare/i
  ];

  const isSuspicious = sqlPatterns.some(pattern => pattern.test(query));

  if (isSuspicious) {
    logSecurityEvent("sql_injection_attempt", { query }, "warn");
    return true;
  }

  return false;
}

/**
 * Detect and log potential XSS attempts in user input
 */
export function detectXSS(input: string): boolean {
  // Basic XSS detection patterns
  const xssPatterns = [
    /<script\b[^<]*(?:<(?!\/script>)[^<]*)*<\/script>/i,
    /src[\r\n]*=[\r\n]*\\?['"]?[^'"\\>]*/i,
    /data:text\/html[\r\n]*;[\r\n]*base64[^'"\\>]*/i,
    /on\w+[\r\n]*=[\r\n]*["']?[^'"\\>]*/i,
    /javascript:[^'"\\>]*/i
  ];

  const isSuspicious = xssPatterns.some(pattern => pattern.test(input));

  if (isSuspicious) {
    logSecurityEvent("xss_attempt", { input: input.substring(0, 100) }, "warn");
    return true;
  }

  return false;
}

/**
 * Sanitize user-provided search query to prevent security issues
 */
export function sanitizeSearchQuery(query: string): string {
  // Remove potentially dangerous characters
  let sanitized = query
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  // If still suspicious after sanitizing, just return a limited subset
  if (detectSQLInjection(sanitized) || detectXSS(sanitized)) {
    // Log that we had to sanitize aggressively
    logSecurityEvent("aggressive_input_sanitization", {
      original: query.substring(0, 100),
      sanitized: sanitized.substring(0, 100)
    });

    // Only allow alphanumeric chars and spaces
    sanitized = sanitized.replace(/[^a-zA-Z0-9 ]/g, "");
  }

  return sanitized;
}