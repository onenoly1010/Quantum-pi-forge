# Quantum Pi Forge Press Agent

Automated press article generation and publishing system for the Quantum Pi Forge project.

## 🚀 Features

- **Auto-Generation**: Generate press articles from predefined templates covering key aspects of Quantum Pi Forge
- **Metadata Integration**: Automatic author, timestamp, and tag assignment for categorization
- **WordPress Publishing**: Seamless publication to WordPress CMS with scheduling support
- **CDN/Hosting Hooks**: Export articles in JSON, HTML, or Markdown for static hosting integration
- **Scheduling**: Schedule articles for future publication
- **Comprehensive Logging**: Built-in logging system with API access

## 📦 Installation

```bash
cd press-agent
npm install
```

## ⚙️ Configuration

Copy the environment template and configure:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PRESS_AGENT_PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `LOG_LEVEL` | Logging level | `info` |
| `WORDPRESS_SITE_URL` | WordPress site URL | - |
| `WORDPRESS_USERNAME` | WordPress username | - |
| `WORDPRESS_APP_PASSWORD` | WordPress application password | - |

## 🏃 Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## 📝 API Endpoints

### Health Check
```
GET /health
```
Returns system health status.

### Templates

```
GET /api/templates
```
List all available article templates.

### Articles

```
POST /api/articles/generate
```
Generate a new article from a template.

**Request Body:**
```json
{
  "templateId": "launch-announcement",
  "customData": {
    "featureName": "Quantum Resonance 2.0",
    "featureType": "consciousness streaming",
    "location": "San Francisco",
    "technicalDetails": "Enhanced WebSocket streaming..."
  }
}
```

```
GET /api/articles
```
List all articles (supports `status`, `category`, `limit`, `offset` query params).

```
GET /api/articles/:id
```
Get a specific article.

```
PUT /api/articles/:id
```
Update an article.

```
DELETE /api/articles/:id
```
Delete an article.

### Publishing

```
POST /api/articles/:id/publish
```
Publish an article immediately.

**Request Body:**
```json
{
  "platform": "wordpress"
}
```

```
POST /api/articles/:id/schedule
```
Schedule an article for future publication.

**Request Body:**
```json
{
  "publishAt": "2024-12-31T12:00:00Z",
  "platform": "wordpress"
}
```

### Schedules

```
GET /api/schedules
```
List all scheduled publications.

```
DELETE /api/schedules/:id
```
Cancel a scheduled publication.

### Export / CDN Integration

```
GET /api/articles/:id/export?format=json|html|markdown
```
Export a single article for CDN/hosting integration.

```
GET /api/export/bulk?status=published
```
Bulk export articles for static site generation.

### Logs

```
GET /api/logs?level=info&limit=100
```
Retrieve system logs.

## 📋 Available Templates

| Template ID | Description |
|-------------|-------------|
| `launch-announcement` | Official launch announcements for features |
| `feature-update` | Updates about new features or improvements |
| `architecture-deep-dive` | Technical deep dive into system architecture |
| `milestone-achievement` | Celebration of project milestones |
| `partnership-announcement` | Partnership or integration announcements |
| `security-update` | Security-related announcements |

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🔧 WordPress Integration

To publish to WordPress:

1. Generate an Application Password in WordPress:
   - Go to **Users > Your Profile**
   - Scroll to **Application Passwords**
   - Enter a name and click **Add New Application Password**
   - Copy the generated password

2. Configure environment variables:
   ```
   WORDPRESS_SITE_URL=https://your-site.com
   WORDPRESS_USERNAME=your-username
   WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```

3. Articles will be published via the WordPress REST API.

## 🌐 CDN Integration

The Press Agent provides export endpoints for static site generation:

### JSON Export (for headless CMS / JAMstack)
```bash
curl http://localhost:3001/api/export/bulk
```

### HTML Export (for static hosting)
```bash
curl http://localhost:3001/api/articles/{id}/export?format=html > article.html
```

### Markdown Export (for documentation sites)
```bash
curl http://localhost:3001/api/articles/{id}/export?format=markdown > article.md
```

## 📊 Example Workflow

1. **Generate Article**
   ```bash
   curl -X POST http://localhost:3001/api/articles/generate \
     -H "Content-Type: application/json" \
     -d '{
       "templateId": "launch-announcement",
       "customData": {
         "featureName": "Quantum Resonance 2.0",
         "featureType": "real-time streaming"
       }
     }'
   ```

2. **Review & Edit**
   ```bash
   curl http://localhost:3001/api/articles/{article-id}
   ```

3. **Schedule Publication**
   ```bash
   curl -X POST http://localhost:3001/api/articles/{article-id}/schedule \
     -H "Content-Type: application/json" \
     -d '{"publishAt": "2024-12-31T12:00:00Z"}'
   ```

4. **Or Publish Immediately**
   ```bash
   curl -X POST http://localhost:3001/api/articles/{article-id}/publish
   ```

## 🏗️ Architecture

```
press-agent/
├── src/
│   ├── server.js          # Express API server
│   ├── logger.js          # Winston logging configuration
│   ├── templates.js       # Article templates
│   ├── publishers/
│   │   └── wordpress.js   # WordPress REST API integration
│   └── tests/
│       └── server.test.js # API test suite
├── package.json
├── .env.example
└── README.md
```

## 🔗 Integration with Quantum Pi Forge

The Press Agent is designed to work alongside the main Quantum Pi Forge services:

- **FastAPI (Port 8000)**: Main production API
- **Flask (Port 5000)**: Dashboard and visualization
- **Gradio (Port 7860)**: Ethical audit interface
- **Press Agent (Port 3001)**: Article generation and publishing

## 📄 License

MIT License - Pi Forge Collective
