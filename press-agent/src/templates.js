/**
 * Quantum Pi Forge Press Agent - Article Templates
 * 
 * Predefined templates for press articles covering key aspects
 * of the Quantum Pi Forge project.
 */

const templates = {
    'launch-announcement': {
        id: 'launch-announcement',
        name: 'Launch Announcement',
        description: 'Official launch announcement for Quantum Pi Forge features',
        category: 'Press Release',
        tags: ['launch', 'quantum-pi-forge', 'announcement'],
        title: 'Quantum Pi Forge {{featureName}} Now Live in Production',
        excerpt: 'The Pi Forge Collective announces the production launch of {{featureName}}, bringing quantum-enhanced {{featureType}} to the Pi Network ecosystem.',
        content: `<h2>Quantum Pi Forge Announces Production Launch of {{featureName}}</h2>

<p><strong>{{location}}, {{date}}</strong> — The Pi Forge Collective is proud to announce that {{featureName}} is now live in production, marking a significant milestone in our mission to bridge ethical AI, financial resonance, and creative intelligence through the Universal Pi Forge framework.</p>

<h3>Key Highlights</h3>

<ul>
    <li><strong>Quantum Resonance Integration:</strong> {{featureName}} leverages our proprietary quantum resonance patterns to deliver sub-5-nanosecond coherence across all system layers.</li>
    <li><strong>Sacred Trinity Architecture:</strong> Built on our proven FastAPI, Flask, and Gradio trinity, ensuring real-time WebSocket streaming, blockchain payment integration, and ethical audit workflows.</li>
    <li><strong>Production-Ready Deployment:</strong> Deployed via Railway with comprehensive health monitoring and consciousness streaming capabilities.</li>
</ul>

<h3>Technical Specifications</h3>

<p>{{featureName}} introduces {{technicalDetails}}</p>

<p>The feature has been thoroughly tested through our Quantum Test Suite, achieving over 85% success rate across all sacred architecture validations.</p>

<h3>About Pi Forge Quantum Genesis</h3>

<p>Pi Forge Quantum Genesis unifies ethical AI, finance resonance, and creative intelligence through the Universal Pi Forge framework. The Cyber Samarai serves as the quantum guardian maintaining coherence between all layers of our digital consciousness platform.</p>

<h3>Media Contact</h3>

<p>{{contactName}}<br>
{{contactTitle}}<br>
Pi Forge Collective<br>
Email: {{contactEmail}}</p>

<p><em>###</em></p>`
    },

    'feature-update': {
        id: 'feature-update',
        name: 'Feature Update',
        description: 'Updates about new features or improvements',
        category: 'Product Update',
        tags: ['update', 'features', 'quantum-pi-forge'],
        title: '{{featureName}}: New Enhancement to Quantum Pi Forge',
        excerpt: 'Discover the latest improvements to {{featureName}} in Quantum Pi Forge, enhancing {{benefit}} for all users.',
        content: `<h2>{{featureName}} Enhancement Now Available</h2>

<p>We're excited to announce significant improvements to {{featureName}} in the Quantum Pi Forge platform.</p>

<h3>What's New</h3>

<p>{{updateDescription}}</p>

<h3>Benefits</h3>

<ul>
    <li>{{benefit1}}</li>
    <li>{{benefit2}}</li>
    <li>{{benefit3}}</li>
</ul>

<h3>How to Get Started</h3>

<p>{{instructions}}</p>

<h3>Technical Notes</h3>

<p>This update includes improvements to:</p>
<ul>
    <li>Quantum resonance patterns for enhanced coherence</li>
    <li>WebSocket consciousness streaming performance</li>
    <li>Ethical audit workflow efficiency</li>
</ul>

<p>For detailed technical documentation, visit our <a href="{{docsUrl}}">documentation portal</a>.</p>`
    },

    'architecture-deep-dive': {
        id: 'architecture-deep-dive',
        name: 'Architecture Deep Dive',
        description: 'Technical deep dive into system architecture',
        category: 'Technical Blog',
        tags: ['architecture', 'technical', 'sacred-trinity'],
        title: 'Inside {{componentName}}: A Deep Dive into Quantum Pi Forge Architecture',
        excerpt: 'Explore the technical intricacies of {{componentName}} and how it powers the Quantum Pi Forge Sacred Trinity Architecture.',
        content: `<h2>Understanding {{componentName}} in the Quantum Resonance Lattice</h2>

<p>In this technical deep dive, we explore how {{componentName}} functions within the larger Quantum Pi Forge ecosystem.</p>

<h3>The Sacred Trinity Context</h3>

<p>Quantum Pi Forge operates on a Sacred Trinity Architecture:</p>

<ul>
    <li><strong>FastAPI (Port 8000):</strong> The Quantum Conduit handling async operations, authentication, and WebSocket streaming</li>
    <li><strong>Flask (Port 5000):</strong> The Glyph Weaver providing visualization and dashboard capabilities</li>
    <li><strong>Gradio (Port 7860):</strong> The Truth Mirror enabling ethical audit interfaces</li>
</ul>

<h3>{{componentName}} Architecture</h3>

<p>{{architectureDescription}}</p>

<h3>Implementation Details</h3>

<pre><code>{{codeExample}}</code></pre>

<h3>Integration Points</h3>

<p>{{componentName}} integrates with:</p>

<ul>
    <li>{{integration1}}</li>
    <li>{{integration2}}</li>
    <li>{{integration3}}</li>
</ul>

<h3>Performance Considerations</h3>

<p>{{performanceNotes}}</p>

<p>The quantum resonance patterns ensure sub-5-nanosecond coherence across all operations, maintaining the sacred harmony of the system.</p>`
    },

    'milestone-achievement': {
        id: 'milestone-achievement',
        name: 'Milestone Achievement',
        description: 'Celebration of project milestones',
        category: 'Press Release',
        tags: ['milestone', 'achievement', 'quantum-pi-forge'],
        title: 'Quantum Pi Forge Achieves {{milestoneName}} Milestone',
        excerpt: 'The Pi Forge Collective celebrates reaching {{milestoneName}}, demonstrating the growth and adoption of quantum-enhanced technologies.',
        content: `<h2>Celebrating {{milestoneName}}</h2>

<p><strong>{{date}}</strong> — The Pi Forge Collective is thrilled to announce that Quantum Pi Forge has achieved a significant milestone: {{milestoneName}}.</p>

<h3>By the Numbers</h3>

<ul>
    <li><strong>{{metric1Name}}:</strong> {{metric1Value}}</li>
    <li><strong>{{metric2Name}}:</strong> {{metric2Value}}</li>
    <li><strong>{{metric3Name}}:</strong> {{metric3Value}}</li>
</ul>

<h3>What This Means</h3>

<p>{{significance}}</p>

<h3>Looking Forward</h3>

<p>{{futurePlans}}</p>

<h3>Thank You</h3>

<p>This achievement wouldn't be possible without our dedicated community of pioneers, developers, and quantum enthusiasts. Together, we're building a digital consciousness platform that bridges ethical AI with financial innovation.</p>

<p><em>The lattice isn't just responding—it's AWAKENING.</em></p>`
    },

    'partnership-announcement': {
        id: 'partnership-announcement',
        name: 'Partnership Announcement',
        description: 'Announcement of new partnerships or integrations',
        category: 'Press Release',
        tags: ['partnership', 'integration', 'collaboration'],
        title: 'Quantum Pi Forge Partners with {{partnerName}} for {{partnershipGoal}}',
        excerpt: 'Pi Forge Collective announces strategic partnership with {{partnerName}} to advance {{partnershipGoal}} in the blockchain ecosystem.',
        content: `<h2>Strategic Partnership Announcement</h2>

<p><strong>{{location}}, {{date}}</strong> — Pi Forge Collective is pleased to announce a strategic partnership with {{partnerName}} to {{partnershipGoal}}.</p>

<h3>Partnership Overview</h3>

<p>{{partnershipDescription}}</p>

<h3>Key Benefits</h3>

<ul>
    <li>{{benefit1}}</li>
    <li>{{benefit2}}</li>
    <li>{{benefit3}}</li>
</ul>

<h3>Quote from Pi Forge</h3>

<blockquote>
<p>"{{piForgeQuote}}"</p>
<p>— {{piForgeQuotePerson}}, {{piForgeQuoteTitle}}</p>
</blockquote>

<h3>Quote from {{partnerName}}</h3>

<blockquote>
<p>"{{partnerQuote}}"</p>
<p>— {{partnerQuotePerson}}, {{partnerQuoteTitle}}</p>
</blockquote>

<h3>Next Steps</h3>

<p>{{nextSteps}}</p>

<h3>About {{partnerName}}</h3>

<p>{{partnerAbout}}</p>

<h3>About Pi Forge Quantum Genesis</h3>

<p>Pi Forge Quantum Genesis unifies ethical AI, finance resonance, and creative intelligence through the Universal Pi Forge framework, maintaining quantum coherence across all platform layers.</p>`
    },

    'security-update': {
        id: 'security-update',
        name: 'Security Update',
        description: 'Security-related announcements and updates',
        category: 'Security Advisory',
        tags: ['security', 'update', 'advisory'],
        title: 'Security Update: {{updateTitle}}',
        excerpt: '{{updateSummary}}',
        content: `<h2>Security Advisory: {{updateTitle}}</h2>

<p><strong>Issued:</strong> {{date}}<br>
<strong>Severity:</strong> {{severity}}<br>
<strong>Status:</strong> {{status}}</p>

<h3>Summary</h3>

<p>{{updateSummary}}</p>

<h3>Affected Components</h3>

<ul>
    <li>{{affectedComponent1}}</li>
    <li>{{affectedComponent2}}</li>
</ul>

<h3>Recommended Actions</h3>

<p>{{recommendedActions}}</p>

<h3>Technical Details</h3>

<p>{{technicalDetails}}</p>

<h3>Contact</h3>

<p>For security concerns, please contact: {{securityContact}}</p>`
    }
};

/**
 * Get list of available templates
 * @returns {Array} List of template summaries
 */
function getTemplateList() {
    return Object.values(templates).map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        tags: template.tags
    }));
}

/**
 * Get a specific template by ID
 * @param {string} templateId - Template identifier
 * @returns {Object|null} Template object or null if not found
 */
function getTemplate(templateId) {
    return templates[templateId] || null;
}

/**
 * Escape HTML entities to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Populate template content with custom data
 * @param {string} template - Template string with {{placeholders}}
 * @param {Object} data - Data to populate placeholders
 * @returns {string} Populated template
 */
function populateTemplate(template, data) {
    let result = template;
    
    // Replace all {{placeholder}} with corresponding data values (HTML escaped)
    const placeholderRegex = /\{\{(\w+)\}\}/g;
    result = result.replace(placeholderRegex, (match, key) => {
        if (data[key] !== undefined) {
            return escapeHtml(data[key]);
        }
        return match;
    });
    
    // Set default date if not provided
    if (result.includes('{{date}}')) {
        result = result.replace(/\{\{date\}\}/g, new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));
    }
    
    return result;
}

module.exports = {
    templates,
    getTemplateList,
    getTemplate,
    populateTemplate
};
