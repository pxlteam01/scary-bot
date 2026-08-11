// ========================================
// SCARY BOT - SCRIPT (MTH STYLE)
// BY TUAN KEPALA CPY
// ========================================

// ============ CONFIG ============
const GITHUB_USERNAME = 'pxlteam01';
const GITHUB_REPO = 'licence';

const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/licence.json`;
const GITHUB_STATS_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/stats.json`;

// ============ STATE ============
let state = {
    currentStep: 0, // 0-5
    adCompleted: false,
    adWaiting: false,
    isProcessing: false,
    licenceKey: null,
    totalAds: 5,
    adsCompleted: 0,
    currentAdIndex: 0,
    adsList: []
};

// ============ DAFTAR IKLAN ============
const ADS_LIST = [
    { icon: '🛒', title: 'Shopee', sub: 'Belanja Online', url: 'https://shopee.co.id' },
    { icon: '📦', title: 'Tokopedia', sub: 'Marketplace', url: 'https://tokopedia.com' },
    { icon: '🛍️', title: 'Lazada', sub: 'E-commerce', url: 'https://lazada.co.id' },
    { icon: '📱', title: 'Blibli', sub: 'Belanja Online', url: 'https://blibli.com' },
    { icon: '🏪', title: 'Bukalapak', sub: 'Marketplace', url: 'https://bukalapak.com' },
    { icon: '📺', title: 'YouTube', sub: 'Video Streaming', url: 'https://youtube.com' },
    { icon: '📘', title: 'Facebook', sub: 'Social Media', url: 'https://facebook.com' },
    { icon: '📷', title: 'Instagram', sub: 'Social Media', url: 'https://instagram.com' },
    { icon: '🎮', title: 'Free Fire', sub: 'Game Online', url: 'https://ff.garena.com' },
    { icon: '🍕', title: 'GoFood', sub: 'Food Delivery', url: 'https://gofood.co.id' },
    { icon: '🚗', title: 'GoCar', sub: 'Transportasi', url: 'https://gocar.co.id' },
    { icon: '🏨', title: 'Traveloka', sub: 'Travel & Hotel', url: 'https://traveloka.com' },
    { icon: '💰', title: 'DANA', sub: 'E-Wallet', url: 'https://dana.id' },
    { icon: '💳', title: 'OVO', sub: 'E-Wallet', url: 'https://ovo.id' },
    { icon: '🎬', title: 'Netflix', sub: 'Streaming', url: 'https://netflix.com' },
    { icon: '🎵', title: 'Spotify', sub: 'Music Streaming', url: 'https://spotify.com' },
    { icon: '📚', title: 'Google', sub: 'Search Engine', url: 'https://google.com' },
    { icon: '💎', title: 'Crypto.com', sub: 'Cryptocurrency', url: 'https://crypto.com' }
];

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    updateUserCounter();
    initAds();
    updateUI();
});

