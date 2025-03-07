import { logger } from './logging';

// Interfaces for service monitoring
interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  lastChecked: Date;
  responseTime?: number;
  error?: string;
  details?: Record<string, any>;
}

interface ServiceCheckResult {
  success: boolean;
  responseTime: number;
  details?: Record<string, any>;
  error?: string;
}

// Keep track of service status
const serviceStatus: Record<string, ServiceStatus> = {};

/**
 * Base service monitor class with common functionality
 */
abstract class ServiceMonitor {
  protected name: string;

  constructor(name: string) {
    this.name = name;

    // Initialize status
    serviceStatus[name] = {
      status: 'up', // Assume up initially
      lastChecked: new Date()
    };
  }

  /**
   * Implement service-specific health check
   */
  protected abstract checkHealth(): Promise<ServiceCheckResult>;

  /**
   * Run the service check and update status
   */
  async check(): Promise<ServiceStatus> {
    const startTime = Date.now();

    try {
      // Run the service-specific check
      const result = await this.checkHealth();
      const responseTime = Date.now() - startTime;

      // Update service status
      const status: ServiceStatus = {
        status: result.success ? 'up' : 'degraded',
        lastChecked: new Date(),
        responseTime: result.responseTime || responseTime,
        details: result.details
      };

      // Store the updated status
      serviceStatus[this.name] = status;

      // Log only if status changes or if degraded/down
      const prevStatus = serviceStatus[this.name]?.status;
      if (prevStatus !== status.status || status.status !== 'up') {
        logger.info(`Service ${this.name} status: ${status.status}`, {
          service: this.name,
          status: status.status,
          responseTime
        });
      }

      return status;
    } catch (error) {
      // Handle check failure - consider the service down
      const status: ServiceStatus = {
        status: 'down',
        lastChecked: new Date(),
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error)
      };

      // Store the updated status
      serviceStatus[this.name] = status;

      // Always log when a service is down
      logger.error(`Service ${this.name} is down`, {
        service: this.name,
        error: status.error
      });

      return status;
    }
  }

  /**
   * Get the current status of the service
   */
  getStatus(): ServiceStatus {
    return serviceStatus[this.name] || {
      status: 'unknown',
      lastChecked: new Date()
    };
  }
}

/**
 * Stripe service monitor
 */
