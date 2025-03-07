import { NextRequest, NextResponse } from "next/server";

// Threshold in milliseconds for what is considered a slow request
const SLOW_REQUEST_THRESHOLD = 800;

/**
 * A middleware function to monitor request performance and log slow requests
 */
export async function monitorRequestPerformance(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const startTime = Date.now();
  const url = request.nextUrl.pathname;
  const method = request.method;

  try {
    // Process the request
    const response = await handler();

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Log slow requests
    if (responseTime > SLOW_REQUEST_THRESHOLD) {
      console.warn(
        `SLOW REQUEST [${responseTime}ms]: ${method} ${url}`
      );
    }

    // Add timing header to response
    response.headers.set("X-Response-Time", `${responseTime}ms`);

    return response;
  } catch (error) {
    // Log errors with timing information
    const errorTime = Date.now() - startTime;
    console.error(
      `REQUEST ERROR [${errorTime}ms]: ${method} ${url}`,
      error
    );
    throw error;
  }
}

/**
 * Creates a wrapper for API handlers to monitor performance
 */
export function withPerformanceMonitoring(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    return monitorRequestPerformance(request, () => handler(request));
  };
}

/**
 * Record a custom timing for any slow operation
 */
export function measurePerformance<T>(
  operationName: string,
  operation: () => Promise<T>,
  threshold: number = SLOW_REQUEST_THRESHOLD
): Promise<T> {
  const startTime = Date.now();

  return operation()
    .then((result) => {
      const duration = Date.now() - startTime;
      if (duration > threshold) {
        console.warn(`SLOW OPERATION [${duration}ms]: ${operationName}`);
      }
      return result;
    })
    .catch((error) => {
      const duration = Date.now() - startTime;
      console.error(`OPERATION ERROR [${duration}ms]: ${operationName}`, error);
      throw error;
    });
}