// ============ PARTICLES ============
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2.5 + 1;
            this.speedX = (Math.random() - 0.5) * 1.2;
            this.speedY = (Math.random() - 0.5) * 1.2;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.02 + Math.random() * 0.03;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += this.pulseSpeed;
            
            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }

        draw() {
            const opacity = 0.15 + Math.sin(this.pulse) * 0.1 + 0.15;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(155, 77, 255, ${opacity})`;
            ctx.fill();
            
            // Glow
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 5);
            gradient.addColorStop(0, `rgba(155, 77, 255, ${opacity * 0.15})`);
            gradient.addColorStop(1, 'rgba(155, 77, 255, 0)');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // Connect particles
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (1 - distance / 100) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(155, 77, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(animate);
    }

    animate();
}

// ============ USER COUNTER ============
async function updateUserCounter() {
    try {
        const response = await fetch(GITHUB_STATS_URL, { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('totalUsers').textContent = data.total_users || 0;
        }
    } catch (e) {
        console.log('⚠️ Gagal ambil stats:', e);
    }
}

// ============ INIT ADS ============
function initAds() {
    // Shuffle dan ambil 5 iklan
    const shuffled = [...ADS_LIST].sort(() => Math.random() - 0.5);
    state.adsList = shuffled.slice(0, 5);
    state.adsCompleted = 0;
    state.currentAdIndex = 0;
    state.currentStep = 0;
    
    showAd(0);
}

function showAd(index) {
    if (index >= state.adsList.length) {
        // Semua iklan selesai, ambil licence
        getLicence();
        return;
    }
    
    const ad = state.adsList[index];
    document.getElementById('adIcon').textContent = ad.icon;
    document.getElementById('adTitle').textContent = ad.title;
    document.getElementById('adSub').textContent = ad.sub;
    
    // Reset button
    const btn = document.getElementById('btnAd');
    btn.disabled = false;
    btn.className = 'btn-ad';
    btn.innerHTML = '<span class="btn-text">▶ Continue to Step</span>';
    
    document.getElementById('adCountdown').style.display = 'none';
    document.getElementById('adStatus').className = 'ad-status';
    document.getElementById('adStatus').innerHTML = `
        <span class="status-icon">🔒</span>
        <span class="status-text">Complete ad ${index + 1} of ${state.adsList.length} to continue</span>
    `;
    
    state.adCompleted = false;
    state.adWaiting = false;
    state.currentStep = index + 1;
    
    // Update progress
    updateUI();
}

// ============ HANDLE AD CLICK ============
function handleAdClick() {
    if (state.isProcessing) return;
    if (state.adCompleted) return;
    if (state.adWaiting) return;
    
    state.isProcessing = true;
    state.adWaiting = true;
    
    const btn = document.getElementById('btnAd');
    const countdownEl = document.getElementById('adCountdown');
    const statusEl = document.getElementById('adStatus');
    const numberEl = document.getElementById('countdownNumber');
    const ad = state.adsList[state.currentAdIndex];
    
    // Buka iklan
    window.open(ad.url, '_blank');
    
    // Disable button
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-text">⏳ Waiting...</span>';
    countdownEl.style.display = 'flex';
    statusEl.className = 'ad-status';
    statusEl.innerHTML = `
        <span class="status-icon">⏳</span>
        <span class="status-text">Please wait 3 seconds...</span>
    `;
    
    // Countdown 3 detik
    let countdown = 3;
    numberEl.textContent = countdown;
    
    const interval = setInterval(() => {
        countdown--;
        numberEl.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(interval);
            
            // Selesai 1 iklan
            state.adCompleted = true;
            state.adWaiting = false;
            state.isProcessing = false;
            state.adsCompleted++;
            
            btn.innerHTML = '<span class="btn-text">✅ Done!</span>';
            btn.className = 'btn-ad done';
            countdownEl.style.display = 'none';
            statusEl.className = 'ad-status success';
            statusEl.innerHTML = `
                <span class="status-icon">✅</span>
                <span class="status-text">Ad ${state.adsCompleted} of ${state.adsList.length} completed!</span>
            `;
            
            // Update progress
            updateUI();
            
            // Lanjut ke iklan berikutnya setelah delay
            setTimeout(() => {
                state.currentAdIndex++;
                showAd(state.currentAdIndex);
            }, 1000);
        }
    }, 1000);
}

// ============ UPDATE UI ============
function updateUI() {
    const total = state.adsList.length || 5;
    const completed = state.adsCompleted;
    const current = state.currentStep;
    const progress = (completed / total) * 100;
    
    // Update progress bar
    document.getElementById('progressBar').style.width = Math.min(progress, 100) + '%';
    
    // Update step title
    if (completed >= total) {
        document.getElementById('stepTitle').textContent = '✅ ALL STEPS COMPLETED';
        document.getElementById('stepDesc').textContent = 'Getting your key...';
    } else {
        document.getElementById('stepTitle').textContent = `STEP ${current} OF ${total}`;
        document.getElementById('stepDesc').textContent = `Complete ad ${current} of ${total}`;
    }
    
    // Update step circles
    for (let i = 1; i <= total; i++) {
        const circle = document.getElementById(`stepCircle${i}`);
        const line = document.getElementById(`stepLine${i}`);
        
        circle.classList.remove('active', 'completed');
        if (line) line.classList.remove('completed');
        
        if (i < completed + 1) {
            circle.classList.add('completed');
            if (line) line.classList.add('completed');
        } else if (i === completed + 1) {
            circle.classList.add('active');
        }
    }
}

// ============ GET LICENCE ============
async function getLicence() {
    const adsSection = document.getElementById('adsSection');
    const licenceSection = document.getElementById('licenceSection');
    const loadingSection = document.getElementById('loadingSection');
    
    // Hide ads, show loading
    adsSection.style.display = 'none';
    loadingSection.style.display = 'block';
    
    document.getElementById('stepTitle').textContent = '⏳ GETTING YOUR KEY';
    document.getElementById('stepDesc').textContent = 'Please wait...';
    
    try {
        const response = await fetch(GITHUB_RAW_URL, { 
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) throw new Error('Gagal ambil data');
        
        const licences = await response.json();
        
        if (!licences || typeof licences !== 'object') {
            throw new Error('Data licences kosong');
        }
        
        // Cari licence available
        let availableKey = null;
        let availableData = null;
        
        for (const [key, data] of Object.entries(licences)) {
            const expiredDate = new Date(data.expired_date);
            const now = new Date();
            
            if (now > expiredDate) continue;
            if (data.used === true) continue;
            
            availableKey = key;
            availableData = data;
            break;
        }
        
        if (!availableKey) {
            throw new Error('Tidak ada licence tersedia');
        }
        
        state.licenceKey = availableKey;
        
        // Tampilkan licence
        loadingSection.style.display = 'none';
        licenceSection.style.display = 'block';
        
        document.getElementById('licenceKey').textContent = availableKey;
        
        const expiredDate = new Date(availableData.expired_date);
        const now = new Date();
        const hoursLeft = Math.floor((expiredDate - now) / (1000 * 60 * 60));
        
        document.getElementById('expiredDate').textContent = `${hoursLeft} hours`;
        
        const isVIP = availableData.is_vip === true;
        document.getElementById('licenceType').textContent = isVIP ? '👑 VIP' : '📦 FREE';
        if (isVIP) {
            document.getElementById('licenceType').className = 'value vip';
        }
        
        document.getElementById('stepTitle').textContent = '🎉 KEY UNLOCKED!';
        document.getElementById('stepDesc').textContent = 'Copy your key below';
        
        // Update user counter
        await updateUserCounter();
        
        // Confetti
        createConfetti();
        
    } catch (error) {
        console.error('❌ Error:', error);
        loadingSection.style.display = 'none';
        adsSection.style.display = 'block';
        document.getElementById('adStatus').className = 'ad-status error';
        document.getElementById('adStatus').innerHTML = `
            <span class="status-icon">❌</span>
            <span class="status-text">${error.message}. Please refresh and try again.</span>
        `;
        
        // Reset
        state.adsCompleted = 0;
        state.currentAdIndex = 0;
        state.isProcessing = false;
        state.adCompleted = false;
        state.adWaiting = false;
        
        initAds();
        updateUI();
    }
}

// ============ COPY LICENCE ============
function copyLicence() {
    const key = document.getElementById('licenceKey').textContent;
    navigator.clipboard.writeText(key).then(() => {
        const btn = document.querySelector('.btn-copy');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ COPIED!';
        btn.style.borderColor = '#00ff88';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
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

// ============ CONFETTI ============
function createConfetti() {
    const colors = ['#9b4dff', '#7b2ffc', '#6a1b9a', '#b388ff', '#e040fb', '#ff4081'];
    
    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${5 + Math.random() * 8}px;
            height: ${5 + Math.random() * 8}px;
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
        
        setTimeout(() => confetti.remove(), 5000);
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

// ============ AUTO REFRESH COUNTER ============
setInterval(updateUserCounter, 30000);

// ============ EXPOSE GLOBAL ============
window.handleAdClick = handleAdClick;
window.copyLicence = copyLicence;
