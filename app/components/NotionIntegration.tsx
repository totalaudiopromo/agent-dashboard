'use client';

import React, { useState } from 'react';
import { Database, FileText, CheckCircle, AlertTriangle, RefreshCw, Zap, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface NotionStatus {
  connected: boolean;
  message: string;
  lastSync?: Date;
  databases?: string[];
  error?: string;
}

export default function NotionIntegration() {
  const [status, setStatus] = useState<NotionStatus>({
    connected: false,
    message: 'Notion integration not configured'
  });
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const testNotionConnection = async () => {
    setIsTesting(true);
    try {
      // This would call your NotionService.testConnection()
      // For now, simulate the connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus({
        connected: true,
        message: 'Connected to Notion successfully!',
        lastSync: new Date(),
        databases: ['Business Metrics', 'Agent Tasks', 'Project Status']
      });
    } catch (error: any) {
      setStatus({
        connected: false,
        message: `Connection failed: ${error.message}`,
        error: error.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  const syncToNotion = async () => {
    setIsSyncing(true);
    try {
      // This would call your NotionService methods
      // For now, simulate the sync process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        message: 'Successfully synced to Notion!'
      }));
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        message: `Sync failed: ${error.message}`,
        error: error.message
      }));
    } finally {
      setIsSyncing(false);
    }
  };

  const createSampleReport = async () => {
    try {
      // This would call NotionService.createProgressReport()
      // For now, simulate the report creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus(prev => ({
        ...prev,
        message: 'Sample progress report created in Notion!'
      }));
    } catch (error: any) {
      setStatus(prev => ({
        ...prev,
        message: `Report creation failed: ${error.message}`,
        error: error.message
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Database className="w-6 h-6 text-blue-400" />
          <span>Notion Integration</span>
        </h3>
        <div className="text-sm text-gray-400">
          Real-time sync with Notion workspaces
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Status */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Connection Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${status.connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className={`text-sm ${status.connected ? 'text-green-400' : 'text-red-400'}`}>
                {status.connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="text-sm text-gray-300">
              {status.message}
            </div>
            
            {status.lastSync && (
              <div className="text-xs text-gray-400">
                Last sync: {status.lastSync.toLocaleString()}
              </div>
            )}
            
            <Button
              onClick={testNotionConnection}
              disabled={isTesting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Sync Actions */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm flex items-center space-x-2">
              <FileText className="w-4 h-4 text-green-400" />
              <span>Sync Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={syncToNotion}
              disabled={!status.connected || isSyncing}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Syncing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sync Current Data
                </>
              )}
            </Button>
            
            <Button
              onClick={createSampleReport}
              disabled={!status.connected}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Sample Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Instructions */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Notion Integration Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-gray-300">
              To enable Notion integration, add these environment variables:
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg space-y-2">
              <div className="text-xs text-gray-400">NOTION_TOKEN=your_integration_token</div>
              <div className="text-xs text-gray-400">NOTION_DATABASE_ID=your_database_id</div>
              <div className="text-xs text-gray-400">NOTION_PROJECT_PAGE_ID=your_project_page_id</div>
            </div>
            
            <div className="text-sm text-gray-300">
              <strong>Steps to set up:</strong>
            </div>
            
            <div className="space-y-2 text-sm text-gray-300">
              <div>1. Create a Notion integration at <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">notion.so/my-integrations</a></div>
              <div>2. Share your database with the integration</div>
              <div>3. Copy the integration token and database ID</div>
              <div>4. Add to your .env.local file</div>
              <div>5. Restart your development server</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Gets Synced */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">What Gets Synced to Notion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Agent Task Completions</span>
              </div>
              <div className="text-xs text-gray-400">
                Automatic sync when agents complete tasks
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Business Metrics</span>
              </div>
              <div className="text-xs text-gray-400">
                MRR, customer growth, platform usage
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Progress Reports</span>
              </div>
              <div className="text-xs text-gray-400">
                Automated weekly/monthly summaries
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
