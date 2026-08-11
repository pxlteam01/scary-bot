// ========================================
// SCARY BOT WEBSITE - SCRIPT (FIXED)
// BY TUAN KEPALA CPY
// ========================================

// ============ CONFIG ============
// GANTI DENGAN USERNAME DAN REPO LU!
const GITHUB_USERNAME = 'pxlteam01';
const GITHUB_REPO = 'licence';

const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/licenses.json`;
const GITHUB_STATUS_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/website_status.json`;
const GITHUB_STATS_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/stats.json`;

// ============ DAFTAR IKLAN URL REAL ============
const ADS_URLS = [
    { id: 1, icon: '🛒', title: 'Shopee', sub: 'Belanja Online', url: 'https://shopee.co.id' },
    { id: 2, icon: '📦', title: 'Tokopedia', sub: 'Marketplace', url: 'https://tokopedia.com' },
    { id: 3, icon: '🛍️', title: 'Lazada', sub: 'E-commerce', url: 'https://lazada.co.id' },
    { id: 4, icon: '📱', title: 'Blibli', sub: 'Belanja Online', url: 'https://blibli.com' },
    { id: 5, icon: '🏪', title: 'Bukalapak', sub: 'Marketplace', url: 'https://bukalapak.com' },
    { id: 6, icon: '📺', title: 'YouTube', sub: 'Video Streaming', url: 'https://youtube.com' },
    { id: 7, icon: '📘', title: 'Facebook', sub: 'Social Media', url: 'https://facebook.com' },
    { id: 8, icon: '📷', title: 'Instagram', sub: 'Social Media', url: 'https://instagram.com' },
    { id: 9, icon: '🐦', title: 'Twitter/X', sub: 'Social Media', url: 'https://twitter.com' },
    { id: 10, icon: '💬', title: 'Telegram', sub: 'Messenger', url: 'https://t.me' },
    { id: 11, icon: '🎮', title: 'Free Fire', sub: 'Game Online', url: 'https://ff.garena.com' },
    { id: 12, icon: '🍕', title: 'GoFood', sub: 'Food Delivery', url: 'https://gofood.co.id' },
    { id: 13, icon: '🚗', title: 'GoCar', sub: 'Transportasi', url: 'https://gocar.co.id' },
    { id: 14, icon: '🏨', title: 'Traveloka', sub: 'Travel & Hotel', url: 'https://traveloka.com' },
    { id: 15, icon: '💰', title: 'DANA', sub: 'E-Wallet', url: 'https://dana.id' },
    { id: 16, icon: '💳', title: 'OVO', sub: 'E-Wallet', url: 'https://ovo.id' },
    { id: 17, icon: '🎬', title: 'Netflix', sub: 'Streaming', url: 'https://netflix.com' },
    { id: 18, icon: '🎵', title: 'Spotify', sub: 'Music Streaming', url: 'https://spotify.com' },
    { id: 19, icon: '📚', title: 'Google', sub: 'Search Engine', url: 'https://google.com' },
    { id: 20, icon: '💎', title: 'Crypto.com', sub: 'Cryptocurrency', url: 'https://crypto.com' }
];

// ============ STATE ============
let state = {
    adsCompleted: 0,
    adsTotal: 5,
    adsData: [],
    licenceKey: null,
    isProcessing: false,
    websiteStatus: true,
    adTimers: {}
};

// ============ INIT ============
document.addEventListener('DOMContentLoaded', async () => {
    await checkWebsiteStatus();
    initParticles();
    initAds();
});

// ============ CHECK WEBSITE STATUS ============
async function checkWebsiteStatus() {
    try {
        const response = await fetch(GITHUB_STATUS_URL, { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            state.websiteStatus = data.status !== false;
            
            if (!state.websiteStatus) {
                document.getElementById('websiteStatus').classList.add('active');
                document.getElementById('mainContent').style.display = 'none';
            } else {
                document.getElementById('websiteStatus').classList.remove('active');
                document.getElementById('mainContent').style.display = 'block';
            }
        }
    } catch (error) {
        console.log('⚠️ Gagal cek status website:', error);
        state.websiteStatus = true;
    }
}

// ============ PARTICLES ============
function initParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ============ ADS ============
function initAds() {
    const shuffled = [...ADS_URLS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5 + Math.floor(Math.random() * 4));
    
    state.adsData = selected.map((ad) => ({
        ...ad,
        completed: false,
        waiting: false,
        countdown: 0,
        clicked: false
    }));
    state.adsTotal = state.adsData.length;
    state.adsCompleted = 0;
    
    renderAds();
    updateProgress();
}

function renderAds() {
    const grid = document.getElementById('adsGrid');
    grid.innerHTML = '';
    
    state.adsData.forEach((ad, index) => {
        const div = document.createElement('div');
        div.className = 'ads-item' + (ad.completed ? ' completed' : '');
        div.dataset.index = index;
        
        const statusClass = ad.completed ? 'done' : (ad.waiting ? 'waiting' : 'pending');
        const statusText = ad.completed ? '✅ Selesai' : (ad.waiting ? '⏳ Tunggu...' : '👆 Klik');
        
        div.innerHTML = `
            <span class="ad-icon">${ad.icon}</span>
            <span class="ad-title">${ad.title}</span>
            <span class="ad-sub">${ad.sub}</span>
            ${ad.waiting ? `<span class="countdown" id="countdown-${index}">${ad.countdown || 3}s</span>` : ''}
            ${ad.completed ? `<span class="check-mark">✅</span>` : ''}
            <span class="ad-status ${statusClass}">${statusText}</span>
        `;
        
        if (!ad.completed && !ad.waiting) {
            div.addEventListener('click', () => handleAdClick(index));
        }
        
        grid.appendChild(div);
    });
}

function handleAdClick(index) {
    if (state.isProcessing) return;
    if (state.adsData[index].completed) return;
    if (state.adsData[index].waiting) return;
    if (state.adsData[index].clicked) return;
    
    const ad = state.adsData[index];
    state.isProcessing = true;
    ad.waiting = true;
    ad.clicked = true;
    ad.countdown = 3;
    
    window.open(ad.url, '_blank');
    renderAds();
    
    const countdownEl = document.getElementById(`countdown-${index}`);
    let countdown = 3;
    
    const interval = setInterval(() => {
        countdown--;
        if (countdownEl) countdownEl.textContent = countdown + 's';
        
        if (countdown <= 0) {
            clearInterval(interval);
            ad.completed = true;
            ad.waiting = false;
            state.adsCompleted++;
            state.isProcessing = false;
            
            renderAds();
            updateProgress();
            
            if (state.adsCompleted >= state.adsTotal) {
                getLicence();
            }
        }
    }, 1000);
}

function updateProgress() {
    const progressEl = document.getElementById('adsProgress');
    progressEl.textContent = `${state.adsCompleted}/${state.adsTotal}`;
    
    const progressBar = document.getElementById('adsProgressBar');
    if (progressBar) {
        const percent = (state.adsCompleted / state.adsTotal) * 100;
        progressBar.style.width = percent + '%';
    }
}

// ============ GET LICENCE - FIXED! ============
async function getLicence() {
    const loadingSection = document.getElementById('loadingSection');
    const adsSection = document.getElementById('adsSection');
    const licenceSection = document.getElementById('licenceSection');
    
    adsSection.style.display = 'none';
    loadingSection.style.display = 'block';
    
    try {
        console.log('📡 Fetching licences from:', GITHUB_RAW_URL);
        
        // Ambil data dari GitHub dengan fetch
        const response = await fetch(GITHUB_RAW_URL, { 
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const licences = await response.json();
        console.log('📦 Data received:', licences);
        
        // Cek apakah licences adalah object dan punya isi
        if (!licences || typeof licences !== 'object') {
            throw new Error('Data licences kosong atau format salah');
        }
        
        const keys = Object.keys(licences);
        console.log('🔑 Available keys:', keys.length);
        
        if (keys.length === 0) {
            throw new Error('Tidak ada licence tersedia di GitHub!');
        }
        
        // Cari licence yang belum digunakan dan belum expired
        let availableKey = null;
        let availableData = null;
        let expiredCount = 0;
        let usedCount = 0;
        
        for (const [key, data] of Object.entries(licences)) {
            // Cek expired
            const expiredDate = new Date(data.expired_date);
            const now = new Date();
            
            if (now > expiredDate) {
                expiredCount++;
                continue;
            }
            
            // Cek used
            if (data.used === true) {
                usedCount++;
                continue;
            }
            
            // Licence available!
            availableKey = key;
            availableData = data;
            break;
        }
        
        console.log(`📊 Stats: ${keys.length} total, ${expiredCount} expired, ${usedCount} used, ${availableKey ? 1 : 0} available`);
        
        if (!availableKey) {
            let msg = 'Tidak ada licence tersedia! ';
            if (expiredCount > 0) msg += `${expiredCount} licence expired, `;
            if (usedCount > 0) msg += `${usedCount} licence sudah dipakai. `;
            msg += 'Silakan hubungi admin untuk licence baru.';
            throw new Error(msg);
        }
        
        // Tampilkan licence
        state.licenceKey = availableKey;
        
        loadingSection.style.display = 'none';
        licenceSection.style.display = 'block';
        
        document.getElementById('licenceKey').textContent = availableKey;
        
        // Info expired
        const expiredDate = new Date(availableData.expired_date);
        const now = new Date();
        const hoursLeft = Math.floor((expiredDate - now) / (1000 * 60 * 60));
        const daysLeft = Math.floor(hoursLeft / 24);
        
        let timeLeft = '';
        if (daysLeft > 0) {
            timeLeft = `${daysLeft} hari ${hoursLeft % 24} jam lagi`;
        } else if (hoursLeft > 0) {
            timeLeft = `${hoursLeft} jam lagi`;
        } else {
            timeLeft = 'Segera expired!';
        }
        
        document.getElementById('expiredDate').textContent = `${timeLeft} (${expiredDate.toLocaleDateString('id-ID')} ${expiredDate.toLocaleTimeString('id-ID')})`;
        
        // Type
        const isVIP = availableData.is_vip === true;
        document.getElementById('licenceType').textContent = isVIP ? '👑 VIP' : '📦 FREE';
        if (isVIP) {
            document.getElementById('licenceType').className = 'value vip';
        }
        
        // Update stats (increment user count via API)
        try {
            await fetch('/api/update-stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'increment_user'
                })
            });
        } catch (e) {
            console.log('⚠️ Gagal update stats:', e);
        }
        
        createConfetti();
        
    } catch (error) {
        console.error('❌ Error:', error);
        loadingSection.style.display = 'none';
        adsSection.style.display = 'block';
        
        // Tampilkan error lebih detail
        let errorMsg = '❌ Gagal mendapatkan licence!\n\n';
        errorMsg += `📌 Error: ${error.message}\n\n`;
        errorMsg += '📌 Solusi:\n';
        errorMsg += '1. Pastikan repo "licence" ada dan public\n';
        errorMsg += '2. Pastikan file licences.json ada di repo\n';
        errorMsg += '3. Pastikan ada licence yang tersedia (belum digunakan)\n';
        errorMsg += '4. Refresh website dan coba lagi\n\n';
        errorMsg += '📌 Hubungi admin jika masalah berlanjut: @tuan_cpy';
        
        alert(errorMsg);
        
        // Reset ads
        state.adsCompleted = 0;
        state.adsData.forEach(ad => {
            ad.completed = false;
            ad.waiting = false;
            ad.countdown = 0;
            ad.clicked = false;
        });
        renderAds();
        updateProgress();
    }
}

// ============ COPY LICENCE ============
function copyLicence() {
    const key = document.getElementById('licenceKey').textContent;
    navigator.clipboard.writeText(key).then(() => {
        const btn = document.querySelector('.btn-copy');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        btn.style.borderColor = '#00ff88';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.borderColor = '';
        }, 2000);
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = key;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✅ Licence key copied!');
    });
}

// ============ CONFETTI EFFECT ============
function createConfetti() {
    const colors = ['#ff0066', '#ff00ff', '#00ff88', '#ffcc00', '#00ccff', '#ff6600'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${6 + Math.random() * 8}px;
            height: ${6 + Math.random() * 8}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            left: ${Math.random() * 100}%;
            top: -20px;
            z-index: 9999;
            pointer-events: none;
            opacity: ${0.7 + Math.random() * 0.3};
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Tambahkan keyframe confetti
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg) scale(0.3);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============ AUTO REFRESH STATUS ============
setInterval(checkWebsiteStatus, 30000);