export class StripeMonitor extends ServiceMonitor {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    super('stripe');
    this.webhookUrl = webhookUrl;
  }

  /**
   * Check if Stripe webhooks are being received
   */
  protected async checkHealth(): Promise<ServiceCheckResult> {
    // For this example, we'll simulate a check based on webhook logs
    // In a real implementation, you would check if webhooks have been received recently

    try {
      // Simulate checking if we've received a webhook in the last hour
      const lastWebhookTime = this.getLastWebhookTimestamp();
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      if (!lastWebhookTime || lastWebhookTime < oneHourAgo) {
        return {
          success: false,
          responseTime: 0,
          details: {
            lastWebhook: lastWebhookTime ? lastWebhookTime.toISOString() : 'never',
            webhookUrl: this.webhookUrl
          },
          error: 'No Stripe webhooks received in the last hour'
        };
      }

      return {
        success: true,
        responseTime: 0,
        details: {
          lastWebhook: lastWebhookTime.toISOString(),
          webhookUrl: this.webhookUrl
        }
      };
    } catch (error) {
      throw new Error(`Stripe webhook check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * In a real implementation, this would retrieve the timestamp from a database
   * where webhook receipts are logged
   */
  private getLastWebhookTimestamp(): Date | null {
    // This is a simulation - in reality you'd query your webhook logs database
    // For now, we'll return the current time to simulate healthy status
    return new Date();
  }

  /**
   * Log a received webhook to update our monitoring
   */
  logWebhookReceived(type: string, success: boolean): void {
    logger.info(`Stripe webhook received`, {
      service: 'stripe',
      webhookType: type,
      success
    });

    // In a real implementation, you would log this to a database
  }
}

/**
 * AI API service monitor
 */
export class AIApiMonitor extends ServiceMonitor {
  private provider: string;
  private apiKey: string;
  private usageQuota: number;
  private usageToDate: number;

  constructor(provider: string, apiKey: string, usageQuota: number = 0, usageToDate: number = 0) {
    super(`ai-${provider}`);
    this.provider = provider;
    this.apiKey = apiKey;
    this.usageQuota = usageQuota;
    this.usageToDate = usageToDate;
  }

  /**
   * Check AI API health and quota
   */
  protected async checkHealth(): Promise<ServiceCheckResult> {
    try {
      // For a real implementation, you might make a lightweight API call to check status
      // Here we'll focus on quota monitoring which doesn't require an actual API call

      // Calculate quota usage percentage
      const usagePercentage = this.usageQuota > 0 ? (this.usageToDate / this.usageQuota) * 100 : 0;

      // Quota alert thresholds
      const isNearLimit = usagePercentage > 80;
      const isAtLimit = usagePercentage >= 100;

      if (isAtLimit) {
        return {
          success: false,
          responseTime: 0,
          details: {
            provider: this.provider,
            usageToDate: this.usageToDate,
            usageQuota: this.usageQuota,
            usagePercentage
          },
          error: `AI API quota exceeded (${usagePercentage.toFixed(1)}%)`
        };
      }

      if (isNearLimit) {
        return {
          success: true, // Still working but with warning
          responseTime: 0,
          details: {
            provider: this.provider,
            usageToDate: this.usageToDate,
            usageQuota: this.usageQuota,
            usagePercentage,
            warning: `Approaching quota limit (${usagePercentage.toFixed(1)}%)`
          }
        };
      }

      return {
        success: true,
        responseTime: 0,
        details: {
          provider: this.provider,
          usageToDate: this.usageToDate,
          usageQuota: this.usageQuota,
          usagePercentage
        }
      };
    } catch (error) {
      throw new Error(`AI API check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Update usage statistics
   */
  updateUsage(additionalUsage: number): void {
    this.usageToDate += additionalUsage;

    // Log if usage crosses a threshold
    const usagePercentage = this.usageQuota > 0 ? (this.usageToDate / this.usageQuota) * 100 : 0;

    if (usagePercentage >= 100) {
      logger.warn(`AI API quota exceeded`, {
        service: `ai-${this.provider}`,
        usageToDate: this.usageToDate,
        usageQuota: this.usageQuota,
        usagePercentage
      });
    } else if (usagePercentage >= 90) {
      logger.warn(`AI API quota at 90%`, {
        service: `ai-${this.provider}`,
        usageToDate: this.usageToDate,
        usageQuota: this.usageQuota,
        usagePercentage
      });
    } else if (usagePercentage >= 75) {
      logger.info(`AI API quota at 75%`, {
        service: `ai-${this.provider}`,
        usageToDate: this.usageToDate,
        usageQuota: this.usageQuota,
        usagePercentage
      });
    }

    // In a real implementation, store this in a database
  }
}

/**
 * Factory to create appropriate service monitors
 */
export function createServiceMonitor(type: string, config: Record<string, any>): ServiceMonitor {
  switch (type) {
    case 'stripe':
      return new StripeMonitor(config.webhookUrl || '');
    case 'openai':
      return new AIApiMonitor('openai', config.apiKey || '', config.usageQuota, config.usageToDate);
    case 'anthropic':
      return new AIApiMonitor('anthropic', config.apiKey || '', config.usageQuota, config.usageToDate);
    default:
      throw new Error(`Unsupported service type: ${type}`);
  }
}

/**
 * Get all service statuses
 */
export function getAllServiceStatuses(): Record<string, ServiceStatus> {
  return { ...serviceStatus };
}