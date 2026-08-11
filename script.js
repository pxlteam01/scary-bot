// ========================================
// SCARY BOT - SCRIPT (MTH STYLE - FIXED)
// BY TUAN KEPALA CPY
// ========================================

// ============ CONFIG ============
const GITHUB_USERNAME = 'pxlteam01';
const GITHUB_REPO = 'licence';

const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/licence.json`;
const GITHUB_STATS_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/stats.json`;

// ============ STATE ============
let state = {
    currentStep: 0,
    adCompleted: false,
    adWaiting: false,
    isProcessing: false,
    licenceKey: null,
    totalAds: 5,
    adsCompleted: 0,
    currentAdIndex: 0,
    adsList: [],
    isInitialized: false
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
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Website loaded!');
    initParticles();
    updateUserCounter();
    initAds();
    updateUI();
    state.isInitialized = true;
});

// ============ PARTICLES ============
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
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
            
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 5);
            gradient.addColorStop(0, `rgba(155, 77, 255, ${opacity * 0.15})`);
            gradient.addColorStop(1, 'rgba(155, 77, 255, 0)');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

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
            const el = document.getElementById('totalUsers');
            if (el) el.textContent = data.total_users || 0;
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
    state.adCompleted = false;
    state.adWaiting = false;
    state.isProcessing = false;
    
    console.log('📦 Ads initialized:', state.adsList.length, 'ads');
    showAd(0);
}

function showAd(index) {
    console.log('📢 Showing ad:', index);
    
    if (index >= state.adsList.length) {
        console.log('✅ All ads completed! Getting licence...');
        getLicence();
        return;
    }
    
    const ad = state.adsList[index];
    const iconEl = document.getElementById('adIcon');
    const titleEl = document.getElementById('adTitle');
    const subEl = document.getElementById('adSub');
    const btn = document.getElementById('btnAd');
    const countdownEl = document.getElementById('adCountdown');
    const statusEl = document.getElementById('adStatus');
    
    if (iconEl) iconEl.textContent = ad.icon;
    if (titleEl) titleEl.textContent = ad.title;
    if (subEl) subEl.textContent = ad.sub;
    
    // Reset button
    if (btn) {
        btn.disabled = false;
        btn.className = 'btn-ad';
        btn.innerHTML = '<span class="btn-text">▶ Continue to Step</span>';
        // Re-attach event listener
        btn.onclick = function() {
            console.log('🔘 Button clicked!');
            handleAdClick();
        };
    }
    
    if (countdownEl) countdownEl.style.display = 'none';
    
    if (statusEl) {
        statusEl.className = 'ad-status';
        statusEl.innerHTML = `
            <span class="status-icon">🔒</span>
            <span class="status-text">Complete ad ${index + 1} of ${state.adsList.length} to continue</span>
        `;
    }
    
    state.adCompleted = false;
    state.adWaiting = false;
    state.currentStep = index + 1;
    state.currentAdIndex = index;
    
    updateUI();
}

// ============ HANDLE AD CLICK ============
function handleAdClick() {
    console.log('🖱️ handleAdClick called!');
    console.log('State:', { 
        isProcessing: state.isProcessing, 
        adCompleted: state.adCompleted, 
        adWaiting: state.adWaiting,
        currentAdIndex: state.currentAdIndex,
        adsCompleted: state.adsCompleted
    });
    
    if (state.isProcessing) {
        console.log('⏳ Already processing...');
        return;
    }
    if (state.adCompleted) {
        console.log('✅ Already completed...');
        return;
    }
    if (state.adWaiting) {
        console.log('⏳ Already waiting...');
        return;
    }
    if (state.currentAdIndex >= state.adsList.length) {
        console.log('📭 No more ads...');
        return;
    }
    
    state.isProcessing = true;
    state.adWaiting = true;
    
    const btn = document.getElementById('btnAd');
    const countdownEl = document.getElementById('adCountdown');
    const statusEl = document.getElementById('adStatus');
    const numberEl = document.getElementById('countdownNumber');
    const ad = state.adsList[state.currentAdIndex];
    
    console.log('📤 Opening ad:', ad.title, ad.url);
    
    // Buka iklan di tab baru
    window.open(ad.url, '_blank');
    
    // Disable button
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="btn-text">⏳ Waiting...</span>';
    }
    
    if (countdownEl) countdownEl.style.display = 'flex';
    
    if (statusEl) {
        statusEl.className = 'ad-status';
        statusEl.innerHTML = `
            <span class="status-icon">⏳</span>
            <span class="status-text">Please wait 3 seconds...</span>
        `;
    }
    
    // Countdown 3 detik
    let countdown = 3;
    if (numberEl) numberEl.textContent = countdown;
    
    const interval = setInterval(() => {
        countdown--;
        if (numberEl) numberEl.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(interval);
            
            console.log('✅ Ad completed!');
            
            // Selesai 1 iklan
            state.adCompleted = true;
            state.adWaiting = false;
            state.isProcessing = false;
            state.adsCompleted++;
            
            if (btn) {
                btn.innerHTML = '<span class="btn-text">✅ Done!</span>';
                btn.className = 'btn-ad done';
            }
            
            if (countdownEl) countdownEl.style.display = 'none';
            
            if (statusEl) {
                statusEl.className = 'ad-status success';
                statusEl.innerHTML = `
                    <span class="status-icon">✅</span>
                    <span class="status-text">Ad ${state.adsCompleted} of ${state.adsList.length} completed!</span>
                `;
            }
            
            updateUI();
            
            // Lanjut ke iklan berikutnya setelah delay
            setTimeout(() => {
                state.currentAdIndex++;
                showAd(state.currentAdIndex);
            }, 800);
        }
    }, 1000);
}

