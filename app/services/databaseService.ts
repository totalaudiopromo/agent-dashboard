// Real Database Integration Service for Total Audio Promo
// Connects to actual customer database for live analytics and customer management

interface Customer {
  id: string;
  email: string;
  name: string;
  company?: string;
  subscription_tier: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  created_at: Date;
  last_login: Date;
  total_spent: number;
  currency: string;
  country: string;
  industry: 'artist' | 'agency' | 'label' | 'other';
}

interface CustomerMetrics {
  total_customers: number;
  active_customers: number;
  new_customers_this_month: number;
  churned_customers_this_month: number;
  satisfaction_score: number;
  retention_rate: number;
  churn_rate: number;
  average_revenue_per_customer: number;
  customer_segments: {
    artists: number;
    agencies: number;
    labels: number;
    other: number;
  };
  subscription_tiers: {
    starter: number;
    professional: number;
    enterprise: number;
  };
  geography: {
    uk: number;
    usa: number;
    europe: number;
    other: number;
  };
}

interface CampaignMetrics {
  total_campaigns: number;
  active_campaigns: number;
  completed_campaigns: number;
  success_rate: number;
  total_revenue: number;
  average_campaign_value: number;
}

class DatabaseService {
  private static instance: DatabaseService;
  private readonly DATABASE_URL: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
    
    if (!this.DATABASE_URL) {
      console.warn('Database URL not found. Database integration will be limited.');
    }
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Test database connection
  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      if (!this.DATABASE_URL) {
        return {
          connected: false,
          message: 'Database URL not configured'
        };
      }

      // Test connection by running a simple query
      const response = await fetch('/api/database/test-connection');
      
      if (response.ok) {
        const result = await response.json();
        return {
          connected: true,
          message: `Connected to database: ${result.database_name}`
        };
      } else {
        return {
          connected: false,
          message: `Database connection failed: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        connected: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Get real-time customer metrics from database
  async getRealTimeCustomerMetrics(): Promise<CustomerMetrics> {
    return this.fetchWithCache('customer_metrics', async () => {
      try {
        if (!this.DATABASE_URL) {
          throw new Error('Database not configured');
        }

        // Query the database for customer metrics
        const response = await fetch('/api/database/customer-metrics');
        
        if (!response.ok) {
          throw new Error(`Database API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Failed to fetch customer metrics:', error);
        
        // Fallback to API endpoint if direct database fails
        try {
          const response = await fetch('/api/customers/metrics');
          if (response.ok) {
            return await response.json();
          }
        } catch (fallbackError) {
          console.error('Fallback API also failed:', fallbackError);
        }
        
        throw error;
      }
    });
  }

  // Get customer analytics with detailed breakdown
  async getCustomerAnalytics(): Promise<{
    customers: Customer[];
    metrics: CustomerMetrics;
    trends: {
      growth_rate: number;
      churn_trend: 'improving' | 'stable' | 'worsening';
      revenue_trend: 'increasing' | 'stable' | 'decreasing';
    };
  }> {
    return this.fetchWithCache('customer_analytics', async () => {
      try {
        if (!this.DATABASE_URL) {
          throw new Error('Database not configured');
        }

        const response = await fetch('/api/database/customer-analytics');
        
        if (!response.ok) {
          throw new Error(`Database API error: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Failed to fetch customer analytics:', error);
        throw error;
      }
    });
  }

  // Get campaign metrics from database
  async getCampaignMetrics(): Promise<CampaignMetrics> {
    return this.fetchWithCache('campaign_metrics', async () => {
      try {
        if (!this.DATABASE_URL) {
          throw new Error('Database not configured');
        }

        const response = await fetch('/api/database/campaign-metrics');
        
        if (!response.ok) {
          throw new Error(`Database API error: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Failed to fetch campaign metrics:', error);
        
        // Fallback to existing API
        try {
          const response = await fetch('/api/campaigns/metrics');
          if (response.ok) {
            return await response.json();
          }
        } catch (fallbackError) {
          console.error('Fallback API also failed:', fallbackError);
        }
        
        throw error;
      }
    });
  }

  // Get customer by ID
  async getCustomerById(customerId: string): Promise<Customer | null> {
    try {
      if (!this.DATABASE_URL) {
        throw new Error('Database not configured');
      }

      const response = await fetch(`/api/database/customers/${customerId}`);
      
      if (response.ok) {
        return await response.json();
      } else if (response.status === 404) {
        return null;
      } else {
        throw new Error(`Database API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      throw error;
    }
  }

  // Search customers
  async searchCustomers(query: string, filters?: {
    status?: string;
    subscription_tier?: string;
    industry?: string;
    country?: string;
  }): Promise<Customer[]> {
    try {
      if (!this.DATABASE_URL) {
        throw new Error('Database not configured');
      }

      const params = new URLSearchParams({ q: query });
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      const response = await fetch(`/api/database/customers/search?${params}`);
      
      if (!response.ok) {
        throw new Error(`Database API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to search customers:', error);
      throw error;
    }
  }

  // Update customer
  async updateCustomer(customerId: string, updates: Partial<Customer>): Promise<Customer> {
    try {
      if (!this.DATABASE_URL) {
        throw new Error('Database not configured');
      }

      const response = await fetch(`/api/database/customers/${customerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error(`Database API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  }

  // Create new customer
  async createCustomer(customerData: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> {
    try {
      if (!this.DATABASE_URL) {
        throw new Error('Database not configured');
      }

      const response = await fetch('/api/database/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerData)
      });

      if (!response.ok) {
        throw new Error(`Database API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  }

  // Get database health status
  async getDatabaseHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    message: string;
    metrics: {
      connection_pool_size: number;
      active_connections: number;
      query_response_time: number;
      error_rate: number;
    };
  }> {
    try {
      if (!this.DATABASE_URL) {
        return {
          status: 'unhealthy',
          message: 'Database not configured',
          metrics: {
            connection_pool_size: 0,
            active_connections: 0,
            query_response_time: 0,
            error_rate: 100
          }
        };
      }

      const response = await fetch('/api/database/health');
      
      if (response.ok) {
        return await response.json();
      } else {
        return {
          status: 'degraded',
          message: `Database health check failed: ${response.status}`,
          metrics: {
            connection_pool_size: 0,
            active_connections: 0,
            query_response_time: 0,
            error_rate: 50
          }
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `Database health check error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metrics: {
          connection_pool_size: 0,
          active_connections: 0,
          query_response_time: 0,
          error_rate: 100
        }
      };
    }
  }

  // Helper method for caching
  private async fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const data = await fetcher();
      this.cache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      throw error;
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

export default DatabaseService;
