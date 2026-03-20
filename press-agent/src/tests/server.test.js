/**
 * Quantum Pi Forge Press Agent - Test Suite
 * 
 * Tests for the Press Agent API endpoints and functionality.
 * Uses Node.js built-in test runner.
 */

const { describe, it, beforeEach, afterEach, before, after } = require('node:test');
const assert = require('node:assert');
const { app, articles, scheduledPublications } = require('../server');

// Create a simple test server
let server;
let baseUrl;

async function makeRequest(path, options = {}) {
    const url = `${baseUrl}${path}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    const data = await response.json().catch(() => null);
    return { response, data };
}

describe('Press Agent API', () => {
    before(async () => {
        // Start test server on random port
        return new Promise((resolve) => {
            server = app.listen(0, () => {
                const { port } = server.address();
                baseUrl = `http://localhost:${port}`;
                console.log(`Test server running on ${baseUrl}`);
                resolve();
            });
        });
    });

    after(async () => {
        return new Promise((resolve) => {
            server.close(resolve);
        });
    });

    beforeEach(() => {
        // Clear storage before each test
        articles.clear();
        scheduledPublications.clear();
    });

    describe('GET /health', () => {
        it('should return healthy status', async () => {
            const { response, data } = await makeRequest('/health');
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(data.status, 'healthy');
            assert.strictEqual(data.service, 'Quantum Pi Forge Press Agent');
            assert.strictEqual(data.version, '1.0.0');
        });
    });

    describe('GET /api/templates', () => {
        it('should return list of templates', async () => {
            const { response, data } = await makeRequest('/api/templates');
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(data.success, true);
            assert.ok(Array.isArray(data.templates));
            assert.ok(data.templates.length > 0);
            
            // Check template structure
            const template = data.templates[0];
            assert.ok(template.id);
            assert.ok(template.name);
            assert.ok(template.description);
        });
    });

    describe('POST /api/articles/generate', () => {
        it('should generate article from template', async () => {
            const { response, data } = await makeRequest('/api/articles/generate', {
                method: 'POST',
                body: JSON.stringify({
                    templateId: 'launch-announcement',
                    customData: {
                        featureName: 'Test Feature',
                        featureType: 'testing',
                        location: 'Test City',
                        technicalDetails: 'Test technical details',
                        contactName: 'Test Contact',
                        contactTitle: 'Test Title',
                        contactEmail: 'test@example.com'
                    }
                })
            });
            
            assert.strictEqual(response.status, 201);
            assert.strictEqual(data.success, true);
            assert.ok(data.article);
            assert.ok(data.article.id);
            assert.ok(data.article.title.includes('Test Feature'));
            assert.strictEqual(data.article.metadata.status, 'draft');
        });

        it('should fail with missing templateId', async () => {
            const { response, data } = await makeRequest('/api/articles/generate', {
                method: 'POST',
                body: JSON.stringify({})
            });
            
            assert.strictEqual(response.status, 400);
            assert.strictEqual(data.success, false);
        });

        it('should fail with invalid templateId', async () => {
            const { response, data } = await makeRequest('/api/articles/generate', {
                method: 'POST',
                body: JSON.stringify({
                    templateId: 'nonexistent-template'
                })
            });
            
            assert.strictEqual(response.status, 404);
            assert.strictEqual(data.success, false);
        });
    });

    describe('GET /api/articles', () => {
        it('should return empty list initially', async () => {
            const { response, data } = await makeRequest('/api/articles');
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(data.success, true);
            assert.strictEqual(data.total, 0);
            assert.ok(Array.isArray(data.articles));
        });

        it('should return generated articles', async () => {
            // Generate an article first
            await makeRequest('/api/articles/generate', {
                method: 'POST',
                body: JSON.stringify({
                    templateId: 'feature-update',
                    customData: { featureName: 'Test' }
                })
            });

            const { response, data } = await makeRequest('/api/articles');
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(data.total, 1);
        });
    });

    describe('GET /api/articles/:id', () => {
        it('should return specific article', async () => {
            // Generate an article
            const { data: genData } = await makeRequest('/api/articles/generate', {
                method: 'POST',
                body: JSON.stringify({
                    templateId: 'feature-update',
                    customData: { featureName: 'Test' }
                })
            });

            const { response, data } = await makeRequest(`/api/articles/${genData.article.id}`);
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(data.article.id, genData.article.id);
        });

        it('should return 404 for non-existent article', async () => {
            const { response, data } = await makeRequest('/api/articles/nonexistent-id');
            
            assert.strictEqual(response.status, 404);
            assert.strictEqual(data.success, false);
        });
    });

    describe('PUT /api/articles/:id', () => {
        it('should update article', async () => {
            // Generate an article
            const { data: genData } = await makeRequest('/api/articles/generate', {
                method: 'POST',
                body: JSON.stringify({
                    templateId: 'feature-update',
                    customData: { featureName: 'Original' }
                })
            });

            const { response, data } = await makeRequest(`/api/articles/${genData.article.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: 'Updated Title'
                })
            });
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(data.article.title, 'Updated Title');
        });
    });

    describe('DELETE /api/articles/:id', () => {
        it('should delete article', async () => {
            // Generate an article
            const { data: genData } = await makeRequest('/api/articles/generate', {
                method: 'POST',
                body: JSON.stringify({
                    templateId: 'feature-update',
                    customData: { featureName: 'ToDelete' }
                })
            });

            const { response, data } = await makeRequest(`/api/articles/${genData.article.id}`, {
                method: 'DELETE'
            });
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(data.success, true);

            // Verify deletion
            const { response: getResp } = await makeRequest(`/api/articles/${genData.article.id}`);
            assert.strictEqual(getResp.status, 404);
        });
    });

    describe('POST /api/articles/:id/schedule', () => {
        it('should schedule article publication', async () => {
            // Generate an article
            const { data: genData } = await makeRequest('/api/articles/generate', {
                method: 'POST',
                body: JSON.stringify({
                    templateId: 'feature-update',
                    customData: { featureName: 'Scheduled' }
                })
            });

            const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            const { response, data } = await makeRequest(`/api/articles/${genData.article.id}/schedule`, {
                method: 'POST',
                body: JSON.stringify({
                    publishAt: futureDate,
                    platform: 'wordpress'
                })
            });
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(data.success, true);
            assert.ok(data.schedule.id);
            assert.strictEqual(data.schedule.status, 'scheduled');
        });

        it('should fail with past date', async () => {
            // Generate an article
            const { data: genData } = await makeRequest('/api/articles/generate', {
                method: 'POST',
                body: JSON.stringify({
                    templateId: 'feature-update',
                    customData: { featureName: 'PastDate' }
                })
            });

            const pastDate = new Date(Date.now() - 1000).toISOString();
            const { response, data } = await makeRequest(`/api/articles/${genData.article.id}/schedule`, {
                method: 'POST',
                body: JSON.stringify({
                    publishAt: pastDate
                })
            });
            
            assert.strictEqual(response.status, 400);
            assert.strictEqual(data.success, false);
        });
    });

    describe('POST /api/articles/:id/publish', () => {
        it('should publish article in simulated mode', async () => {
            // Generate an article
            const { data: genData } = await makeRequest('/api/articles/generate', {
                method: 'POST',
                body: JSON.stringify({
                    templateId: 'feature-update',
                    customData: { featureName: 'ToPublish' }
                })
            });

            const { response, data } = await makeRequest(`/api/articles/${genData.article.id}/publish`, {
                method: 'POST',
                body: JSON.stringify({
                    platform: 'wordpress'
                })
            });
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(data.success, true);
            assert.strictEqual(data.article.metadata.status, 'published');
            assert.strictEqual(data.article.metadata.publishMode, 'simulated');
        });
    });

    describe('GET /api/schedules', () => {
        it('should return scheduled publications', async () => {
            // Generate and schedule an article
            const { data: genData } = await makeRequest('/api/articles/generate', {
                method: 'POST',
                body: JSON.stringify({
                    templateId: 'feature-update',
                    customData: { featureName: 'Scheduled' }
                })
            });

            const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            await makeRequest(`/api/articles/${genData.article.id}/schedule`, {
                method: 'POST',
                body: JSON.stringify({ publishAt: futureDate })
            });

            const { response, data } = await makeRequest('/api/schedules');
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(data.success, true);
            assert.strictEqual(data.total, 1);
        });
    });

    describe('GET /api/articles/:id/export', () => {
        it('should export article as JSON', async () => {
            // Generate an article
            const { data: genData } = await makeRequest('/api/articles/generate', {
                method: 'POST',
                body: JSON.stringify({
                    templateId: 'feature-update',
                    customData: { featureName: 'Export Test' }
                })
            });

            const { response, data } = await makeRequest(`/api/articles/${genData.article.id}/export?format=json`);
            
            assert.strictEqual(response.status, 200);
            assert.ok(data.export);
            assert.ok(data.export.slug);
            assert.ok(data.export.title);
        });
    });

    describe('GET /api/export/bulk', () => {
        it('should export all published articles', async () => {
            // Generate and publish an article
            const { data: genData } = await makeRequest('/api/articles/generate', {
                method: 'POST',
                body: JSON.stringify({
                    templateId: 'feature-update',
                    customData: { featureName: 'Bulk Export' }
                })
            });

            await makeRequest(`/api/articles/${genData.article.id}/publish`, {
                method: 'POST',
                body: JSON.stringify({ platform: 'wordpress' })
            });

            const { response, data } = await makeRequest('/api/export/bulk');
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(data.success, true);
            assert.ok(data.generatedAt);
            assert.ok(Array.isArray(data.articles));
        });
    });

    describe('GET /api/logs', () => {
        it('should return logs', async () => {
            // Make some requests to generate logs
            await makeRequest('/health');
            
            const { response, data } = await makeRequest('/api/logs');
            
            assert.strictEqual(response.status, 200);
            assert.strictEqual(data.success, true);
            assert.ok(Array.isArray(data.logs));
        });
    });
});

console.log('🧪 Press Agent Test Suite');
console.log('Run with: node --test src/tests/server.test.js');