// ============ UPDATE UI ============
function updateUI() {
    const total = state.adsList.length || 5;
    const completed = state.adsCompleted;
    const current = state.currentStep;
    const progress = (completed / total) * 100;
    
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = Math.min(progress, 100) + '%';
    }
    
    const stepTitle = document.getElementById('stepTitle');
    const stepDesc = document.getElementById('stepDesc');
    
    if (completed >= total) {
        if (stepTitle) stepTitle.textContent = '✅ ALL STEPS COMPLETED';
        if (stepDesc) stepDesc.textContent = 'Getting your key...';
    } else {
        if (stepTitle) stepTitle.textContent = `STEP ${current} OF ${total}`;
        if (stepDesc) stepDesc.textContent = `Complete ad ${current} of ${total}`;
    }
    
    // Update step circles
    for (let i = 1; i <= total; i++) {
        const circle = document.getElementById(`stepCircle${i}`);
        const line = document.getElementById(`stepLine${i}`);
        
        if (circle) {
            circle.classList.remove('active', 'completed');
            if (i < completed + 1) {
                circle.classList.add('completed');
            } else if (i === completed + 1) {
                circle.classList.add('active');
            }
        }
        if (line) {
            line.classList.remove('completed');
            if (i <= completed) {
                line.classList.add('completed');
            }
        }
    }
}

// ============ GET LICENCE ============
async function getLicence() {
    const adsSection = document.getElementById('adsSection');
    const licenceSection = document.getElementById('licenceSection');
    const loadingSection = document.getElementById('loadingSection');
    
    if (adsSection) adsSection.style.display = 'none';
    if (loadingSection) loadingSection.style.display = 'block';
    
    const stepTitle = document.getElementById('stepTitle');
    const stepDesc = document.getElementById('stepDesc');
    if (stepTitle) stepTitle.textContent = '⏳ GETTING YOUR KEY';
    if (stepDesc) stepDesc.textContent = 'Please wait...';
    
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
        
        if (loadingSection) loadingSection.style.display = 'none';
        if (licenceSection) licenceSection.style.display = 'block';
        
        const keyEl = document.getElementById('licenceKey');
        if (keyEl) keyEl.textContent = availableKey;
        
        const expiredDate = new Date(availableData.expired_date);
        const now = new Date();
        const hoursLeft = Math.floor((expiredDate - now) / (1000 * 60 * 60));
        
        const expiredEl = document.getElementById('expiredDate');
        if (expiredEl) expiredEl.textContent = `${hoursLeft} hours`;
        
        const typeEl = document.getElementById('licenceType');
        const isVIP = availableData.is_vip === true;
        if (typeEl) {
            typeEl.textContent = isVIP ? '👑 VIP' : '📦 FREE';
            if (isVIP) typeEl.className = 'value vip';
        }
        
        if (stepTitle) stepTitle.textContent = '🎉 KEY UNLOCKED!';
        if (stepDesc) stepDesc.textContent = 'Copy your key below';
        
        await updateUserCounter();
        createConfetti();
        
    } catch (error) {
        console.error('❌ Error:', error);
        if (loadingSection) loadingSection.style.display = 'none';
        if (adsSection) adsSection.style.display = 'block';
        
        const statusEl = document.getElementById('adStatus');
        if (statusEl) {
            statusEl.className = 'ad-status error';
            statusEl.innerHTML = `
                <span class="status-icon">❌</span>
                <span class="status-text">${error.message}. Please refresh and try again.</span>
            `;
        }
        
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
    const keyEl = document.getElementById('licenceKey');
    if (!keyEl) return;
    
    const key = keyEl.textContent;
    navigator.clipboard.writeText(key).then(() => {
        const btn = document.querySelector('.btn-copy');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ COPIED!';
            btn.style.borderColor = '#00ff88';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.borderColor = '';
            }, 2000);
        }
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

// ============ AUTO REFRESH ============
setInterval(updateUserCounter, 30000);

// ============ EXPOSE GLOBAL ============
window.handleAdClick = handleAdClick;
window.copyLicence = copyLicence;
