// ========================================
// SCARY BOT WEBSITE - SCRIPT (PARTIKEL UNGU + COUNTER)
// BY TUAN KEPALA CPY
// ========================================

// ============ CONFIG ============
const GITHUB_USERNAME = 'pxlteam01';
const GITHUB_REPO = 'licence';

const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/licence.json`;
const GITHUB_STATUS_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/website_status.json`;
const GITHUB_STATS_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/stats.json`;

// ============ STATE ============
let state = {
    adCompleted: false,
    adWaiting: false,
    licenceKey: null,
    isProcessing: false,
    websiteStatus: true,
    currentStep: 0,
    totalUsers: 0
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
    { icon: '🏨', title: 'Traveloka', sub: 'Travel & Hotel', url: 'https://traveloka.com' }
];

// ============ INIT ============
document.addEventListener('DOMContentLoaded', async () => {
    await checkWebsiteStatus();
    await updateUserCounter();
    initParticles();
    initAd();
});

// ============ AMBIL TOTAL PENGGUNA ============
async function updateUserCounter() {
    try {
        const response = await fetch(GITHUB_STATS_URL, { cache: 'no-store' });
        if (response.ok) {
            const data = await response.json();
            state.totalUsers = data.total_users || 0;
            document.getElementById('totalUsers').textContent = state.totalUsers;
            document.getElementById('totalUsersCount').textContent = state.totalUsers;
        }
    } catch (error) {
        console.log('⚠️ Gagal ambil stats:', error);
        document.getElementById('totalUsers').textContent = '...';
    }
}

// ============ UPDATE STATS (TAMBAH PENGGUNA) ============
async function incrementUserCount() {
    try {
        // Ambil stats terbaru
        const response = await fetch(GITHUB_STATS_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error('Gagal ambil stats');
        
        const stats = await response.json();
        stats.total_users = (stats.total_users || 0) + 1;
        stats.last_update = new Date().toISOString();
        
        // Update ke GitHub via API
        const updateRes = await fetch('/api/update-stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stats)
        });
        
        if (updateRes.ok) {
            state.totalUsers = stats.total_users;
            document.getElementById('totalUsers').textContent = state.totalUsers;
            document.getElementById('totalUsersCount').textContent = state.totalUsers;
            console.log('✅ User count updated:', state.totalUsers);
        }
    } catch (error) {
        console.log('⚠️ Gagal update stats:', error);
    }
}

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

// ============ PARTICLES UNGU ============
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 80;

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
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = `rgba(155, 77, 255, ${this.opacity})`;
            this.pulse = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.02 + Math.random() * 0.03;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += this.pulseSpeed;
            
            const pulseOpacity = 0.2 + Math.sin(this.pulse) * 0.3 + 0.3;
            this.color = `rgba(155, 77, 255, ${pulseOpacity * 0.7})`;

            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            
            // Glow effect
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 4);
            gradient.addColorStop(0, `rgba(155, 77, 255, ${0.1 * Math.sin(this.pulse) + 0.1})`);
            gradient.addColorStop(1, 'rgba(155, 77, 255, 0)');
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // Connect particles dengan garis
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.2;
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

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawLines();
        requestAnimationFrame(animate);
    }

    animate();
}

// ============ INIT ADS ============
function initAd() {
    // Pilih iklan random
    const randomAd = ADS_LIST[Math.floor(Math.random() * ADS_LIST.length)];
    document.getElementById('adIcon').textContent = randomAd.icon;
    document.getElementById('adTitle').textContent = randomAd.title;
    document.getElementById('adSub').textContent = randomAd.sub;
    
    // Simpan URL iklan
    document.getElementById('btnAd').dataset.url = randomAd.url;
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
    
    // Update steps
    updateStep(1);
    updateProgress(20);
    
    // Buka iklan
    const url = btn.dataset.url;
    window.open(url, '_blank');
    
    // Disable button
    btn.disabled = true;
    btn.textContent = '⏳ Tunggu...';
    countdownEl.style.display = 'block';
    statusEl.textContent = '⏳ Menunggu konfirmasi...';
    
    // Countdown 3 detik
    let countdown = 3;
    numberEl.textContent = countdown;
    
    const interval = setInterval(() => {
        countdown--;
        numberEl.textContent = countdown;
        
        // Update progress
        const progress = 20 + ((3 - countdown) / 3) * 30;
        updateProgress(progress);
        
        if (countdown <= 0) {
            clearInterval(interval);
            
            // Selesai
            state.adCompleted = true;
            state.adWaiting = false;
            state.isProcessing = false;
            
            btn.textContent = '✅ Selesai!';
            btn.className = 'btn-ad done';
            countdownEl.style.display = 'none';
            statusEl.textContent = '✅ Iklan selesai! Mengambil licence...';
            statusEl.className = 'ad-status success';
            
            updateStep(2);
            updateProgress(50);
            
            // Ambil licence
            setTimeout(() => {
                getLicence();
            }, 1000);
        }
    }, 1000);
}

// ============ UPDATE STEP ============
function updateStep(step) {
    state.currentStep = step;
    
    for (let i = 1; i <= 5; i++) {
        const item = document.getElementById(`step${i}`);
        const status = document.getElementById(`stepStatus${i}`);
        const line = document.getElementById(`line${i-1}`);
        
        item.classList.remove('active', 'completed');
        
        if (i < step) {
            item.classList.add('completed');
            status.textContent = '✅';
            if (line) line.className = 'step-line completed';
        } else if (i === step) {
            item.classList.add('active');
            status.textContent = '🔄';
        } else {
            status.textContent = '⏳';
            if (line) line.className = 'step-line';
        }
    }
}

// ============ UPDATE PROGRESS ============
function updateProgress(percent) {
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    
    bar.style.width = percent + '%';
    
    if (percent < 25) {
        text.textContent = `${Math.round(percent)}% - Klik iklan!`;
    } else if (percent < 50) {
        text.textContent = `${Math.round(percent)}% - Menunggu...`;
    } else if (percent < 75) {
        text.textContent = `${Math.round(percent)}% - Mengambil licence...`;
    } else if (percent < 100) {
        text.textContent = `${Math.round(percent)}% - Hampir selesai!`;
    } else {
        text.textContent = `✅ 100% - Selesai!`;
    }
}

// ============ GET LICENCE ============
async function getLicence() {
    const loadingSection = document.getElementById('loadingSection');
    const adsSection = document.getElementById('adsSection');
    const licenceSection = document.getElementById('licenceSection');
    
    updateStep(3);
    updateProgress(60);
    
    adsSection.style.display = 'none';
    loadingSection.style.display = 'block';
    
    try {
        console.log('📡 Fetching licences from:', GITHUB_RAW_URL);
        
        const response = await fetch(GITHUB_RAW_URL, { 
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const licences = await response.json();
        console.log('📦 Data received:', licences);
        
        if (!licences || typeof licences !== 'object') {
            throw new Error('Data licences kosong atau format salah');
        }
        
        const keys = Object.keys(licences);
        console.log('🔑 Available keys:', keys.length);
        
        if (keys.length === 0) {
            throw new Error('Tidak ada licence tersedia di GitHub!');
        }
        
        let availableKey = null;
        let availableData = null;
        let expiredCount = 0;
        let usedCount = 0;
        
        for (const [key, data] of Object.entries(licences)) {
            const expiredDate = new Date(data.expired_date);
            const now = new Date();
            
            if (now > expiredDate) {
                expiredCount++;
                continue;
            }
            
            if (data.used === true) {
                usedCount++;
                continue;
            }
            
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
        
        updateStep(4);
        updateProgress(80);
        
        // Tampilkan licence
        state.licenceKey = availableKey;
        
        loadingSection.style.display = 'none';
        licenceSection.style.display = 'block';
        
        document.getElementById('licenceKey').textContent = availableKey;
        
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
        
        document.getElementById('expiredDate').textContent = `${timeLeft} (${expiredDate.toLocaleDateString('id-ID')})`;
        
        const isVIP = availableData.is_vip === true;
        document.getElementById('licenceType').textContent = isVIP ? '👑 VIP' : '📦 FREE';
        if (isVIP) {
            document.getElementById('licenceType').className = 'value vip';
        }
        
        updateStep(5);
        updateProgress(100);
        
        // Update user count
        await incrementUserCount();
        
        createConfetti();
        
    } catch (error) {
        console.error('❌ Error:', error);
        loadingSection.style.display = 'none';
        adsSection.style.display = 'block';
        
        alert('❌ Gagal mendapatkan licence!\n\n' + error.message + '\n\n📌 Hubungi admin: @tuan_cpy');
        
        state.adCompleted = false;
        state.adWaiting = false;
        state.isProcessing = false;
        
        const btn = document.getElementById('btnAd');
        btn.disabled = false;
        btn.textContent = '👆 Klik Iklan';
        btn.className = 'btn-ad';
        document.getElementById('adStatus').textContent = 'Coba lagi';
        document.getElementById('adStatus').className = 'ad-status error';
        
        updateStep(0);
        updateProgress(0);
    }
}

// ============ COPY LICENCE ============
function copyLicence() {
    const key = document.getElementById('licenceKey').textContent;
    navigator.clipboard.writeText(key).then(() => {
        const btn = document.querySelector('.btn-copy');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        btn.style.borderColor = '#9b4dff';
        
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

// ============ CONFETTI ============
function createConfetti() {
    const colors = ['#9b4dff', '#7b2ffc', '#6a1b9a', '#b388ff', '#e040fb', '#ff4081'];
    
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

// ============ AUTO REFRESH ============
setInterval(() => {
    updateUserCounter();
}, 30000);

// ============ EXPOSE GLOBAL ============
window.handleAdClick = handleAdClick;
window.copyLicence = copyLicence;
