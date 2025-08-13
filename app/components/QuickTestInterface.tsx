'use client';

import React, { useState } from 'react';
import { Play, Brain, FileText, TrendingUp, Loader2, CheckCircle, AlertCircle, Copy, Download, Music, Headphones, Mic, Zap } from 'lucide-react';

interface TestResult {
  success: boolean;
  duration: number;
  response?: any;
  error?: string;
  timestamp: Date;
}

export default function QuickTestInterface() {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [testInputs, setTestInputs] = useState({
    artistName: 'Luna Rivers',
    trackTitle: 'Midnight Echoes',
    genre: 'Indie Electronic',
    contactEmail: 'demo@musicblog.com',
    playlistUrl: 'https://open.spotify.com/playlist/test',
    contentType: 'press-release'
  });

  const runTest = async (testType: string, testData: any) => {
    setActiveTest(testType);
    const startTime = Date.now();

    try {
      let response;
      let apiEndpoint = '';
      
      switch (testType) {
        case 'intel-research':
          // Test Audio Intel agent
          apiEndpoint = process.env.NODE_ENV === 'production' 
            ? 'https://audio-intel.totalaudiopromo.com/api/ai-agent'
            : 'http://localhost:3000/api/ai-agent';
          response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              agentType: 'intel-research-agent',
              query: `Analyze this music industry contact for strategic intelligence: ${testData.contactEmail}. Provide campaign recommendations and success probability assessment.`,
              context: testData
            })
          });
          break;

        case 'playlist-curation':
          // Test Playlist Pulse agent
          apiEndpoint = process.env.NODE_ENV === 'production' 
            ? 'https://pulse.totalaudiopromo.com/api/curator-analysis'
            : 'http://localhost:3001/api/curator-analysis';
          response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              artistName: testData.artistName,
              trackTitle: testData.trackTitle,
              genre: testData.genre,
              playlistUrl: testData.playlistUrl
            })
          });
          break;

        case 'content-generation':
          // Test Voice Echo agent
          apiEndpoint = process.env.NODE_ENV === 'production' 
            ? 'https://voice-echo.totalaudiopromo.com/api/content-generation'
            : 'http://localhost:3002/api/content-generation';
          response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              artistName: testData.artistName,
              trackTitle: testData.trackTitle,
              genre: testData.genre,
              contentType: testData.contentType
            })
          });
          break;

        case 'campaign-analysis':
          // Test cross-platform campaign coordination
          response = await fetch('/api/ai-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              agentType: 'campaign-planner-agent',
              query: `Create a comprehensive multi-platform campaign strategy for ${testData.artistName} - "${testData.trackTitle}". Include Audio Intel contact strategy, Playlist Pulse curator targeting, and Voice Echo content creation timeline.`,
              context: {
                ...testData,
                crossPlatform: true,
                platforms: ['audio-intel', 'playlist-pulse', 'voice-echo']
              }
            })
          });
          break;

        case 'performance-monitoring':
          // Test performance monitoring across platforms
          response = await fetch('/api/ai-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              agentType: 'performance-monitor-agent',
              query: `Monitor campaign performance across Audio Intel, Playlist Pulse, and Voice Echo for ${testData.artistName} - "${testData.trackTitle}". Provide real-time analytics and optimization recommendations.`,
              context: {
                ...testData,
                monitoringScope: 'ecosystem-wide'
              }
            })
          });
          break;

        case 'cross-platform-sync':
          // Test cross-platform data synchronization
          response = await fetch('/api/cross-platform-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              operation: 'sync-campaign-data',
              campaignId: 'test-campaign',
              platforms: ['audio-intel', 'playlist-pulse', 'voice-echo'],
              data: testData
            })
          });
          break;

        default:
          throw new Error('Unknown test type');
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      setTestResults(prev => ({
        ...prev,
        [testType]: {
          success: data.success !== false && response.ok,
          duration,
          response: data,
          timestamp: new Date()
        }
      }));

    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResults(prev => ({
        ...prev,
        [testType]: {
          success: false,
          duration,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date()
        }
      }));
    } finally {
      setActiveTest(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatResponse = (response: any) => {
    if (typeof response === 'string') return response;
    return JSON.stringify(response, null, 2);
  };

  const TestButton = ({ 
    testType, 
    title, 
    description, 
    icon: Icon, 
    color,
    platform 
  }: { 
    testType: string; 
    title: string; 
    description: string; 
    icon: any; 
    color: string;
    platform: string;
  }) => {
    const isActive = activeTest === testType;
    const result = testResults[testType];
    
    return (
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="text-sm text-gray-400">{description}</p>
              <p className="text-xs text-gray-500 mt-1">Platform: {platform}</p>
            </div>
          </div>
          
          {result && (
            <div className={`flex items-center space-x-1 text-sm ${result.success ? 'text-green-400' : 'text-red-400'}`}>
              {result.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{result.duration}ms</span>
            </div>
          )}
        </div>

        <button
          onClick={() => runTest(testType, testInputs)}
          disabled={isActive}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
            isActive
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600 text-black'
          }`}
        >
          {isActive ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Testing {platform}...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Test {platform}</span>
            </>
          )}
        </button>

        {/* Test Result */}
        {result && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className={`text-sm font-medium ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                {result.success ? `${platform} Test Passed` : `${platform} Test Failed`}
              </h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(formatResponse(result.response || result.error))}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Copy result"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-500">
                  {result.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>

            {result.success && result.response && (
              <div className="space-y-2">
                {result.response.response && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Response Preview:</p>
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {typeof result.response.response === 'string' 
                        ? result.response.response.substring(0, 200) + '...'
                        : 'Complex response object'
                      }
                    </p>
                  </div>
                )}
                
                {result.response.recommendations && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Recommendations:</p>
                    <p className="text-sm text-yellow-400">{result.response.recommendations.length} items</p>
                  </div>
                )}

                {result.response.data && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Data Included:</p>
                    <p className="text-sm text-blue-400">✓ {platform} data available</p>
                  </div>
                )}
              </div>
            )}

            {result.error && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Error:</p>
                <p className="text-sm text-red-400">{result.error}</p>
                <p className="text-xs text-gray-500 mt-1">This may be expected if the platform is not running locally</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Test Input Configuration */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Ecosystem Test Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Artist Name</label>
            <input
              type="text"
              value={testInputs.artistName}
              onChange={(e) => setTestInputs(prev => ({ ...prev, artistName: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              placeholder="Artist Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Track Title</label>
            <input
              type="text"
              value={testInputs.trackTitle}
              onChange={(e) => setTestInputs(prev => ({ ...prev, trackTitle: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              placeholder="Track Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
            <input
              type="text"
              value={testInputs.genre}
              onChange={(e) => setTestInputs(prev => ({ ...prev, genre: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              placeholder="Genre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
            <input
              type="email"
              value={testInputs.contactEmail}
              onChange={(e) => setTestInputs(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              placeholder="Contact Email"
            />
          </div>
        </div>
      </div>

      {/* Platform-Specific Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <TestButton
          testType="intel-research"
          title="Test Audio Intel"
          description="Contact analysis and strategic intelligence"
          icon={Brain}
          color="bg-blue-500/20 text-blue-400"
          platform="Audio Intel"
        />

        <TestButton
          testType="playlist-curation"
          title="Test Playlist Pulse"
          description="Curator analysis and playlist targeting"
          icon={Music}
          color="bg-green-500/20 text-green-400"
          platform="Playlist Pulse"
        />

        <TestButton
          testType="content-generation"
          title="Test Voice Echo"
          description="Content creation and optimization"
          icon={Mic}
          color="bg-purple-500/20 text-purple-400"
          platform="Voice Echo"
        />

        <TestButton
          testType="campaign-analysis"
          title="Multi-Platform Campaign"
          description="Cross-ecosystem campaign strategy"
          icon={TrendingUp}
          color="bg-orange-500/20 text-orange-400"
          platform="Cross-Platform"
        />

        <TestButton
          testType="performance-monitoring"
          title="Performance Monitor"
          description="Real-time ecosystem analytics"
          icon={TrendingUp}
          color="bg-pink-500/20 text-pink-400"
          platform="Performance Monitor"
        />

        <TestButton
          testType="cross-platform-sync"
          title="Data Synchronization"
          description="Cross-platform data sync test"
          icon={Zap}
          color="bg-cyan-500/20 text-cyan-400"
          platform="Sync Engine"
        />
      </div>

      {/* System Test Results */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Ecosystem Test Results</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const results = Object.entries(testResults).map(([test, result]) => ({
                  test,
                  platform: test,
                  success: result.success,
                  duration: result.duration,
                  timestamp: result.timestamp,
                  response: result.response || result.error
                }));
                const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ecosystem-test-results-${Date.now()}.json`;
                a.click();
              }}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Results</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {Object.values(testResults).filter(r => r.success).length}
            </div>
            <div className="text-sm text-gray-400">Tests Passed</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-red-400">
              {Object.values(testResults).filter(r => !r.success).length}
            </div>
            <div className="text-sm text-gray-400">Tests Failed</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">
              {Object.values(testResults).length > 0 
                ? Math.round(Object.values(testResults).reduce((acc, r) => acc + r.duration, 0) / Object.values(testResults).length)
                : 0
              }ms
            </div>
            <div className="text-sm text-gray-400">Avg Response Time</div>
          </div>
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">
              {Object.keys(testResults).length > 0 
                ? Math.round((Object.values(testResults).filter(r => r.success).length / Object.values(testResults).length) * 100)
                : 0
              }%
            </div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </div>
        </div>

        {Object.keys(testResults).length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Run ecosystem tests to see results here
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Ecosystem Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => {
              const tests = ['intel-research', 'playlist-curation', 'content-generation', 'campaign-analysis'];
              tests.forEach((test, index) => {
                setTimeout(() => runTest(test, testInputs), index * 3000);
              });
            }}
            className="p-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black rounded-lg font-medium transition-all"
          >
            Test All Platforms
          </button>
          <button
            onClick={() => setTestResults({})}
            className="p-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
          >
            Clear Results
          </button>
          <button
            onClick={() => {
              const artists = ['Luna Rivers', 'Alex Storm', 'Maya Chen', 'DJ Phoenix', 'Stellar Nova'];
              const genres = ['Indie Electronic', 'Pop', 'Rock', 'Electronic', 'Hip-Hop'];
              const randomArtist = artists[Math.floor(Math.random() * artists.length)];
              const randomGenre = genres[Math.floor(Math.random() * genres.length)];
              setTestInputs({
                artistName: randomArtist,
                trackTitle: `Track ${Math.floor(Math.random() * 100)}`,
                genre: randomGenre,
                contactEmail: `test${Math.floor(Math.random() * 100)}@demo.com`,
                playlistUrl: 'https://open.spotify.com/playlist/test',
                contentType: 'press-release'
              });
            }}
            className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
          >
            Random Test Data
          </button>
          <button
            onClick={() => window.open('/agent-dashboard', '_blank')}
            className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
          >
            New Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}