'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, Users, Target, Zap, Award, Calendar, Brain, Music, Mic } from 'lucide-react';

interface BusinessMetric {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: any;
  color: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  platform?: string;
}

export default function BusinessMetricsDashboard() {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'quarter'>('month');
  const [metrics, setMetrics] = useState<BusinessMetric[]>([
    {
      id: 'ecosystem-mrr',
      title: 'Total Ecosystem MRR',
      value: '£67.2K',
      change: 24.8,
      changeLabel: 'vs last month',
      icon: DollarSign,
      color: 'text-green-400',
      description: 'Monthly Recurring Revenue across all platforms',
      trend: 'up'
    },
    {
      id: 'time-savings',
      title: 'Customer Time Saved',
      value: '892 hrs',
      change: 31.5,
      changeLabel: 'vs last month',
      icon: Clock,
      color: 'text-blue-400',
      description: 'Hours saved through ecosystem automation',
      trend: 'up'
    },
    {
      id: 'cross-platform-success',
      title: 'Cross-Platform Success',
      value: '96.3%',
      change: 8.2,
      changeLabel: 'vs last month',
      icon: Target,
      color: 'text-purple-400',
      description: 'Success rate of multi-platform campaigns',
      trend: 'up'
    },
    {
      id: 'ecosystem-satisfaction',
      title: 'Ecosystem Satisfaction',
      value: '4.9/5',
      change: 4.7,
      changeLabel: 'vs last month',
      icon: Award,
      color: 'text-yellow-400',
      description: 'Average satisfaction across all platforms',
      trend: 'up'
    }
  ]);

  const [platformMetrics, setPlatformMetrics] = useState({
    audioIntel: {
      customers: 1247,
      mrr: 28400, // £28.4K
      avgDeal: 189.50,
      retention: 94.2,
      growth: 18.5
    },
    playlistPulse: {
      customers: 856,
      mrr: 22100, // £22.1K
      avgDeal: 167.30,
      retention: 91.7,
      growth: 27.3
    },
    voiceEcho: {
      customers: 432,
      mrr: 16700, // £16.7K
      avgDeal: 245.80,
      retention: 96.8,
      growth: 34.2
    }
  });

  const [detailedMetrics, setDetailedMetrics] = useState({
    totalCustomers: 2535,
    crossPlatformUsers: 284,
    multiPlatformCampaigns: 127,
    ecosystemIntegrations: 1456,
    avgTimeToValue: 3.2,
    crossPlatformConversion: 31.8,
    ecosystemRetention: 94.2,
    revenuePerCustomer: 264.90
  });

  useEffect(() => {
    // Simulate real-time metric updates
    const interval = setInterval(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => ({
          ...metric,
          // Small random changes to simulate real-time updates
          change: Math.max(0, metric.change + (Math.random() - 0.5) * 0.8)
        }))
      );

      // Update platform metrics
      setPlatformMetrics(prev => ({
        audioIntel: {
          ...prev.audioIntel,
          customers: prev.audioIntel.customers + (Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0)
        },
        playlistPulse: {
          ...prev.playlistPulse,
          customers: prev.playlistPulse.customers + (Math.random() > 0.8 ? Math.floor(Math.random() * 2) + 1 : 0)
        },
        voiceEcho: {
          ...prev.voiceEcho,
          customers: prev.voiceEcho.customers + (Math.random() > 0.9 ? 1 : 0)
        }
      }));

      setDetailedMetrics(prev => ({
        ...prev,
        crossPlatformUsers: prev.crossPlatformUsers + (Math.random() > 0.85 ? 1 : 0),
        multiPlatformCampaigns: prev.multiPlatformCampaigns + (Math.random() > 0.9 ? 1 : 0),
        ecosystemIntegrations: prev.ecosystemIntegrations + (Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0)
      }));
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (change > 0) return '↗️';
    if (change < 0) return '↘️';
    return '→';
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Ecosystem Business Impact</h3>
        <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1 border border-gray-700">
          {[
            { key: 'day', label: '24H' },
            { key: 'week', label: '7D' },
            { key: 'month', label: '30D' },
            { key: 'quarter', label: '90D' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeframe(key as any)}
              className={`px-3 py-1 text-xs rounded-lg transition-all ${
                timeframe === key
                  ? 'bg-yellow-500 text-black font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Ecosystem Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="bg-gray-900 rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-800 ${metric.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">{metric.title}</h4>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                  </div>
                </div>
                <div className={`text-right ${getTrendColor(metric.trend)}`}>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">
                      {getTrendIcon(metric.trend, metric.change)}{Math.abs(metric.change).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{metric.changeLabel}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">{metric.description}</p>
            </div>
          );
        })}
      </div>

      {/* Platform Breakdown */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span>Platform Performance Breakdown</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Audio Intel */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Brain className="w-5 h-5 text-blue-400" />
              <h5 className="font-bold text-white">Audio Intel</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Customers</span>
                <span className="text-sm font-medium text-white">{platformMetrics.audioIntel.customers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">MRR</span>
                <span className="text-sm font-medium text-blue-400">{formatCurrency(platformMetrics.audioIntel.mrr)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Avg Deal Size</span>
                <span className="text-sm font-medium text-white">{formatCurrency(platformMetrics.audioIntel.avgDeal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Retention</span>
                <span className="text-sm font-medium text-green-400">{platformMetrics.audioIntel.retention}%</span>
              </div>
              <div className="text-xs text-green-400 text-center mt-2">
                +{platformMetrics.audioIntel.growth}% growth
              </div>
            </div>
          </div>

          {/* Playlist Pulse */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Music className="w-5 h-5 text-green-400" />
              <h5 className="font-bold text-white">Playlist Pulse</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Customers</span>
                <span className="text-sm font-medium text-white">{platformMetrics.playlistPulse.customers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">MRR</span>
                <span className="text-sm font-medium text-green-400">{formatCurrency(platformMetrics.playlistPulse.mrr)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Avg Deal Size</span>
                <span className="text-sm font-medium text-white">{formatCurrency(platformMetrics.playlistPulse.avgDeal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Retention</span>
                <span className="text-sm font-medium text-green-400">{platformMetrics.playlistPulse.retention}%</span>
              </div>
              <div className="text-xs text-green-400 text-center mt-2">
                +{platformMetrics.playlistPulse.growth}% growth
              </div>
            </div>
          </div>

          {/* Voice Echo */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Mic className="w-5 h-5 text-purple-400" />
              <h5 className="font-bold text-white">Voice Echo</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Customers</span>
                <span className="text-sm font-medium text-white">{platformMetrics.voiceEcho.customers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">MRR</span>
                <span className="text-sm font-medium text-purple-400">{formatCurrency(platformMetrics.voiceEcho.mrr)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Avg Deal Size</span>
                <span className="text-sm font-medium text-white">{formatCurrency(platformMetrics.voiceEcho.avgDeal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Retention</span>
                <span className="text-sm font-medium text-green-400">{platformMetrics.voiceEcho.retention}%</span>
              </div>
              <div className="text-xs text-green-400 text-center mt-2">
                +{platformMetrics.voiceEcho.growth}% growth
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Platform Impact */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <span>Cross-Platform Impact</span>
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{detailedMetrics.totalCustomers.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Customers</div>
            <div className="text-xs text-green-400 mt-1">Across all platforms</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{detailedMetrics.crossPlatformUsers.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Multi-Platform Users</div>
            <div className="text-xs text-yellow-400 mt-1">+47% conversion rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{detailedMetrics.multiPlatformCampaigns.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Cross-Platform Campaigns</div>
            <div className="text-xs text-purple-400 mt-1">+127% ROI boost</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{detailedMetrics.ecosystemIntegrations.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Data Integrations</div>
            <div className="text-xs text-cyan-400 mt-1">Real-time sync</div>
          </div>
        </div>
      </div>

      {/* ROI Analysis */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          <span>Ecosystem ROI Analysis</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Avg Time to Value</span>
              <span className="text-sm font-medium text-white">{detailedMetrics.avgTimeToValue} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Cross-Platform Conversion</span>
              <span className="text-sm font-medium text-green-400">{detailedMetrics.crossPlatformConversion}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Ecosystem Retention</span>
              <span className="text-sm font-medium text-blue-400">{detailedMetrics.ecosystemRetention}%</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Revenue per Customer</span>
              <span className="text-sm font-medium text-white">{formatCurrency(detailedMetrics.revenuePerCustomer)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Multi-Platform Uplift</span>
              <span className="text-sm font-medium text-green-400">+127%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Automation Efficiency</span>
              <span className="text-sm font-medium text-purple-400">94.3%</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">6.8x</div>
              <div className="text-sm text-gray-400">Ecosystem ROI Multiplier</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">£847K</div>
              <div className="text-xs text-gray-400">Total Ecosystem Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Trends */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-pink-400" />
          <span>Ecosystem Growth Trends</span>
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-green-400 text-lg">📈</div>
            <div className="text-sm font-medium text-white mt-1">Total MRR</div>
            <div className="text-xs text-green-400">+24.8% MoM</div>
          </div>
          
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-blue-400 text-lg">⚡</div>
            <div className="text-sm font-medium text-white mt-1">Efficiency</div>
            <div className="text-xs text-blue-400">+31.5% MoM</div>
          </div>
          
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-purple-400 text-lg">🎯</div>
            <div className="text-sm font-medium text-white mt-1">Success Rate</div>
            <div className="text-xs text-purple-400">+8.2% MoM</div>
          </div>
          
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-yellow-400 text-lg">⭐</div>
            <div className="text-sm font-medium text-white mt-1">Satisfaction</div>
            <div className="text-xs text-yellow-400">+4.7% MoM</div>
          </div>

          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-orange-400 text-lg">🚀</div>
            <div className="text-sm font-medium text-white mt-1">Cross-Platform</div>
            <div className="text-xs text-orange-400">+47.3% MoM</div>
          </div>
        </div>
      </div>

      {/* Ecosystem Health Score */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <span>Total Audio Promo Ecosystem Health</span>
        </h4>
        
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            {/* Health Score Circle */}
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${97 * 2.51327} 251.327`}
                className="text-green-400"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400">97%</div>
                <div className="text-sm text-gray-400">Ecosystem Health</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-400">AI</div>
            <div className="text-sm text-gray-400">98% uptime</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">PP</div>
            <div className="text-sm text-gray-400">96% uptime</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-400">VE</div>
            <div className="text-sm text-gray-400">97% uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
}