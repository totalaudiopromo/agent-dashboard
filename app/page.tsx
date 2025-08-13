'use client';

import React, { useState, useEffect } from 'react';
import { Send, Bot, User, Loader2, CheckCircle2, Clock, AlertCircle, Zap, Brain, TrendingUp, Users, DollarSign, Activity, ChevronRight, Play, Pause, Square, Target, BarChart3, Rocket, Shield, BookOpen, ExternalLink, Globe, Headphones, Music, Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import AgentOutputViewer from './components/AgentOutputViewer';
// Notion functions are now handled via API routes

// Real agent types based on .context files
interface RealAgent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'completed' | 'error';
  currentTask?: string;
  lastActivity: Date;
  performance: {
    tasksCompleted: number;
    successRate: number;
    avgResponseTime: number;
  };
}

interface OrchestratorMessage {
  id: string;
  type: 'user' | 'orchestrator' | 'agent';
  content: string;
  timestamp: Date;
  agentId?: string;
  status?: 'thinking' | 'working' | 'completed' | 'error';
  businessImpact?: {
    revenueImpact: number;
    competitiveAdvantage: number;
    customerValue: number;
    technicalComplexity: number;
    strategicAlignment: number;
    totalScore: number;
    decision: 'Proceed' | 'Defer' | 'Pivot';
  };
}

interface BusinessMetrics {
  mrr: number;
  customers: number;
  growthRate: number;
  activeCampaigns: number;
  developmentVelocity: number;
  agentEfficiency: number;
}

interface ActivityItem {
  id: string;
  type: 'agent-completed' | 'campaign-launched' | 'contact-added' | 'revenue-update' | 'feature-deployed' | 'bug-fixed';
  message: string;
  timestamp: Date;
  agentId?: string;
  impact?: string;
}

interface Platform {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'beta' | 'development' | 'planned';
  url: string;
  icon: React.ReactNode;
  metrics: {
    users?: number;
    contacts?: number;
    campaigns?: number;
    revenue?: number;
  };
}

