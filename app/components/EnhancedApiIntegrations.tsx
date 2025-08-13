'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Database, Mail, Globe, Brain, Music, BarChart3, Activity, CheckCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface ApiServiceStatus {
  name: string;
  icon: React.ReactNode;
  status: 'connected' | 'disconnected' | 'testing' | 'error';
  lastSync?: Date;
  metrics?: any;
  description: string;
}

export default function EnhancedApiIntegrations() {
  const [services, setServices] = useState<ApiServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize all API services
        const initialServices: ApiServiceStatus[] = [
          {
            name: 'Cursor API',
            icon: <Brain className="w-5 h-5" />,
            status: 'connected',
            lastSync: new Date(),
            description: 'Enhanced Claude Code integration and agent communication',
            metrics: {
              agents: 6,
              activeSessions: 5,
              successRate: 95.1,
              avgResponseTime: 1.8
            }
          },
          {
            name: 'Firecrawl',
            icon: <Globe className="w-5 h-5" />,
            status: 'connected',
            lastSync: new Date(Date.now() - 5 * 60 * 1000),
            description: 'Web scraping and contact research automation',
            metrics: {
              jobsCompleted: 156,
              successRate: 94.9,
              pagesScraped: 2847,
              contactsExtracted: 1247
            }
          },
          {
            name: 'MailChimp',
            icon: <Mail className="w-5 h-5" />,
            status: 'connected',
            lastSync: new Date(Date.now() - 2 * 60 * 1000),
            description: 'Email campaign tracking and subscriber analytics',
            metrics: {
              subscribers: 4094,
              campaigns: 3,
              avgOpenRate: 28.7,
              avgClickRate: 6.4
            }
          },
          {
            name: 'Notion',
            icon: <Database className="w-5 h-5" />,
            status: 'disconnected',
            description: 'Project management and progress reporting',
            metrics: {
              projects: 0,
              pages: 0,
              lastSync: 'Never'
            }
          },
          {
            name: 'Stripe',
            icon: <BarChart3 className="w-5 h-5" />,
            status: 'connected',
            lastSync: new Date(),
            description: 'Payment processing and revenue tracking',
            metrics: {
              mrr: 67200,
              customers: 2535,
              growthRate: 12.4,
              churnRate: 5.8
            }
          },
          {
            name: 'Spotify',
            icon: <Music className="w-5 h-5" />,
            status: 'connected',
            lastSync: new Date(Date.now() - 15 * 60 * 1000),
            description: 'Playlist data and music industry insights',
            metrics: {
              playlists: 89,
              tracks: 156,
              followers: 234000,
              engagement: 8.7
            }
          }
        ];

        setServices(initialServices);
      } catch (error) {
        console.error('Failed to initialize services:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeServices();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        lastSync: new Date()
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'disconnected': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case 'testing': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />;
      case 'disconnected': return <AlertTriangle className="w-4 h-4" />;
      case 'testing': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const testServiceConnection = async (serviceName: string) => {
    setServices(prev => prev.map(service => 
      service.name === serviceName 
        ? { ...service, status: 'testing' as const }
        : service
    ));

    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));

    setServices(prev => prev.map(service => 
      service.name === serviceName 
        ? { 
            ...service, 
            status: 'connected' as const,
            lastSync: new Date()
          }
        : service
    ));
  };

  const formatMetricValue = (value: any): string => {
    if (typeof value === 'number') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
      if (value >= 1) return value.toFixed(1);
      return value.toString();
    }
    return value.toString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          <span>Enhanced API Integrations</span>
        </h3>
        <div className="text-sm text-gray-400">
          Real-time monitoring of all connected services
        </div>
      </div>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card 
            key={service.name} 
            className="bg-gray-900 border-gray-700 cursor-pointer transition-all duration-200 hover:border-yellow-500/50"
            onClick={() => setSelectedService(selectedService === service.name ? null : service.name)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gray-800">
                    {service.icon}
                  </div>
                  <div>
                    <CardTitle className="text-white text-base">{service.name}</CardTitle>
                    <div className="text-xs text-gray-400">{service.description}</div>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(service.status)}`}>
                  {getStatusIcon(service.status)}
                  <span className="capitalize font-medium">{service.status}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(service.metrics || {}).slice(0, 4).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-lg font-bold text-blue-400">
                      {formatMetricValue(value)}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Last Sync */}
              {service.lastSync && (
                <div className="text-xs text-gray-400 text-center">
                  Last sync: {service.lastSync.toLocaleTimeString()}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    testServiceConnection(service.name);
                  }}
                  disabled={service.status === 'testing'}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                >
                  {service.status === 'testing' ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  ) : (
                    <RefreshCw className="w-3 h-3 mr-1" />
                  )}
                  Test
                </Button>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    // This would open service-specific dashboard
                    console.log(`Opening ${service.name} dashboard`);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-xs"
                >
                  <Activity className="w-3 h-3 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>

            {/* Expanded Details */}
            {selectedService === service.name && (
              <div className="border-t border-gray-700 p-4 bg-gray-800/50">
                <div className="space-y-3">
                  <div className="text-sm text-gray-300">
                    <strong>Service Details:</strong>
                  </div>
                  
                  {service.name === 'Cursor API' && (
                    <div className="space-y-2 text-xs">
                      <div className="text-gray-300">• Enhanced agent communication</div>
                      <div className="text-gray-300">• Real-time Claude Code integration</div>
                      <div className="text-gray-300">• Performance analytics</div>
                    </div>
                  )}
                  
                  {service.name === 'Firecrawl' && (
                    <div className="space-y-2 text-xs">
                      <div className="text-gray-300">• Web scraping automation</div>
                      <div className="text-gray-300">• Contact extraction</div>
                      <div className="text-gray-300">• Market intelligence</div>
                    </div>
                  )}
                  
                  {service.name === 'MailChimp' && (
                    <div className="space-y-2 text-xs">
                      <div className="text-gray-300">• Email campaign tracking</div>
                      <div className="text-gray-300">• Subscriber analytics</div>
                      <div className="text-gray-300">• Audience insights</div>
                    </div>
                  )}
                  
                  {service.name === 'Notion' && (
                    <div className="space-y-2 text-xs">
                      <div className="text-gray-300">• Project management</div>
                      <div className="text-gray-300">• Progress reporting</div>
                      <div className="text-gray-300">• Task synchronization</div>
                    </div>
                  )}
                  
                  {service.name === 'Stripe' && (
                    <div className="space-y-2 text-xs">
                      <div className="text-gray-300">• Payment processing</div>
                      <div className="text-gray-300">• Revenue tracking</div>
                      <div className="text-gray-300">• Customer analytics</div>
                    </div>
                  )}
                  
                  {service.name === 'Spotify' && (
                    <div className="space-y-2 text-xs">
                      <div className="text-gray-300">• Playlist data</div>
                      <div className="text-gray-300">• Music insights</div>
                      <div className="text-gray-300">• Industry trends</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Integration Summary */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Integration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {services.filter(s => s.status === 'connected').length}
              </div>
              <div className="text-sm text-gray-400">Connected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {services.filter(s => s.status === 'testing').length}
              </div>
              <div className="text-sm text-gray-400">Testing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {services.filter(s => s.status === 'error').length}
              </div>
              <div className="text-sm text-gray-400">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {services.filter(s => s.status === 'disconnected').length}
              </div>
              <div className="text-sm text-gray-400">Disconnected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => {
                setServices(prev => prev.map(service => ({
                  ...service,
                  status: 'testing' as const
                })));
                
                // Simulate testing all services
                setTimeout(() => {
                  setServices(prev => prev.map(service => ({
                    ...service,
                    status: 'connected' as const,
                    lastSync: new Date()
                  })));
                }, 3000);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Test All Services
            </Button>
            
            <Button
              onClick={() => {
                // This would sync all connected services
                console.log('Syncing all services...');
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Activity className="w-4 h-4 mr-2" />
              Sync All Data
            </Button>
            
            <Button
              onClick={() => {
                // This would open the main orchestrator
                console.log('Opening orchestrator...');
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Open Orchestrator
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
