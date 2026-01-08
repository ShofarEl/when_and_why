# Railway Deployment Guide

Complete guide for deploying the AI-Assisted Data Science Study backend to Railway.

## 🚀 Quick Railway Setup

### 1. Install Railway CLI

```bash
# Install Railway CLI globally
npm install -g @railway/cli

# Or using curl (Linux/macOS)
curl -fsSL https://railway.app/install.sh | sh

# Or using PowerShell (Windows)
iwr https://railway.app/install.ps1 | iex
```

### 2. Login to Railway

```bash
# Login to your Railway account
railway login

# Verify login
railway whoami
```

### 3. Initialize Railway Project

```bash
# In your project root directory
railway init

# Follow the prompts:
# - Create new project: "ai-data-science-study-backend"
# - Choose "Empty Project"
```

### 4. Set Environment Variables

```bash
# Set production environment variables
railway variables set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/ai-study"
railway variables set OPENAI_API_KEY="sk-proj-your-openai-key-here"
railway variables set NODE_ENV="production"
railway variables set CLIENT_URL="https://your-frontend-domain.com"
railway variables set JWT_SECRET="your-secure-jwt-secret"

# Verify variables are set
railway variables
```

### 5. Deploy to Railway

```bash
# Deploy your backend
railway up

# Or deploy with custom service name
railway up --service backend
```

### 6. Get Your Deployment URL

```bash
# Get the deployed URL
railway domain

# Or check deployment status
railway status
```

## 📋 Pre-Deployment Checklist

### ✅ Required Files Created
- [x] `railway.json` - Railway configuration
- [x] `Procfile` - Process definition
- [x] Health check endpoint added to `server.js`

### ✅ Environment Variables
- [ ] `MONGODB_URI` - Your MongoDB Atlas connection string
- [ ] `OPENAI_API_KEY` - Your OpenAI API key
- [ ] `NODE_ENV` - Set to "production"
- [ ] `CLIENT_URL` - Your frontend domain (for CORS)
- [ ] `JWT_SECRET` - Secure random string

### ✅ Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user with read/write permissions
- [ ] Network access configured (0.0.0.0/0 for Railway)
- [ ] Connection string tested

## 🔧 Railway Configuration Files

### `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### `Procfile`
```
web: npm start
```

## 🌐 Frontend Integration

Update your frontend API base URL to use the Railway deployment:

```javascript
// In your React app
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-railway-app.railway.app/api'
  : 'http://localhost:5000/api';
```

## 📊 Monitoring & Logs

### View Logs
```bash
# View real-time logs
railway logs

# View logs for specific service
railway logs --service backend

# Follow logs (like tail -f)
railway logs --follow
```

### Check Service Status
```bash
# Check deployment status
railway status

# Get service information
railway service
```

### Monitor Resources
```bash
# View resource usage
railway metrics

# Check deployment history
railway deployments
```

## 🔒 Security Configuration

### CORS Setup
Your server.js should include:
```javascript
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### Environment Variables Security
- Never commit `.env` files
- Use Railway's secure variable storage
- Rotate API keys regularly
- Use strong JWT secrets

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs
railway logs --deployment [deployment-id]

# Redeploy
railway up --detach
```

#### 2. Database Connection Issues
```bash
# Test MongoDB connection
railway run node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));
"
```

#### 3. Environment Variable Issues
```bash
# List all variables
railway variables

# Update a variable
railway variables set VARIABLE_NAME="new-value"

# Delete a variable
railway variables delete VARIABLE_NAME
```

#### 4. Health Check Failures
Check that `/api/health` endpoint returns 200:
```bash
curl https://your-app.railway.app/api/health
```

### Performance Optimization

#### 1. Enable Compression
```javascript
const compression = require('compression');
app.use(compression());
```

#### 2. Set Proper Headers
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Railway');
  next();
});
```

## 📈 Scaling & Production

### Auto-scaling
Railway automatically scales based on:
- CPU usage
- Memory usage
- Request volume

### Custom Scaling
```bash
# Set resource limits (if needed)
railway service update --memory 1024 --cpu 1000
```

### Database Optimization
- Use MongoDB indexes for better performance
- Implement connection pooling
- Monitor query performance

## 🔄 CI/CD Integration

### GitHub Integration
1. Connect your GitHub repository to Railway
2. Enable automatic deployments on push
3. Set up branch-specific deployments

### Manual Deployment
```bash
# Deploy specific branch
railway up --branch main

# Deploy with build command
railway up --build-command "npm install"
```

## 📞 Support

### Railway Resources
- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app/)

### Project-Specific Help
- Check deployment logs: `railway logs`
- Monitor health: `https://your-app.railway.app/api/health`
- Database status: MongoDB Atlas dashboard

---

## 🎯 Quick Commands Reference

```bash
# Essential Railway commands
railway login                    # Login to Railway
railway init                     # Initialize project
railway up                       # Deploy application
railway logs                     # View logs
railway variables               # Manage environment variables
railway domain                  # Get deployment URL
railway status                  # Check service status
railway service delete          # Delete service (careful!)

# Development workflow
railway up --detach             # Deploy without watching logs
railway logs --follow           # Follow logs in real-time
railway run node server.js      # Run commands in Railway environment
```

Your backend is now ready for Railway deployment! 🚀