/**
 * Quantum Pi Forge Press Agent - Admin API Server
 * 
 * Automated press article generation and publishing system
 * for the Quantum Pi Forge project.
 */

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');
const articleTemplates = require('./templates');
const { WordPressPublisher } = require('./publishers/wordpress');

const app = express();
const PORT = process.env.PRESS_AGENT_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for articles (production should use database)
// NOTE: Data will be lost on server restart. For production, implement
// database persistence (e.g., Supabase, MongoDB, or PostgreSQL)
const articles = new Map();
const scheduledPublications = new Map();

// Logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    next();
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Quantum Pi Forge Press Agent',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        articlesCount: articles.size,
        scheduledCount: scheduledPublications.size
    });
});

/**
 * Get available article templates
 */
app.get('/api/templates', (req, res) => {
    const templateList = articleTemplates.getTemplateList();
    logger.info('Templates retrieved', { count: templateList.length });
    res.json({
        success: true,
        templates: templateList
    });
});

/**
 * Generate a new press article from template
 */
app.post('/api/articles/generate', (req, res) => {
    const { templateId, customData = {} } = req.body;

    if (!templateId) {
        logger.warn('Article generation failed: missing templateId');
        return res.status(400).json({
            success: false,
            error: 'templateId is required'
        });
    }

    const template = articleTemplates.getTemplate(templateId);
    if (!template) {
        logger.warn('Article generation failed: template not found', { templateId });
        return res.status(404).json({
            success: false,
            error: `Template '${templateId}' not found`
        });
    }

    const article = {
        id: uuidv4(),
        templateId,
        title: articleTemplates.populateTemplate(template.title, customData),
        content: articleTemplates.populateTemplate(template.content, customData),
        excerpt: articleTemplates.populateTemplate(template.excerpt, customData),
        metadata: {
            author: customData.author || 'Pi Forge Press Team',
            timestamp: new Date().toISOString(),
            tags: [...(template.tags || []), ...(customData.tags || [])],
            category: template.category || 'Press Release',
            status: 'draft'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    articles.set(article.id, article);
    logger.info('Article generated', { articleId: article.id, templateId });

    res.status(201).json({
        success: true,
        article
    });
});

/**
 * Get all generated articles
 */
app.get('/api/articles', (req, res) => {
    const { status, category, limit = 50, offset = 0 } = req.query;
    
    let articleList = Array.from(articles.values());
    
    if (status) {
        articleList = articleList.filter(a => a.metadata.status === status);
    }
    if (category) {
        articleList = articleList.filter(a => a.metadata.category === category);
    }

    const total = articleList.length;
    articleList = articleList
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(Number(offset), Number(offset) + Number(limit));

    logger.info('Articles retrieved', { total, returned: articleList.length });

    res.json({
        success: true,
        total,
        limit: Number(limit),
        offset: Number(offset),
        articles: articleList
    });
});

/**
 * Get a single article by ID
 */
app.get('/api/articles/:id', (req, res) => {
    const article = articles.get(req.params.id);
    
    if (!article) {
        return res.status(404).json({
            success: false,
            error: 'Article not found'
        });
    }

    res.json({
        success: true,
        article
    });
});

/**
 * Update an article
 */
app.put('/api/articles/:id', (req, res) => {
    const article = articles.get(req.params.id);
    
    if (!article) {
        return res.status(404).json({
            success: false,
            error: 'Article not found'
        });
    }

    const { title, content, excerpt, metadata } = req.body;

    if (title) article.title = title;
    if (content) article.content = content;
    if (excerpt) article.excerpt = excerpt;
    if (metadata) {
        article.metadata = { ...article.metadata, ...metadata };
    }
    article.updatedAt = new Date().toISOString();

    articles.set(article.id, article);
    logger.info('Article updated', { articleId: article.id });

    res.json({
        success: true,
        article
    });
});

/**
 * Delete an article
 */
app.delete('/api/articles/:id', (req, res) => {
    const article = articles.get(req.params.id);
    
    if (!article) {
        return res.status(404).json({
            success: false,
            error: 'Article not found'
        });
    }

    articles.delete(req.params.id);
    logger.info('Article deleted', { articleId: req.params.id });

    res.json({
        success: true,
        message: 'Article deleted successfully'
    });
});

/**
 * Schedule article publication
 */
app.post('/api/articles/:id/schedule', (req, res) => {
    const article = articles.get(req.params.id);
    
    if (!article) {
        return res.status(404).json({
            success: false,
            error: 'Article not found'
        });
    }

    const { publishAt, platform = 'wordpress' } = req.body;

    if (!publishAt) {
        return res.status(400).json({
            success: false,
            error: 'publishAt timestamp is required'
        });
    }

    const scheduledDate = new Date(publishAt);
    if (isNaN(scheduledDate.getTime())) {
        return res.status(400).json({
            success: false,
            error: 'Invalid publishAt date format'
        });
    }

    if (scheduledDate <= new Date()) {
        return res.status(400).json({
            success: false,
            error: 'publishAt must be in the future'
        });
    }

    const scheduleId = uuidv4();
    const schedule = {
        id: scheduleId,
        articleId: article.id,
        publishAt: scheduledDate.toISOString(),
        platform,
        status: 'scheduled',
        createdAt: new Date().toISOString()
    };

    scheduledPublications.set(scheduleId, schedule);
    article.metadata.status = 'scheduled';
    article.metadata.scheduledPublishAt = scheduledDate.toISOString();
    articles.set(article.id, article);

    logger.info('Article scheduled for publication', { 
        articleId: article.id, 
        scheduleId, 
        publishAt: scheduledDate.toISOString() 
    });

    res.json({
        success: true,
        schedule
    });
});

/**
 * Publish article immediately
 */
app.post('/api/articles/:id/publish', async (req, res) => {
    const article = articles.get(req.params.id);
    
    if (!article) {
        return res.status(404).json({
            success: false,
            error: 'Article not found'
        });
    }

    const { platform = 'wordpress' } = req.body;

    // Get WordPress configuration from environment or request
    const wpConfig = {
        siteUrl: process.env.WORDPRESS_SITE_URL || req.body.wpSiteUrl,
        username: process.env.WORDPRESS_USERNAME || req.body.wpUsername,
        password: process.env.WORDPRESS_APP_PASSWORD || req.body.wpAppPassword
    };

    // Simulate publication if no WordPress credentials
    if (!wpConfig.siteUrl || !wpConfig.username || !wpConfig.password) {
        logger.info('Simulated publication (no WordPress credentials)', { 
            articleId: article.id 
        });
        
        article.metadata.status = 'published';
        article.metadata.publishedAt = new Date().toISOString();
        article.metadata.publishedPlatform = platform;
        article.metadata.publishMode = 'simulated';
        articles.set(article.id, article);

        return res.json({
            success: true,
            message: 'Article published (simulated - configure WordPress credentials for actual publishing)',
            article,
            publishedAt: article.metadata.publishedAt
        });
    }

    try {
        const publisher = new WordPressPublisher(wpConfig);
        const result = await publisher.publish(article);

        article.metadata.status = 'published';
        article.metadata.publishedAt = new Date().toISOString();
        article.metadata.publishedPlatform = platform;
        article.metadata.externalId = result.postId;
        article.metadata.externalUrl = result.postUrl;
        articles.set(article.id, article);

        logger.info('Article published to WordPress', { 
            articleId: article.id,
            postId: result.postId 
        });

        res.json({
            success: true,
            message: 'Article published successfully',
            article,
            publishedAt: article.metadata.publishedAt,
            externalUrl: result.postUrl
        });
    } catch (error) {
        logger.error('Failed to publish article', { 
            articleId: article.id, 
            error: error.message 
        });
        res.status(500).json({
            success: false,
            error: 'Failed to publish article',
            details: error.message
        });
    }
});

/**
 * Get scheduled publications
 */
app.get('/api/schedules', (req, res) => {
    const schedules = Array.from(scheduledPublications.values())
        .sort((a, b) => new Date(a.publishAt) - new Date(b.publishAt));

    res.json({
        success: true,
        total: schedules.length,
        schedules
    });
});

/**
 * Cancel scheduled publication
 */
app.delete('/api/schedules/:id', (req, res) => {
    const schedule = scheduledPublications.get(req.params.id);
    
    if (!schedule) {
        return res.status(404).json({
            success: false,
            error: 'Schedule not found'
        });
    }

    scheduledPublications.delete(req.params.id);

    // Update article status
    const article = articles.get(schedule.articleId);
    if (article) {
        article.metadata.status = 'draft';
        delete article.metadata.scheduledPublishAt;
        articles.set(article.id, article);
    }

    logger.info('Scheduled publication cancelled', { scheduleId: req.params.id });

    res.json({
        success: true,
        message: 'Scheduled publication cancelled'
    });
});

/**
 * CDN/Hosting integration hook - export article for static hosting
 */
app.get('/api/articles/:id/export', (req, res) => {
    const article = articles.get(req.params.id);
    
    if (!article) {
        return res.status(404).json({
            success: false,
            error: 'Article not found'
        });
    }

    const { format = 'json' } = req.query;

    if (format === 'html') {
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title}</title>
    <meta name="author" content="${article.metadata.author}">
    <meta name="keywords" content="${article.metadata.tags.join(', ')}">
    <meta name="description" content="${article.excerpt}">
</head>
<body>
    <article>
        <header>
            <h1>${article.title}</h1>
            <p class="meta">By ${article.metadata.author} | ${new Date(article.createdAt).toLocaleDateString()}</p>
        </header>
        <div class="content">
            ${article.content}
        </div>
        <footer>
            <p class="tags">Tags: ${article.metadata.tags.join(', ')}</p>
        </footer>
    </article>
</body>
</html>`;
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
    } else if (format === 'markdown') {
        const mdContent = `# ${article.title}

*By ${article.metadata.author} | ${new Date(article.createdAt).toLocaleDateString()}*

${article.content}

---
**Tags:** ${article.metadata.tags.join(', ')}
`;
        res.setHeader('Content-Type', 'text/markdown');
        res.send(mdContent);
    } else {
        // JSON format (CDN-ready)
        res.json({
            success: true,
            export: {
                id: article.id,
                slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                title: article.title,
                excerpt: article.excerpt,
                content: article.content,
                author: article.metadata.author,
                tags: article.metadata.tags,
                category: article.metadata.category,
                publishedAt: article.metadata.publishedAt || article.createdAt,
                lastModified: article.updatedAt
            }
        });
    }
});

/**
 * Bulk export for CDN integration
 */
app.get('/api/export/bulk', (req, res) => {
    const { status = 'published' } = req.query;
    
    let articleList = Array.from(articles.values());
    if (status !== 'all') {
        articleList = articleList.filter(a => a.metadata.status === status);
    }

    const exports = articleList.map(article => ({
        id: article.id,
        slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        author: article.metadata.author,
        tags: article.metadata.tags,
        category: article.metadata.category,
        publishedAt: article.metadata.publishedAt || article.createdAt,
        lastModified: article.updatedAt
    }));

    logger.info('Bulk export completed', { count: exports.length, status });

    res.json({
        success: true,
        total: exports.length,
        generatedAt: new Date().toISOString(),
        articles: exports
    });
});

/**
 * Get system logs
 */
app.get('/api/logs', (req, res) => {
    const { level = 'info', limit = 100 } = req.query;
    const logs = logger.getLogs(level, Number(limit));
    
    res.json({
        success: true,
        logs
    });
});

// Scheduled job to process pending publications (runs every 5 minutes)
cron.schedule('*/5 * * * *', async () => {
    const now = new Date();
    
    for (const [scheduleId, schedule] of scheduledPublications) {
        if (schedule.status === 'scheduled' && new Date(schedule.publishAt) <= now) {
            logger.info('Processing scheduled publication', { scheduleId });
            
            const article = articles.get(schedule.articleId);
            if (article) {
                // Mark as published (in production, would call actual publish)
                article.metadata.status = 'published';
                article.metadata.publishedAt = now.toISOString();
                article.metadata.publishedPlatform = schedule.platform;
                articles.set(article.id, article);
                
                schedule.status = 'completed';
                schedule.completedAt = now.toISOString();
                scheduledPublications.set(scheduleId, schedule);
                
                logger.info('Scheduled publication completed', { 
                    articleId: article.id, 
                    scheduleId 
                });
            }
        }
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error', { error: err.message, stack: err.stack });
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        logger.info(`Quantum Pi Forge Press Agent started`, { port: PORT });
        console.log(`🚀 Press Agent API running on http://localhost:${PORT}`);
        console.log(`📖 Health check: http://localhost:${PORT}/health`);
        console.log(`📝 Templates: http://localhost:${PORT}/api/templates`);
    });
}

module.exports = { app, articles, scheduledPublications };
