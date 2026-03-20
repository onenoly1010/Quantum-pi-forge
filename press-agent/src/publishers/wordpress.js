/**
 * Quantum Pi Forge Press Agent - WordPress Publisher
 * 
 * Handles publication of articles to WordPress CMS
 * using the WordPress REST API.
 * 
 * SECURITY NOTE: Always use HTTPS URLs for WordPress sites to ensure
 * credentials are transmitted securely. Basic authentication is used
 * with Application Passwords, which is the recommended method for
 * WordPress REST API authentication.
 */

const logger = require('../logger');

class WordPressPublisher {
    /**
     * Create WordPress publisher instance
     * @param {Object} config - WordPress configuration
     * @param {string} config.siteUrl - WordPress site URL (must use HTTPS in production)
     * @param {string} config.username - WordPress username
     * @param {string} config.password - WordPress application password
     */
    constructor(config) {
        this.siteUrl = config.siteUrl.replace(/\/$/, ''); // Remove trailing slash
        this.username = config.username;
        this.password = config.password;
        this.apiBase = `${this.siteUrl}/wp-json/wp/v2`;
        
        // Warn if not using HTTPS
        if (!this.siteUrl.startsWith('https://')) {
            logger.warn('WordPress site URL is not using HTTPS. This is insecure for production use.');
        }
    }

    /**
     * Get authentication headers for WordPress API
     * @returns {Object} Headers object with authentication
     */
    getAuthHeaders() {
        const credentials = Buffer.from(`${this.username}:${this.password}`).toString('base64');
        return {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Publish an article to WordPress
     * @param {Object} article - Article object to publish
     * @returns {Promise<Object>} Publication result
     */
    async publish(article) {
        const postData = {
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            status: 'publish',
            categories: [],
            tags: []
        };

        try {
            // Create the post
            const response = await fetch(`${this.apiBase}/posts`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`WordPress API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const wpPost = await response.json();

            logger.info('Article published to WordPress', {
                articleId: article.id,
                wpPostId: wpPost.id,
                wpLink: wpPost.link
            });

            return {
                postId: wpPost.id,
                postUrl: wpPost.link,
                status: wpPost.status
            };
        } catch (error) {
            logger.error('Failed to publish to WordPress', {
                articleId: article.id,
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Update an existing WordPress post
     * @param {number} postId - WordPress post ID
     * @param {Object} article - Updated article data
     * @returns {Promise<Object>} Update result
     */
    async update(postId, article) {
        const postData = {
            title: article.title,
            content: article.content,
            excerpt: article.excerpt
        };

        try {
            const response = await fetch(`${this.apiBase}/posts/${postId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`WordPress API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const wpPost = await response.json();

            logger.info('WordPress post updated', {
                articleId: article.id,
                wpPostId: wpPost.id
            });

            return {
                postId: wpPost.id,
                postUrl: wpPost.link,
                status: wpPost.status
            };
        } catch (error) {
            logger.error('Failed to update WordPress post', {
                postId,
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Delete a WordPress post
     * @param {number} postId - WordPress post ID
     * @returns {Promise<boolean>} Success status
     */
    async delete(postId) {
        try {
            const response = await fetch(`${this.apiBase}/posts/${postId}?force=true`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`WordPress API error: ${response.status}`);
            }

            logger.info('WordPress post deleted', { wpPostId: postId });
            return true;
        } catch (error) {
            logger.error('Failed to delete WordPress post', {
                postId,
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Schedule a post for future publication
     * @param {Object} article - Article to schedule
     * @param {Date} publishDate - Date to publish
     * @returns {Promise<Object>} Scheduling result
     */
    async schedule(article, publishDate) {
        const postData = {
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            status: 'future',
            date: publishDate.toISOString()
        };

        try {
            const response = await fetch(`${this.apiBase}/posts`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`WordPress API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const wpPost = await response.json();

            logger.info('Article scheduled on WordPress', {
                articleId: article.id,
                wpPostId: wpPost.id,
                scheduledDate: publishDate.toISOString()
            });

            return {
                postId: wpPost.id,
                postUrl: wpPost.link,
                status: wpPost.status,
                scheduledDate: publishDate.toISOString()
            };
        } catch (error) {
            logger.error('Failed to schedule WordPress post', {
                articleId: article.id,
                error: error.message
            });
            throw error;
        }
    }

    /**
     * Test WordPress connection
     * @returns {Promise<Object>} Connection status
     */
    async testConnection() {
        try {
            const response = await fetch(`${this.apiBase}/users/me`, {
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`Connection test failed: ${response.status}`);
            }

            const user = await response.json();

            return {
                connected: true,
                user: {
                    id: user.id,
                    name: user.name,
                    slug: user.slug
                }
            };
        } catch (error) {
            logger.error('WordPress connection test failed', { error: error.message });
            return {
                connected: false,
                error: error.message
            };
        }
    }
}

module.exports = { WordPressPublisher };
