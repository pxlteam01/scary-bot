// ========================================
// SCARY BOT API - LICENCE HANDLER
// ========================================

const axios = require('axios');

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'YOUR_USERNAME';
const GITHUB_REPO = process.env.GITHUB_REPO || 'scary-bot-licences';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'YOUR_TOKEN';

const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/stats.json`;

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method === 'POST' && req.url === '/api/update-stats') {
        try {
            const stats = req.body;
            
            // Get current file SHA
            const getResponse = await axios.get(GITHUB_API_URL, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            const sha = getResponse.data.sha;
            const encoded = Buffer.from(JSON.stringify(stats, null, 2)).toString('base64');
            
            await axios.put(GITHUB_API_URL, {
                message: 'Update stats from website',
                content: encoded,
                sha: sha,
                branch: 'main'
            }, {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('❌ Error update stats:', error.message);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(404).json({ error: 'Not found' });
    }
};
