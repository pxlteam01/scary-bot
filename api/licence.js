// ========================================
// SCARY BOT API - UPDATE STATS
// ========================================

const axios = require('axios');

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'pxlteam01';
const GITHUB_REPO = process.env.GITHUB_REPO || 'licence';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const GITHUB_STATS_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/stats.json`;

module.exports = async (req, res) => {
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
            let sha = null;
            try {
                const getResponse = await axios.get(GITHUB_STATS_URL, {
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (getResponse.data && getResponse.data.sha) {
                    sha = getResponse.data.sha;
                }
            } catch (e) {
                // File belum ada
            }
            
            const encoded = Buffer.from(JSON.stringify(stats, null, 2)).toString('base64');
            
            const payload = {
                message: 'Update stats from website',
                content: encoded,
                branch: 'main'
            };
            
            if (sha) {
                payload.sha = sha;
            }
            
            await axios.put(GITHUB_STATS_URL, payload, {
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
