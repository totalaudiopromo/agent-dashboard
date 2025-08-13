# 🤖 Total Audio Promo - Agent Dashboard

A professional, real-time dashboard for monitoring and managing AI agents in the music promotion industry. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎯 **Core Dashboard**
- **Business Health Metrics** - MRR, customer count, agent status
- **AI Agent Workforce** - Real-time status of 5 specialized agents
- **Platform Status** - Audio Intel, Playlist Pulse, Voice Echo monitoring
- **Live Activity Feed** - Real-time updates and notifications
- **Quick Actions** - Platform analysis and management tools

### 🚀 **Agent Output Viewer**
- **Real-time Agent Work Display** - Live feed of agent completions
- **Professional Output Cards** - Expandable cards with full details
- **Success Metrics** - Accuracy, relevance, completeness tracking
- **File Management** - Download, copy, and view generated content
- **Advanced Filtering** - By agent type and task category

### 🔗 **Integrations**
- **Notion Command Center** - Automated metrics and layout generation
- **Real-time Data Sync** - Live updates from agent systems
- **API-Ready** - Built-in endpoints for agent system integration

## 🏗️ Architecture

```
app/
├── components/           # React components
│   ├── AgentOutputViewer.tsx    # Agent work display
│   ├── AgentStatusGrid.tsx      # Agent status monitoring
│   ├── BusinessMetricsDashboard.tsx  # Business metrics
│   └── ui/              # Reusable UI components
├── api/                 # API routes
│   ├── notion/          # Notion integration
│   └── agent-outputs/   # Agent data endpoints
├── services/            # Business logic services
└── lib/                 # Utility functions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd agent-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   NOTION_TOKEN=your_notion_integration_token
   NOTION_COMMAND_CENTER_ID=your_notion_page_id
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Agent System Integration

### Connect Your Agents

1. **Update the API route** in `app/api/agent-outputs/route.ts`
2. **Configure your agent system** to send data in the expected format
3. **Set up webhooks** for real-time updates

### Data Structure

```typescript
interface AgentOutput {
  id: string;
  agentName: string;        // REMIX, SCOUT, TEMPO, etc.
  agentRole: string;        // Content Creation, Research, etc.
  taskType: string;         // Task category
  inputSummary: string;     // What was requested
  outputPreview: string;    // First 100 chars
  fullOutput: string;       // Complete output
  timestamp: Date;          // When completed
  status: 'Success' | 'Error' | 'In Progress';
  executionTime: number;    // Time in seconds
  successMetrics: {
    accuracy?: number;       // 0-100
    relevance?: number;     // 0-100
    completeness?: number;  // 0-100
    timeSaved?: number;     // Time saved
  };
  generatedFiles?: Array<{
    name: string;
    type: 'text' | 'code' | 'image' | 'link';
    url?: string;
    content?: string;
  }>;
  errors?: string[];
  warnings?: string[];
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NOTION_TOKEN` | Notion integration token | Yes |
| `NOTION_COMMAND_CENTER_ID` | Notion page ID for command center | Yes |

### Customization

- **Agent Names**: Update `getAgentIcon()` in `AgentOutputViewer.tsx`
- **Metrics**: Modify business metrics in dashboard components
- **Styling**: Customize with Tailwind CSS classes
- **API Endpoints**: Extend API routes for additional functionality

## 📱 Responsive Design

- **Mobile-first** approach
- **Responsive grid** layouts
- **Touch-friendly** interactions
- **Optimized** for all screen sizes

## 🎨 UI Components

Built with a custom design system using:
- **Tailwind CSS** for styling
- **Custom UI components** for consistency
- **Gradient backgrounds** and modern aesthetics
- **Interactive elements** with hover states

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid hook call" error**
   - Ensure all hooks are inside component functions
   - Check for duplicate React installations

2. **Notion API errors**
   - Verify token and page ID in `.env.local`
   - Ensure Notion integration has proper permissions

3. **Build errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### Development Tips

- Use `npm run dev` for development
- Check browser console for errors
- Verify API endpoints with browser dev tools
- Test responsive design on different screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for Total Audio Promo.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the setup guides
- Contact the development team

---

**Built with ❤️ for Total Audio Promo**

*Professional AI Agent Management Dashboard*
# agent-dashboard