export default function Dashboard() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<OrchestratorMessage[]>(() => {
    // Load messages from localStorage on component mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboard-messages');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Convert timestamp strings back to Date objects
          return parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        } catch (e) {
          console.log('Failed to parse saved messages');
        }
      }
    }
    // Default welcome message
    return [{
      id: '1',
      type: 'orchestrator',
      content: 'Hello! I\'m your Main Orchestrator for Total Audio Promo. I coordinate the AI agent army to transform you into a 10-person development team. What would you like me to help you with today?',
      timestamp: new Date(),
      status: 'completed'
    }];
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // REAL AGENTS based on .context files
  const [realAgents, setRealAgents] = useState<RealAgent[]>([
    {
      id: 'business-frontend',
      name: 'Business-Aligned Frontend Agent',
      role: 'Revenue-driving UI that converts visitors to paying customers',
      status: 'completed',
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      performance: {
        tasksCompleted: 12,
        successRate: 95,
        avgResponseTime: 2.3
      }
    },
    {
      id: 'performance-backend',
      name: 'Performance-Obsessed Backend Agent',
      role: 'Scalable infrastructure that supports profitable growth',
      status: 'completed',
      lastActivity: new Date(Date.now() - 45 * 60 * 1000),
      performance: {
        tasksCompleted: 8,
        successRate: 98,
        avgResponseTime: 1.8
      }
    },
    {
      id: 'revenue-ai',
      name: 'Revenue-Focused AI Agent',
      role: 'Intelligent systems that deliver measurable customer ROI',
      status: 'completed',
      lastActivity: new Date(Date.now() - 60 * 60 * 1000),
      performance: {
        tasksCompleted: 15,
        successRate: 92,
        avgResponseTime: 3.1
      }
    },
    {
      id: 'business-testing',
      name: 'Business-Critical Testing Agent',
      role: 'Quality assurance that protects customer trust and revenue',
      status: 'completed',
      lastActivity: new Date(Date.now() - 90 * 60 * 1000),
      performance: {
        tasksCompleted: 6,
        successRate: 100,
        avgResponseTime: 1.5
      }
    },
    {
      id: 'growth-documentation',
      name: 'Growth-Driven Documentation Agent',
      role: 'Educational content that drives adoption and reduces support costs',
      status: 'completed',
      lastActivity: new Date(Date.now() - 120 * 60 * 1000),
      performance: {
        tasksCompleted: 4,
        successRate: 88,
        avgResponseTime: 4.2
      }
    }
  ]);

  // REAL BUSINESS METRICS (pre-revenue, beta phase)
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics>({
    mrr: 0, // Pre-revenue
    customers: 0, // Beta phase
    growthRate: 0, // No growth yet
    activeCampaigns: 0, // No campaigns yet
    developmentVelocity: 0, // No metrics yet
    agentEfficiency: 0 // No data yet
  });

  // PLATFORM INTEGRATION - Real platforms
  const [platforms] = useState<Platform[]>([
    {
      id: 'audio-intel',
      name: 'Audio Intel',
      description: 'Contact enrichment & music industry intelligence',
      status: 'beta',
      url: 'http://localhost:3002',
      icon: <Headphones className="w-6 h-6" />,
      metrics: {
        users: 0,
        contacts: 0,
        campaigns: 0,
        revenue: 0
      }
    },
    {
      id: 'playlist-pulse',
      name: 'Playlist Pulse',
      description: 'Playlist promotion & curator outreach campaigns',
      status: 'development',
      url: 'http://localhost:3001',
      icon: <Music className="w-6 h-6" />,
      metrics: {
        users: 0,
        contacts: 0,
        campaigns: 0,
        revenue: 0
      }
    },
    {
      id: 'voice-echo',
      name: 'Voice Echo',
      description: 'AI-powered voice & audio content creation',
      status: 'planned',
      url: 'http://localhost:3003',
      icon: <Mic className="w-6 h-6" />,
      metrics: {
        users: 0,
        contacts: 0,
        campaigns: 0,
        revenue: 0
      }
    }
  ]);

  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'feature-deployed',
      message: 'Intel Research Agent MVP successfully integrated with Audio Intel API',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      agentId: 'revenue-ai',
      impact: 'First music industry-specific AI agent operational'
    },
    {
      id: '2',
      type: 'agent-completed',
      message: 'Main Orchestrator framework established with business impact analysis',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      agentId: 'revenue-ai',
      impact: 'Strategic decision-making framework operational'
    },
    {
      id: '3',
      type: 'feature-deployed',
      message: 'Audio Intel contact enrichment pipeline enhanced with AI intelligence',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      agentId: 'performance-backend',
      impact: '94% task reduction for contact research'
    },
    {
      id: '4',
      type: 'feature-deployed',
      message: 'Total Audio Promo agent army architecture completed',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      agentId: 'business-frontend',
      impact: 'Foundation for 10-person development team established'
    }
  ]);

  // Main Orchestrator Logic based on .context/main-orchestrator.md
  const analyzeBusinessImpact = (request: string) => {
    const businessKeywords = ['mrr', 'revenue', 'customers', 'growth', 'business', 'profit', 'sales', 'conversion', 'retention', 'churn'];
    const musicKeywords = ['indie', 'artist', 'band', 'music', 'playlist', 'promotion', 'campaign', 'contact', 'research'];
    const technicalKeywords = ['feature', 'bug', 'development', 'code', 'api', 'database', 'performance', 'testing'];
    
    const hasBusiness = businessKeywords.some(keyword => request.toLowerCase().includes(keyword));
    const hasMusic = musicKeywords.some(keyword => request.toLowerCase().includes(keyword));
    const hasTechnical = technicalKeywords.some(keyword => request.toLowerCase().includes(keyword));
    
    if (hasBusiness) {
      return {
        type: 'business-analysis',
        agents: ['revenue-ai', 'business-frontend'],
        message: 'Analyzing business metrics and revenue drivers...'
      };
    } else if (hasMusic) {
      return {
        type: 'music-research',
        agents: ['revenue-ai'],
        message: 'Delegating to music industry intelligence specialists...'
      };
    } else if (hasTechnical) {
      return {
        type: 'technical-development',
        agents: ['performance-backend', 'business-testing'],
        message: 'Coordinating technical development and quality assurance...'
      };
    } else {
      return {
        type: 'general-orchestration',
        agents: ['revenue-ai'],
        message: 'Analyzing request and determining optimal agent delegation...'
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: OrchestratorMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Main Orchestrator analyzes the request
    const analysis = analyzeBusinessImpact(input);
    
    const orchestratorThinking: OrchestratorMessage = {
      id: (Date.now() + 1).toString(),
      type: 'orchestrator',
      content: analysis.message,
      timestamp: new Date(),
      status: 'thinking'
    };

    setMessages(prev => [...prev, orchestratorThinking]);

    // Simulate agent delegation and response
    setTimeout(() => {
      let agentResponse: OrchestratorMessage;
      
      if (analysis.type === 'business-analysis') {
        if (input.toLowerCase().includes('100k') || input.toLowerCase().includes('mrr')) {
          agentResponse = {
            id: (Date.now() + 2).toString(),
            type: 'orchestrator',
            content: `Business Impact Analysis for MRR Growth:\n\nRevenue Impact: 10/10 - Direct MRR driver\nCompetitive Advantage: 9/10 - Industry-first AI agent army\nCustomer Value: 10/10 - Eliminates 94% of repetitive tasks\nTechnical Complexity: 7/10 - Established framework\nStrategic Alignment: 10/10 - Core mission alignment\n\nTotal Score: 46/50 - PROCEED with full execution\n\nCurrent Status: Pre-revenue, building foundation. Audio Intel nearly at beta. Next phase: Launch beta, gather customer feedback, iterate for market fit.`,
            timestamp: new Date(),
            status: 'completed',
            businessImpact: {
              revenueImpact: 10,
              competitiveAdvantage: 9,
              customerValue: 10,
              technicalComplexity: 7,
              strategicAlignment: 10,
              totalScore: 46,
              decision: 'Proceed'
            }
          };
        } else {
          agentResponse = {
            id: (Date.now() + 2).toString(),
            type: 'orchestrator',
            content: 'Business metrics analysis complete. Currently in pre-revenue beta phase. Audio Intel nearly ready for launch. Focus areas: customer validation, market fit, and revenue model optimization.',
            timestamp: new Date(),
            status: 'completed'
          };
        }
      } else if (analysis.type === 'music-research') {
        agentResponse = {
          id: (Date.now() + 2).toString(),
          type: 'agent',
          content: 'Intel Research Agent: Analyzing music industry context and providing strategic recommendations...',
          timestamp: new Date(),
          agentId: 'revenue-ai',
          status: 'working'
        };
      } else {
        agentResponse = {
          id: (Date.now() + 2).toString(),
          type: 'orchestrator',
          content: 'Request analyzed and delegated to appropriate agents. Coordinating execution for optimal business outcomes.',
          timestamp: new Date(),
          status: 'completed'
        };
      }

      setMessages(prev => [...prev, agentResponse]);
      setIsProcessing(false);

      // Update agent statuses
      if (analysis.agents) {
        setRealAgents(prev => prev.map(agent => 
          analysis.agents.includes(agent.id)
            ? { ...agent, status: 'working' as const, lastActivity: new Date() }
            : agent
        ));
      }
    }, 3000);
  };

  // Helper function to handle platform analysis button clicks
  const handlePlatformAnalysis = (platformName: string) => {
    // Simple alert instead of adding to chat
    const platform = platforms.find(p => p.name === platformName);
    alert(`${platformName} Analysis:\nStatus: ${platform?.status}\nURL: ${platform?.url}\n\nThis is a placeholder for future detailed analysis.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'status-working';
      case 'completed': return 'status-completed';
      case 'error': return 'status-error';
      default: return 'status-idle';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'working': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'agent-completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'campaign-launched': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'contact-added': return <Users className="w-4 h-4 text-purple-500" />;
      case 'revenue-update': return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'feature-deployed': return <Rocket className="w-4 h-4 text-blue-500" />;
      case 'bug-fixed': return <Shield className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPlatformStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'beta': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'development': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'planned': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-audio-intel-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Total Audio Promo</h1>
                <p className="text-sm text-muted-foreground">AI Agent Command Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Globe className="w-4 h-4 mr-2" />
                Dashboard Hub
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-6 py-8 space-y-8">
        {/* Section 1: Main Orchestrator Command Center */}
        <Card className="p-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-audio-intel-500 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Main Orchestrator</CardTitle>
                <p className="text-sm text-muted-foreground">Your central command for all AI agents</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Chat Interface */}
            <div className="bg-muted/50 rounded-lg p-4 h-64 overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-flex items-start space-x-2 max-w-xs lg:max-w-md ${
                    message.type === 'user' ? 'ml-auto' : ''
                  }`}>
                    {message.type !== 'user' && (
                      <div className={`p-1 rounded-full ${
                        message.type === 'orchestrator' ? 'bg-audio-intel-100' : 'bg-playlist-pulse-100'
                      }`}>
                        {message.type === 'orchestrator' ? (
                          <Bot className="w-4 h-4 text-audio-intel-600" />
                        ) : (
                          <Brain className="w-4 h-4 text-playlist-pulse-600" />
                        )}
                      </div>
                    )}
                    <div className={`rounded-lg px-3 py-2 ${
                      message.type === 'user' 
                        ? 'bg-audio-intel-500 text-white' 
                        : 'bg-card border text-card-foreground'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      {message.status && (
                        <div className="flex items-center space-x-1 mt-1">
                          {message.status === 'thinking' && <Loader2 className="w-3 h-3 animate-spin" />}
                          {message.status === 'working' && <Loader2 className="w-3 h-3 animate-spin text-audio-intel-500" />}
                          {message.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                          <span className="text-xs text-muted-foreground capitalize">{message.status}</span>
                        </div>
                      )}
                      {message.businessImpact && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                          <div className="font-medium mb-1">Business Impact Score: {message.businessImpact.totalScore}/50</div>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <span>Revenue: {message.businessImpact.revenueImpact}/10</span>
                            <span>Competitive: {message.businessImpact.competitiveAdvantage}/10</span>
                            <span>Customer: {message.businessImpact.customerValue}/10</span>
                            <span>Technical: {message.businessImpact.technicalComplexity}/10</span>
                            <span>Strategic: {message.businessImpact.strategicAlignment}/10</span>
                          </div>
                          <div className="mt-1 font-bold text-audio-intel-600">
                            Decision: {message.businessImpact.decision}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your Agent Army anything... (e.g., 'Are we on for 100k MRR?')"
                className="input-field flex-1"
                disabled={isProcessing}
              />
              <Button
                type="submit"
                disabled={isProcessing || !input.trim()}
                size="lg"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
            
            {/* Chat Controls */}
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{messages.length} messages</span>
              <button
                onClick={() => {
                  if (confirm('Clear all chat history?')) {
                    setMessages([{
                      id: '1',
                      type: 'orchestrator',
                      content: 'Hello! I\'m your Main Orchestrator for Total Audio Promo. I coordinate the AI agent army to transform you into a 10-person development team. What would you like me to help you with today?',
                      timestamp: new Date(),
                      status: 'completed'
                    }]);
                  }
                }}
                className="text-red-500 hover:text-red-700 underline cursor-pointer"
              >
                Clear Chat
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Platform Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Platform Integration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <div key={platform.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-muted rounded-lg">
                        {platform.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{platform.name}</h3>
                        <p className="text-sm text-muted-foreground">{platform.description}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs border ${getPlatformStatusColor(platform.status)}`}>
                      {platform.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Users:</span>
                      <span className="font-medium">{platform.metrics.users || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Contacts:</span>
                      <span className="font-medium">{platform.metrics.contacts || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Campaigns:</span>
                      <span className="font-medium">{platform.metrics.campaigns || 0}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(platform.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handlePlatformAnalysis(platform.name)}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analyze
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Business Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Business Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-audio-intel-50 rounded-lg border border-audio-intel-200">
                <DollarSign className="w-8 h-8 text-audio-intel-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-audio-intel-700">£{businessMetrics.mrr.toLocaleString()}</div>
                <div className="text-sm text-audio-intel-600">Monthly Revenue</div>
                <div className="text-xs text-audio-intel-500 mt-1">Pre-revenue phase</div>
              </div>
              <div className="text-center p-4 bg-playlist-pulse-50 rounded-lg border border-playlist-pulse-200">
                <Users className="w-8 h-8 text-playlist-pulse-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-playlist-pulse-700">{businessMetrics.customers.toLocaleString()}</div>
                <div className="text-sm text-playlist-pulse-600">Customers</div>
                <div className="text-xs text-playlist-pulse-500 mt-1">Beta phase</div>
              </div>
              <div className="text-center p-4 bg-release-radar-50 rounded-lg border border-release-radar-200">
                <Rocket className="w-8 h-8 text-release-radar-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-release-radar-700">{businessMetrics.activeCampaigns.toLocaleString()}</div>
                <div className="text-sm text-release-radar-600">Active Campaigns</div>
                <div className="text-xs text-release-radar-500 mt-1">Building foundation</div>
              </div>
            </div>
            
            {/* Notion Sync Test Button */}
            <div className="mt-6 text-center space-y-3">
              <button 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/notion', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        action: 'updateMetrics',
                        data: {
                          mrr: 0,
                          customers: 0,
                          activeAgents: 2,
                          lastUpdate: new Date().toLocaleString()
                        }
                      })
                    });
                    
                    const result = await response.json();
                    if (result.success) {
                      alert('Notion sync triggered! Check your Command Center page.');
                    } else {
                      alert(`❌ Error: ${result.error}`);
                    }
                  } catch (error) {
                    alert(`❌ Error: ${error.message}`);
                  }
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                🧪 Test Notion Sync
              </button>
              
              <div>
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/notion', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          action: 'createLayout'
                        })
                      });
                      
                      const result = await response.json();
                      if (result.success) {
                        alert('🎉 COMMAND CENTER GENERATED! Check your Notion page!');
                      } else {
                        alert(`❌ Error: ${result.error}`);
                      }
                    } catch (error) {
                      alert(`❌ Error: ${error.message}`);
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg"
                >
                  🚀 Generate Epic Command Center Layout
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Real Agent Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>AI Agent Army Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {realAgents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(agent.status)}`}>
                      {getStatusIcon(agent.status)}
                    </div>
                    <div>
                      <h4 className="font-medium">{agent.name}</h4>
                      <p className="text-sm text-muted-foreground">{agent.role}</p>
                      {agent.currentTask && (
                        <p className="text-xs text-audio-intel-600 mt-1">{agent.currentTask}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {agent.lastActivity.toLocaleTimeString('en-GB', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                      })}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp.toLocaleTimeString('en-GB', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false 
                    })}</p>
                    {activity.impact && (
                      <p className="text-xs text-audio-intel-600 mt-1">Impact: {activity.impact}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Agent Work Outputs */}
        <div className="space-y-4">
          <AgentOutputViewer />
        </div>
      </div>
    </div>
  );
}