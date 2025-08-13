'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, 
  Settings, 
  Plus, 
  MessageCircle, 
  Cog, 
  Eye, 
  MoreHorizontal,
  ChevronRight,
  Bell,
  RefreshCw,
  Play,
  Pause,
  Square,
  X,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  category: 'main-orchestrator' | 'content-agents' | 'research-agents' | 'analytics-agents';
  status: 'active' | 'idle' | 'working' | 'error' | 'offline';
  lastActivity: string;
  currentTask?: string;
  progress?: number;
  apiKey?: string;
  isOnline: boolean;
  responseTime: number;
  tasksCompleted: number;
  successRate: number;
}

interface ChatMessage {
  id: string;
  agentId: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
  responseTime?: number;
}

interface AgentSettings {
  id: string;
  name: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

const AgentCommandCentre: React.FC = () => {
  // State management
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'main-orchestrator',
      name: 'Main Orchestrator',
      category: 'main-orchestrator',
      status: 'active',
      lastActivity: '2 minutes ago',
      currentTask: 'Coordinating agent activities',
      isOnline: true,
      responseTime: 1200,
      tasksCompleted: 156,
      successRate: 98.5
    },
    {
      id: 'content-creator',
      name: 'Content Creator Agent',
      category: 'content-agents',
      status: 'working',
      lastActivity: '1 minute ago',
      currentTask: 'Generating promotional content',
      progress: 75,
      isOnline: true,
      responseTime: 800,
      tasksCompleted: 89,
      successRate: 95.2
    },
    {
      id: 'social-media',
      name: 'Social Media Agent',
      category: 'content-agents',
      status: 'idle',
      lastActivity: '15 minutes ago',
      isOnline: true,
      responseTime: 650,
      tasksCompleted: 67,
      successRate: 92.1
    },
    {
      id: 'market-researcher',
      name: 'Market Research Agent',
      category: 'research-agents',
      status: 'working',
      lastActivity: '5 minutes ago',
      currentTask: 'Analysing competitor strategies',
      progress: 45,
      isOnline: true,
      responseTime: 2100,
      tasksCompleted: 43,
      successRate: 88.7
    },
    {
      id: 'data-analyst',
      name: 'Data Analyst Agent',
      category: 'analytics-agents',
      status: 'active',
      lastActivity: '3 minutes ago',
      currentTask: 'Processing campaign metrics',
      isOnline: true,
      responseTime: 950,
      tasksCompleted: 78,
      successRate: 96.3
    },
    {
       id: 'trend-tracker',
       name: 'Trend Tracker Agent',
       category: 'analytics-agents',
       status: 'error',
       lastActivity: '1 hour ago',
       isOnline: false,
       responseTime: 0,
       tasksCompleted: 34,
       successRate: 85.2
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatAgent, setActiveChatAgent] = useState<Agent | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedAgentForSettings, setSelectedAgentForSettings] = useState<Agent | null>(null);
  const [agentOutputs, setAgentOutputs] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs for mobile interactions
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastTouchY = useRef(0);

  // Load chat history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChats = localStorage.getItem('agent-chat-history');
      if (savedChats) {
        try {
          const parsed = JSON.parse(savedChats);
          // Convert timestamp strings back to Date objects
          const converted = Object.keys(parsed).reduce((acc, agentId) => {
            acc[agentId] = parsed[agentId].map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
            return acc;
          }, {} as Record<string, ChatMessage[]>);
          setAgentOutputs(converted);
        } catch (e) {
          console.error('Failed to parse saved chat history');
        }
      }
    }
  }, []);

  // Save chat history to localStorage
  const saveChatHistory = useCallback((agentId: string, messages: ChatMessage[]) => {
    if (typeof window !== 'undefined') {
      const current = JSON.parse(localStorage.getItem('agent-chat-history') || '{}');
      current[agentId] = messages;
      localStorage.setItem('agent-chat-history', JSON.stringify(current));
    }
  }, []);

  // Real-time status updates every 30 seconds
  useEffect(() => {
    const updateAgentStatus = async () => {
      try {
        // Simulate real API calls to update agent statuses
        setAgents(prev => prev.map(agent => {
          if (agent.status === 'working' && agent.progress !== undefined) {
            const newProgress = Math.min(100, agent.progress + Math.random() * 15);
            if (newProgress >= 100) {
              return {
                ...agent,
                status: 'active' as const,
                progress: undefined,
                currentTask: undefined,
                lastActivity: 'Just now',
                tasksCompleted: agent.tasksCompleted + 1
              };
            }
            return {
              ...agent,
              progress: newProgress,
              lastActivity: 'Just now'
            };
          }
          return agent;
        }));
      } catch (error) {
        console.error('Failed to update agent status:', error);
      }
    };

    const interval = setInterval(updateAgentStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mobile pull-to-refresh functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    lastTouchY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = lastTouchY.current - currentY;
    
    if (diff > 50 && window.scrollY === 0) {
      // Pull to refresh
      handleRefresh();
    }
  };

  // Real agent control functions
  const handleAgentAction = async (agentId: string, action: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const agent = agents.find(a => a.id === agentId);
      if (!agent) throw new Error('Agent not found');

      switch (action) {
        case 'start':
          await startAgent(agentId);
          break;
        case 'pause':
          await pauseAgent(agentId);
          break;
        case 'stop':
          await stopAgent(agentId);
          break;
        case 'chat':
          openAgentChat(agent);
          break;
        case 'configure':
          openAgentSettings(agent);
          break;
        case 'view':
          viewAgentOutputs(agent);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error) {
      setError(`Failed to ${action} agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startAgent = async (agentId: string) => {
    // Simulate API call to start agent
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'working' as const, progress: 0, currentTask: 'Initialising...' }
        : agent
    ));
  };

  const pauseAgent = async (agentId: string) => {
    // Simulate API call to pause agent
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'idle' as const, currentTask: undefined }
        : agent
    ));
  };

  const stopAgent = async (agentId: string) => {
    // Simulate API call to stop agent
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'idle' as const, progress: undefined, currentTask: undefined }
        : agent
    ));
  };

  const openAgentChat = (agent: Agent) => {
    setActiveChatAgent(agent);
    setChatOpen(true);
    
    // Load existing chat history
    const existingMessages = agentOutputs[agent.id] || [];
    setChatMessages(existingMessages);
    
    // Focus chat input
    setTimeout(() => {
      const chatInput = document.querySelector('#chat-input') as HTMLInputElement;
      if (chatInput) chatInput.focus();
    }, 100);
  };

  const openAgentSettings = (agent: Agent) => {
    setSelectedAgentForSettings(agent);
    setSettingsOpen(true);
  };

  const viewAgentOutputs = (agent: Agent) => {
    // This would open a modal showing agent outputs
    console.log(`Viewing outputs for ${agent.name}`);
    // For now, just show in console
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !activeChatAgent || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      agentId: activeChatAgent.id,
      type: 'user',
      content: chatInput,
      timestamp: new Date(),
      status: 'sent'
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsSending(true);

    try {
      // Simulate Claude API call
      const response = await simulateClaudeAPI(chatInput, activeChatAgent);
      
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        agentId: activeChatAgent.id,
        type: 'agent',
        content: response,
        timestamp: new Date(),
        status: 'sent',
        responseTime: Date.now() - userMessage.timestamp.getTime()
      };

      setChatMessages(prev => [...prev, agentMessage]);
      
      // Save to localStorage
      const allMessages = [...chatMessages, userMessage, agentMessage];
      saveChatHistory(activeChatAgent.id, allMessages);
      
      // Update agent outputs
      setAgentOutputs(prev => ({
        ...prev,
        [activeChatAgent.id]: allMessages
      }));

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        agentId: activeChatAgent.id,
        type: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: new Date(),
        status: 'error'
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const simulateClaudeAPI = async (message: string, agent: Agent): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simulate different agent responses based on category
    const responses = {
      'main-orchestrator': `I'm coordinating the AI agent army. Your request "${message}" has been analysed and delegated to the appropriate specialists. What would you like me to focus on next?`,
      'content-agents': `Content creation specialist here! I can help with "${message}". Let me generate some high-quality content that aligns with your brand voice and target audience.`,
      'research-agents': `Research mode activated! I'm analysing "${message}" and gathering comprehensive market intelligence. This will help inform your strategic decisions.`,
      'analytics-agents': `Data analysis in progress! I'm processing "${message}" and will provide actionable insights with visualisations and recommendations.`
    };
    
    return responses[agent.category] || `I'm processing your request: "${message}". How can I assist you further?`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refreshing agent statuses
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update last activity times
      setAgents(prev => prev.map(agent => ({
        ...agent,
        lastActivity: agent.status === 'working' ? 'Just now' : agent.lastActivity
      })));
      
      setError(null);
    } catch (error) {
      setError('Failed to refresh agent statuses');
    } finally {
      setIsRefreshing(false);
    }
  };

  const createNewAgent = () => {
    // This would open a modal to create a new agent
    console.log('Creating new agent...');
    // For now, just show in console
  };

  // Filter and group agents
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedAgents = filteredAgents.reduce((groups, agent) => {
    if (!groups[agent.category]) {
      groups[agent.category] = [];
    }
    groups[agent.category].push(agent);
    return groups;
  }, {} as Record<string, Agent[]>);

  const getCategoryColour = (category: string) => {
    switch (category) {
      case 'main-orchestrator': return 'border-blue-500';
      case 'content-agents': return 'border-purple-500';
      case 'research-agents': return 'border-green-500';
      case 'analytics-agents': return 'border-orange-500';
      default: return 'border-slate-600';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'main-orchestrator': return 'Main Orchestrator';
      case 'content-agents': return 'Content Agents';
      case 'research-agents': return 'Research Agents';
      case 'analytics-agents': return 'Analytics Agents';
      default: return 'Unknown';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>;
      case 'working':
        return <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>;
      case 'idle':
        return <div className="w-3 h-3 bg-slate-500 rounded-full"></div>;
      case 'error':
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      case 'offline':
        return <div className="w-3 h-3 bg-slate-700 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-slate-500 rounded-full"></div>;
    }
  };

  const toggleAgentExpansion = (agentId: string) => {
    setExpandedAgent(expandedAgent === agentId ? null : agentId);
  };

  const closeChat = () => {
    setChatOpen(false);
    setActiveChatAgent(null);
    setChatMessages([]);
  };

  const closeSettings = () => {
    setSettingsOpen(false);
    setSelectedAgentForSettings(null);
  };

  return (
    <div 
      className="min-h-screen bg-slate-900 text-slate-100"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-4 safe-top">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Agent Command Centre</h1>
            <p className="text-sm text-slate-400">Total Audio Promo AI Workforce</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 hover:bg-slate-700 rounded-lg transition-colours touch-target"
              onClick={() => setError(null)}
            >
              <Bell className="w-5 h-5" />
            </button>
            <button 
              className="p-2 hover:bg-slate-700 rounded-lg transition-colours touch-target"
              onClick={() => setError(null)}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-900 border-b border-red-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-200">{error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex space-x-2 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colours touch-target ${
              !selectedCategory 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All Agents
          </button>
          {['main-orchestrator', 'content-agents', 'research-agents', 'analytics-agents'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colours touch-target ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {getCategoryName(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-4 space-y-4 pb-24">
        {Object.entries(groupedAgents).map(([category, categoryAgents]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-200">
                {getCategoryName(category)}
              </h2>
              <button 
                className="p-2 hover:bg-slate-800 rounded-lg transition-colours touch-target"
                onClick={createNewAgent}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {categoryAgents.map(agent => (
                <div
                  key={agent.id}
                  className={`bg-slate-800 border-l-4 ${getCategoryColour(category)} rounded-r-lg p-4 transition-all duration-200 ${
                    expandedAgent === agent.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                >
                  {/* Agent Row Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex items-center space-x-2">
                        {getStatusIndicator(agent.status)}
                        <span className="text-sm text-slate-400">{agent.status}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-100">{agent.name}</h3>
                        <p className="text-sm text-slate-400">{agent.lastActivity}</p>
                        {agent.isOnline && (
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-slate-500">
                              {agent.responseTime}ms • {agent.tasksCompleted} tasks • {agent.successRate}% success
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {agent.currentTask && (
                        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full">
                          Working
                        </span>
                      )}
                      <button
                        onClick={() => toggleAgentExpansion(agent.id)}
                        className="p-2 hover:bg-slate-700 rounded transition-colours touch-target"
                      >
                        <ChevronRight 
                          className={`w-4 h-4 transition-transform ${
                            expandedAgent === agent.id ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Agent Details */}
                  {expandedAgent === agent.id && (
                    <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                      {agent.currentTask && (
                        <div className="space-y-2">
                          <p className="text-sm text-slate-300">Current Task:</p>
                          <p className="text-sm text-slate-400 bg-slate-700 p-3 rounded-lg">
                            {agent.currentTask}
                          </p>
                          {agent.progress !== undefined && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-400">
                                <span>Progress</span>
                                <span>{Math.round(agent.progress)}%</span>
                              </div>
                              <div className="w-full bg-slate-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${agent.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300">Quick Actions:</p>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleAgentAction(agent.id, 'chat')}
                            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colours text-sm touch-target"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <MessageCircle className="w-4 h-4" />
                            )}
                            <span>Chat</span>
                          </button>
                          <button
                            onClick={() => handleAgentAction(agent.id, 'configure')}
                            className="flex items-center justify-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white p-2 rounded-lg transition-colours text-sm touch-target"
                            disabled={isLoading}
                          >
                            <Cog className="w-4 h-4" />
                            <span>Configure</span>
                          </button>
                          <button
                            onClick={() => handleAgentAction(agent.id, 'view')}
                            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colours text-sm touch-target"
                            disabled={isLoading}
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>

                      {/* Control Actions */}
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300">Controls:</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAgentAction(agent.id, 'start')}
                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colours text-sm touch-target"
                            disabled={isLoading || agent.status === 'working'}
                          >
                            <Play className="w-4 h-4" />
                            <span>Start</span>
                          </button>
                          <button
                            onClick={() => handleAgentAction(agent.id, 'pause')}
                            className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg transition-colours text-sm touch-target"
                            disabled={isLoading || agent.status !== 'working'}
                          >
                            <Pause className="w-4 h-4" />
                            <span>Pause</span>
                          </button>
                          <button
                            onClick={() => handleAgentAction(agent.id, 'stop')}
                            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colours text-sm touch-target"
                            disabled={isLoading || agent.status === 'idle'}
                          >
                            <Square className="w-4 h-4" />
                            <span>Stop</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-4 py-3 safe-bottom">
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Quick find agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700 text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-blue-500 focus:outline-none touch-target"
            />
          </div>

          {/* Refresh Button */}
          <button 
            className="p-2 hover:bg-slate-700 rounded-lg transition-colours touch-target"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
          </button>

          {/* Add New Agent */}
          <button 
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colours touch-target"
            onClick={createNewAgent}
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* More Options */}
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colours touch-target">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      {chatOpen && activeChatAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-slate-800 w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[80vh] rounded-t-lg sm:rounded-lg flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getCategoryColour(activeChatAgent.category).replace('border-', 'bg-')}`}></div>
                <div>
                  <h3 className="font-medium text-slate-100">{activeChatAgent.name}</h3>
                  <p className="text-sm text-slate-400">Chat Interface</p>
                </div>
              </div>
              <button 
                onClick={closeChat}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colours touch-target"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
            >
              {chatMessages.length === 0 && (
                <div className="text-center text-slate-400 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Start a conversation with {activeChatAgent.name}</p>
                </div>
              )}
              
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : message.type === 'agent'
                      ? 'bg-slate-700 text-slate-100'
                      : 'bg-red-900 text-red-200'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.responseTime && (
                        <span>{message.responseTime}ms</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-slate-300">Agent is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex space-x-2">
                <input
                  id="chat-input"
                  type="text"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  className="flex-1 bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-400 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 touch-target"
                  disabled={isSending}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || isSending}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colours touch-target"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && selectedAgentForSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-slate-800 w-full h-full sm:h-auto sm:max-w-lg sm:max-h-[80vh] rounded-t-lg sm:rounded-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="font-medium text-slate-100">Configure {selectedAgentForSettings.name}</h3>
              <button 
                onClick={closeSettings}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colours touch-target"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Agent Name</label>
                <input
                  type="text"
                  defaultValue={selectedAgentForSettings.name}
                  className="w-full bg-slate-700 border border-slate-600 text-slate-100 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-slate-300">API Key</label>
                <input
                  type="password"
                  placeholder="Enter API key"
                  className="w-full bg-slate-700 border border-slate-600 text-slate-100 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Model</label>
                <select className="w-full bg-slate-700 border border-slate-600 text-slate-100 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200">
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="claude-3-haiku">Claude 3 Haiku</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Temperature</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.7"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Focused (0)</span>
                  <span>Creative (1)</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-700">
              <div className="flex space-x-2">
                <button
                  onClick={closeSettings}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colours touch-target"
                >
                  Cancel
                </button>
                <button
                  onClick={closeSettings}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colours touch-target"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Spacing for Bottom Navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export default AgentCommandCentre;
