'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, CheckCircle2, Clock, AlertCircle, Zap, Brain, Music, Headphones, Target, ArrowRight, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface OrchestratorMessage {
  id: string;
  type: 'user' | 'orchestrator' | 'agent-delegation' | 'agent-response' | 'system';
  content: string;
  timestamp: Date;
  status: 'sending' | 'processing' | 'delegating' | 'complete' | 'error';
  agent?: string;
  platform?: string;
  taskId?: string;
  progress?: number;
  delegationSteps?: string[];
}

interface DelegationStep {
  id: string;
  agent: string;
  platform: string;
  task: string;
  status: 'pending' | 'delegated' | 'in-progress' | 'complete' | 'error';
  progress: number;
  estimatedDuration: number;
  startedAt?: Date;
  completedAt?: Date;
  result?: string;
}

export default function UnifiedOrchestratorInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<OrchestratorMessage[]>([
    {
      id: '1',
      type: 'system',
      content: '🎯 Unified Orchestrator ready. Give me ONE command and I\'ll delegate to the right agents automatically.',
      timestamp: new Date(),
      status: 'complete'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [delegationSteps, setDelegationSteps] = useState<DelegationStep[]>([]);
  const [activeDelegations, setActiveDelegations] = useState<DelegationStep[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Agent mapping for automatic delegation
  const agentMapping = {
    'contact research': { agent: 'Intel Research Agent', platform: 'audio-intel' },
    'contact analysis': { agent: 'Intel Research Agent', platform: 'audio-intel' },
    'database enrichment': { agent: 'Intel Research Agent', platform: 'audio-intel' },
    'playlist pitching': { agent: 'Playlist Curator Agent', platform: 'playlist-pulse' },
    'curator outreach': { agent: 'Playlist Curator Agent', platform: 'playlist-pulse' },
    'campaign planning': { agent: 'Campaign Planner Agent', platform: 'cross-platform' },
    'strategy development': { agent: 'Campaign Planner Agent', platform: 'cross-platform' },
    'content creation': { agent: 'Content Creation Agent', platform: 'voice-echo' },
    'press release': { agent: 'Content Creation Agent', platform: 'voice-echo' },
    'social media': { agent: 'Content Creation Agent', platform: 'voice-echo' },
    'performance monitoring': { agent: 'Performance Monitor Agent', platform: 'cross-platform' },
    'viral detection': { agent: 'Performance Monitor Agent', platform: 'cross-platform' },
    'testing': { agent: 'Testing Agent', platform: 'cross-platform' },
    'documentation': { agent: 'Documentation Agent', platform: 'cross-platform' }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: OrchestratorMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
      status: 'complete'
    };

    const orchestratorMessage: OrchestratorMessage = {
      id: (Date.now() + 1).toString(),
      type: 'orchestrator',
      content: `🎯 Analyzing your request: "${input.trim()}"\n\nLet me break this down and delegate to the right agents...`,
      timestamp: new Date(),
      status: 'processing'
    };

    setMessages(prev => [...prev, userMessage, orchestratorMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Analyze the request and create delegation steps
      const steps = await analyzeAndDelegate(input.trim());
      
      // Update orchestrator message
      setMessages(prev => prev.map(msg => 
        msg.id === orchestratorMessage.id 
          ? { ...msg, content: `🎯 Request analyzed! I've identified ${steps.length} tasks to delegate:\n\n${steps.map(step => `• ${step.task} → ${step.agent}`).join('\n')}`, status: 'complete' }
          : msg
      ));

      // Start delegation process
      await executeDelegation(steps);
      
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === orchestratorMessage.id 
          ? { ...msg, content: '❌ Error analyzing request. Please try again.', status: 'error' }
          : msg
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeAndDelegate = async (request: string): Promise<DelegationStep[]> => {
    // Simulate AI analysis of the request
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const steps: DelegationStep[] = [];
    const requestLower = request.toLowerCase();
    
    // Determine which agents to delegate to based on keywords
    if (requestLower.includes('contact') || requestLower.includes('research') || requestLower.includes('database')) {
      steps.push({
        id: `step-${Date.now()}-1`,
        agent: 'Intel Research Agent',
        platform: 'audio-intel',
        task: 'Contact research and database enrichment',
        status: 'pending',
        progress: 0,
        estimatedDuration: 5
      });
    }
    
    if (requestLower.includes('playlist') || requestLower.includes('curator') || requestLower.includes('pitch')) {
      steps.push({
        id: `step-${Date.now()}-2`,
        agent: 'Playlist Curator Agent',
        platform: 'playlist-pulse',
        task: 'Playlist curator outreach and pitching',
        status: 'pending',
        progress: 0,
        estimatedDuration: 8
      });
    }
    
    if (requestLower.includes('campaign') || requestLower.includes('strategy') || requestLower.includes('plan')) {
      steps.push({
        id: `step-${Date.now()}-3`,
        agent: 'Campaign Planner Agent',
        platform: 'cross-platform',
        task: 'Campaign strategy development',
        status: 'pending',
        progress: 0,
        estimatedDuration: 10
      });
    }
    
    if (requestLower.includes('content') || requestLower.includes('press') || requestLower.includes('social')) {
      steps.push({
        id: `step-${Date.now()}-4`,
        agent: 'Content Creation Agent',
        platform: 'voice-echo',
        task: 'Content creation and media generation',
        status: 'pending',
        progress: 0,
        estimatedDuration: 6
      });
    }
    
    // If no specific tasks identified, create a general research task
    if (steps.length === 0) {
      steps.push({
        id: `step-${Date.now()}-5`,
        agent: 'Intel Research Agent',
        platform: 'audio-intel',
        task: 'General research and analysis',
        status: 'pending',
        progress: 0,
        estimatedDuration: 7
      });
    }
    
    setDelegationSteps(steps);
    return steps;
  };

  const executeDelegation = async (steps: DelegationStep[]) => {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Add delegation message
      const delegationMessage: OrchestratorMessage = {
        id: `delegation-${step.id}`,
        type: 'agent-delegation',
        content: `🚀 Delegating to ${step.agent} (${step.platform}):\n${step.task}`,
        timestamp: new Date(),
        status: 'delegating',
        agent: step.agent,
        platform: step.platform,
        taskId: step.id
      };
      
      setMessages(prev => [...prev, delegationMessage]);
      
      // Update step status
      setDelegationSteps(prev => prev.map(s => 
        s.id === step.id ? { ...s, status: 'delegated' } : s
      ));
      
      // Simulate agent processing
      await simulateAgentWork(step);
      
      // Update delegation message
      setMessages(prev => prev.map(msg => 
        msg.id === delegationMessage.id 
          ? { ...msg, content: `✅ ${step.agent} completed: ${step.task}`, status: 'complete' }
          : msg
      ));
      
      // Add agent response
      const responseMessage: OrchestratorMessage = {
        id: `response-${step.id}`,
        type: 'agent-response',
        content: generateAgentResponse(step),
        timestamp: new Date(),
        status: 'complete',
        agent: step.agent,
        platform: step.platform,
        taskId: step.id
      };
      
      setMessages(prev => [...prev, responseMessage]);
      
      // Wait before next delegation
      if (i < steps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Add completion message
    const completionMessage: OrchestratorMessage = {
      id: `completion-${Date.now()}`,
      type: 'orchestrator',
      content: `🎉 All tasks completed! Here's what was accomplished:\n\n${steps.map(step => `✅ ${step.agent}: ${step.task}`).join('\n')}\n\nYour request has been fully processed across all relevant platforms.`,
      timestamp: new Date(),
      status: 'complete'
    };
    
    setMessages(prev => [...prev, completionMessage]);
  };

  const simulateAgentWork = async (step: DelegationStep) => {
    // Update step to in-progress
    setDelegationSteps(prev => prev.map(s => 
      s.id === step.id ? { ...s, status: 'in-progress', startedAt: new Date() } : s
    ));
    
    // Simulate progress updates
    const duration = step.estimatedDuration * 1000; // Convert to milliseconds
    const interval = 500; // Update every 500ms
    const steps = Math.ceil(duration / interval);
    
    for (let i = 0; i < steps; i++) {
      await new Promise(resolve => setTimeout(resolve, interval));
      const progress = Math.min(100, ((i + 1) / steps) * 100);
      
      setDelegationSteps(prev => prev.map(s => 
        s.id === step.id ? { ...s, progress } : s
      ));
    }
    
    // Mark as complete
    setDelegationSteps(prev => prev.map(s => 
      s.id === step.id ? { ...s, status: 'complete', progress: 100, completedAt: new Date() } : s
    ));
  };

  const generateAgentResponse = (step: DelegationStep): string => {
    const responses = {
      'Intel Research Agent': `🔍 Research Complete!\n\n• Analyzed ${Math.floor(Math.random() * 100) + 50} relevant contacts\n• Generated ${Math.floor(Math.random() * 20) + 10} strategic insights\n• Database updated with latest intelligence\n• Ready for next phase of your request`,
      'Playlist Curator Agent': `🎵 Playlist Outreach Complete!\n\n• Contacted ${Math.floor(Math.random() * 30) + 20} curators\n• Received ${Math.floor(Math.random() * 15) + 5} responses\n• Secured ${Math.floor(Math.random() * 8) + 2} playlist placements\n• Campaign performance optimized`,
      'Campaign Planner Agent': `📋 Strategy Development Complete!\n\n• Created comprehensive campaign timeline\n• Identified ${Math.floor(Math.random() * 5) + 3} key audience segments\n• Developed cross-platform integration plan\n• Performance metrics framework established`,
      'Content Creation Agent': `✍️ Content Generation Complete!\n\n• Press release optimized for maximum impact\n• Social media pack with ${Math.floor(Math.random() * 10) + 5} variations\n• Email campaign templates created\n• All content ready for deployment`,
      'Performance Monitor Agent': `📊 Monitoring Complete!\n\n• All campaigns tracked in real-time\n• ${Math.floor(Math.random() * 5) + 2} viral opportunities detected\n• Performance alerts configured\n• Optimization recommendations ready`,
      'Testing Agent': `🧪 Testing Complete!\n\n• Quality assurance checks passed\n• ${Math.floor(Math.random() * 10) + 5} test scenarios executed\n• Bug reports generated and resolved\n• System stability confirmed`,
      'Documentation Agent': `📚 Documentation Complete!\n\n• Process guides updated\n• ${Math.floor(Math.random() * 8) + 3} new tutorials created\n• Knowledge base expanded\n• Training materials ready`
    };
    
    return responses[step.agent as keyof typeof responses] || 'Task completed successfully!';
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="w-4 h-4 text-blue-400" />;
      case 'orchestrator': return <Bot className="w-4 h-4 text-purple-400" />;
      case 'agent-delegation': return <ArrowRight className="w-4 h-4 text-yellow-400" />;
      case 'agent-response': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'system': return <Zap className="w-4 h-4 text-gray-400" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case 'user': return 'bg-blue-500/10 border-blue-500/20 text-blue-100';
      case 'orchestrator': return 'bg-purple-500/10 border-purple-500/20 text-purple-100';
      case 'agent-delegation': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-100';
      case 'agent-response': return 'bg-green-500/10 border-green-500/20 text-green-100';
      case 'system': return 'bg-gray-500/10 border-gray-500/20 text-gray-100';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Zap className="w-6 h-6 text-purple-400" />
          <span>Unified Orchestrator Interface</span>
        </h3>
        <div className="text-sm text-gray-400">
          One command → Automatic delegation to the right agents
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-700 h-96">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Orchestrator Chat</CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border ${getMessageStyle(message.type)}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getMessageIcon(message.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium mb-1">
                        {message.type === 'user' && 'You'}
                        {message.type === 'orchestrator' && '🎯 Orchestrator'}
                        {message.type === 'agent-delegation' && `🚀 Delegating to ${message.agent}`}
                        {message.type === 'agent-response' && `✅ ${message.agent}`}
                        {message.type === 'system' && 'System'}
                      </div>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Give me ONE command (e.g., 'Research UK indie labels and create a campaign')"
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  disabled={isProcessing}
                />
                <Button
                  type="submit"
                  disabled={isProcessing || !input.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Delegation Status */}
        <div className="space-y-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Delegation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {delegationSteps.map((step) => (
                  <div key={step.id} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{step.agent}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        step.status === 'pending' ? 'bg-gray-500/20 text-gray-400' :
                        step.status === 'delegated' ? 'bg-blue-500/20 text-blue-400' :
                        step.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                        step.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {step.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-300 mb-1">{step.task}</div>
                    
                    {step.status !== 'pending' && (
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${step.progress}%` }}
                        ></div>
                      </div>
                    )}
                    
                    {step.status === 'in-progress' && (
                      <div className="text-xs text-gray-400">
                        {step.progress.toFixed(0)}% complete
                      </div>
                    )}
                  </div>
                ))}
                
                {delegationSteps.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-4">
                    No active delegations
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Commands */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">Quick Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  'Research UK indie labels',
                  'Create playlist campaign',
                  'Generate press release',
                  'Monitor viral opportunities',
                  'Plan cross-platform strategy'
                ].map((command, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(command)}
                    className="w-full text-left text-xs text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded transition-colors"
                  >
                    {command}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
