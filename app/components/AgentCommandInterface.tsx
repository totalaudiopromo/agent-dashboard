'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  agent?: string;
  content: string;
  timestamp: Date;
  status?: 'sending' | 'processing' | 'complete' | 'error';
  taskId?: string;
}

interface AgentCommandInterfaceProps {
  onTaskCreated: (task: any) => void;
}

export default function AgentCommandInterface({ onTaskCreated }: AgentCommandInterfaceProps) {
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('orchestrator');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Agent Army Command Center ready. How can I assist you today?',
      timestamp: new Date(),
      status: 'complete'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agents = [
    { id: 'orchestrator', name: 'Main Orchestrator', description: 'Coordinates all agents' },
    { id: 'intel-research', name: 'Intel Research Agent', description: 'Contact analysis & research' },
    { id: 'content-creation', name: 'Content Creation Agent', description: 'Press releases & content' },
    { id: 'campaign-planner', name: 'Campaign Planner Agent', description: 'Strategic campaign planning' },
    { id: 'performance-monitor', name: 'Performance Monitor Agent', description: 'Analytics & optimization' },
    { id: 'playlist-curator', name: 'Playlist Curator Agent', description: 'Playlist targeting' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
      status: 'complete'
    };

    const processingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'agent',
      agent: agents.find(a => a.id === selectedAgent)?.name,
      content: 'Processing your request...',
      timestamp: new Date(),
      status: 'processing'
    };

    setMessages(prev => [...prev, userMessage, processingMessage]);
    setInput('');
    setIsProcessing(true);

    // Create task
    const task = {
      id: Date.now().toString(),
      type: selectedAgent,
      description: input.trim(),
      status: 'queued',
      timestamp: new Date(),
      estimatedDuration: getEstimatedDuration(selectedAgent, input.trim())
    };

    onTaskCreated(task);

    try {
      // Simulate agent processing
      await simulateAgentResponse(selectedAgent, input.trim(), processingMessage.id);
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === processingMessage.id 
          ? { ...msg, content: 'Error processing request. Please try again.', status: 'error' }
          : msg
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateAgentResponse = async (agentId: string, query: string, messageId: string) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    const responses = getAgentResponse(agentId, query);
    
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            content: responses.content,
            status: 'complete',
            taskId: responses.taskId
          }
        : msg
    ));
  };

  const getAgentResponse = (agentId: string, query: string) => {
    const taskId = `task-${Date.now()}`;
    
    const responses: Record<string, any> = {
      'intel-research': {
        content: `🔍 **Contact Intelligence Analysis Complete**

I've analysed the request: "${query}"

**Key Findings:**
• Identified 47 relevant contacts in target genre
• 89% contact accuracy with verified email addresses  
• Top priority contacts: BBC Radio 1, Spotify Editorial, NME
• Best outreach timing: Tuesday-Thursday, 10-11 AM

**Next Steps:**
1. Export enriched contact list to CSV
2. Generate personalized pitch templates
3. Schedule outreach campaign

**Files Ready:** \`contacts-analysis-${taskId}.csv\``,
        taskId
      },
      'content-creation': {
        content: `✍️ **Content Creation Complete**

Generated content for: "${query}"

**Deliverables Created:**
• Press release (SEO optimized, 350 words)
• Social media pack (Instagram, Twitter, TikTok)
• Email campaign template (3 variations)
• Blog pitch template (personalized)

**Content Highlights:**
• Compelling hook focusing on unique sound
• Industry-relevant keywords included
• Call-to-action optimized for conversion
• Brand voice consistent across platforms

**Files Ready:** \`content-pack-${taskId}.zip\``,
        taskId
      },
      'campaign-planner': {
        content: `📊 **Campaign Strategy Complete**

8-week promotion strategy for: "${query}"

**Campaign Timeline:**
**Weeks 1-2:** Pre-launch buzz building
**Weeks 3-4:** Release coordination  
**Weeks 5-6:** Peak promotion push
**Weeks 7-8:** Momentum maintenance

**Target Channels:**
• Spotify playlists (23 identified)
• Radio stations (15 priority targets)
• Music blogs (31 prospects)
• Social influencers (12 micro-influencers)

**Expected Results:** 50K+ streams, 15+ playlist adds

**Files Ready:** \`campaign-strategy-${taskId}.pdf\``,
        taskId
      },
      'performance-monitor': {
        content: `📈 **Performance Analysis Complete**

Real-time analytics for: "${query}"

**Current Metrics:**
• Total streams: 89,247 (+12% vs last week)
• Playlist additions: 23 new placements
• Social engagement: 156% above average
• Conversion rate: 4.7% (industry avg: 2.3%)

**Optimization Opportunities:**
1. Double down on Instagram Reels (highest ROI)
2. Target more UK-based playlists
3. Increase TikTok content frequency

**Alert:** Viral potential detected on "Midnight Echoes"

**Files Ready:** \`performance-report-${taskId}.pdf\``,
        taskId
      },
      'playlist-curator': {
        content: `🎵 **Curator Analysis Complete**

Playlist targeting research for: "${query}"

**Curators Identified:**
• 47 active playlist curators in target genre
• Average response rate: 31% (above industry standard)
• Best performing playlists: 10K-100K followers
• Optimal pitch timing: Monday mornings

**Top Opportunities:**
1. "Indie Electronic Gems" (67K followers)
2. "New Music Friday UK" (134K followers)  
3. "Electronic Chill Vibes" (45K followers)

**Custom Pitch Templates:** Ready for each curator

**Files Ready:** \`curator-outreach-${taskId}.xlsx\``,
        taskId
      },
      'orchestrator': {
        content: `🎯 **Orchestrator Analysis Complete**

Coordinated multi-agent response for: "${query}"

**Task Distribution:**
• Intel Research: Contact discovery (✓ Complete)
• Content Creation: Asset generation (⏳ In Progress)
• Campaign Planning: Strategy development (📋 Queued)
• Performance Monitoring: Baseline metrics (✓ Complete)

**Coordination Summary:**
All agents working in sync to deliver comprehensive solution. Estimated completion: 15 minutes.

**Next Steps:**
1. Review Intel Research findings
2. Approve content assets when ready
3. Implement coordinated campaign launch

**Integration Status:** All systems operational`,
        taskId
      }
    };

    return responses[agentId] || {
      content: `I've processed your request: "${query}". This agent is currently in development. Please try the Main Orchestrator for complex requests.`,
      taskId
    };
  };

  const getEstimatedDuration = (agentId: string, query: string) => {
    const baseTimes: Record<string, number> = {
      'intel-research': 3,
      'content-creation': 5,
      'campaign-planner': 8,
      'performance-monitor': 2,
      'playlist-curator': 4,
      'orchestrator': 10
    };

    const complexity = query.length > 100 ? 1.5 : query.split(' ').length > 10 ? 1.2 : 1;
    return Math.round((baseTimes[agentId] || 5) * complexity);
  };

  const handleQuickAction = (action: string, agent: string) => {
    const quickActions: Record<string, string> = {
      'research-contacts': 'Find new music industry contacts for indie electronic genre in the UK market',
      'create-content': 'Generate a press release and social media content for our latest single release',
      'analyze-performance': 'Analyze current campaign performance and provide optimization recommendations',
      'plan-campaign': 'Create a comprehensive 6-week promotion campaign strategy for our upcoming EP release',
      'custom-request': 'I have a specific request for the Agent Army...'
    };

    setInput(quickActions[action] || '');
    setSelectedAgent(agent);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'complete':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-gray-700" />
          <span>Agent Command Interface</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-full">
        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-600 mb-3">Quick Actions:</p>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickAction('research-contacts', 'intel-research')}
              className="text-xs"
            >
              Research Contacts
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickAction('create-content', 'content-creation')}
              className="text-xs"
            >
              Create Content
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickAction('analyze-performance', 'performance-monitor')}
              className="text-xs"
            >
              Analyze Performance
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickAction('plan-campaign', 'campaign-planner')}
              className="text-xs"
            >
              Plan Campaign
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickAction('custom-request', 'orchestrator')}
              className="text-xs"
            >
              Custom Request
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-gray-900 text-white' 
                  : message.type === 'system'
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 mt-1">
                    {message.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      getStatusIcon(message.status)
                    )}
                  </div>
                  <div className="flex-1">
                    {message.agent && (
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        {message.agent}
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
          <div className="space-y-3">
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
            >
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} - {agent.description}
                </option>
              ))}
            </select>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your Agent Army anything..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                disabled={isProcessing}
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || isProcessing}
                className="px-4 py-2"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}