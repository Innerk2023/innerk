let soundEnabled = true;
let audioContext = null;
const achievements = new Set(JSON.parse(localStorage.getItem('chenle_achievements') || '[]'));

document.addEventListener('DOMContentLoaded', function() {
    initAudioContext();
    init3DFloatingBlocks();
    initFireworks();
    initPortalEffect();
    initSoundToggle();
    initBlessingGenerator();
    initCountdown();
    initMiningGame();
    initCakeBuilding();
    initVillagerNPC();
    initBlockInteraction();
    initPhotoPixelate();
    
    setTimeout(() => {
        launchFireworks();
        unlockAchievement('welcome', '🎉 欢迎！', '参加刘宸乐的5岁生日会！');
        playSound('portal');
    }, 1000);
    
    document.getElementById('mainBanner').addEventListener('click', () => {
        launchFireworks();
        playSound('experience');
    });
    
    console.log('%c🎉 生日快乐，刘宸乐！🎉', 'font-size: 30px; color: #FFD700; text-shadow: 2px 2px 4px #000;');
});

function initAudioContext() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const AudioContextClass = AudioContext || webkitAudioContext;
        audioContext = new AudioContextClass();
    }
}

function playSound(type) {
    if (!soundEnabled || !audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const currentTime = audioContext.currentTime;
    
    switch(type) {
        case 'block':
            oscillator.frequency.value = 800;
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.3, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.1);
            break;
        case 'break':
            oscillator.frequency.value = 600;
            oscillator.type = 'sawtooth';
            gainNode.gain.setValueAtTime(0.2, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.2);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.2);
            break;
        case 'experience':
            for (let i = 0; i < 3; i++) {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = 800 + (i * 200);
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.2, currentTime + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, currentTime + i * 0.1 + 0.2);
                osc.start(currentTime + i * 0.1);
                osc.stop(currentTime + i * 0.1 + 0.2);
            }
            break;
        case 'creeper':
            oscillator.frequency.value = 100;
            oscillator.type = 'sawtooth';
            gainNode.gain.setValueAtTime(0.1, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 1.5);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 1.5);
            break;
        case 'portal':
            oscillator.frequency.value = 400;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.2, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.5);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.5);
            break;
        case 'villager':
            oscillator.frequency.value = 500;
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.15, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.15);
            oscillator.start(currentTime);
            oscillator.stop(currentTime + 0.15);
            break;
    }
}

function initSoundToggle() {
    const soundToggle = document.getElementById('soundToggle');
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundToggle.classList.toggle('muted');
        if (soundEnabled && audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    });
}

function init3DFloatingBlocks() {
    const container = document.querySelector('.floating-blocks-3d');
    const colors = [
        'linear-gradient(135deg, rgba(124, 179, 66, 0.3) 0%, rgba(85, 139, 47, 0.3) 100%)',
        'linear-gradient(135deg, rgba(79, 195, 247, 0.3) 0%, rgba(2, 136, 209, 0.3) 100%)',
        'linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 165, 0, 0.3) 100%)',
        'linear-gradient(135deg, rgba(229, 115, 115, 0.3) 0%, rgba(211, 47, 47, 0.3) 100%)',
        'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(56, 142, 60, 0.3) 100%)'
    ];
    
    const isMobile = window.innerWidth < 768;
    const blockCount = isMobile ? 8 : 15;
    
    for (let i = 0; i < blockCount; i++) {
        const block = document.createElement('div');
        block.className = 'floating-block-3d';
        
        const size = Math.random() * 30 + 30;
        const startPosition = Math.random() * 100;
        const delay = Math.random() * 20;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        block.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${startPosition}%;
            animation-delay: ${delay}s;
        `;
        
        container.appendChild(block);
    }
}

function initFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    window.launchFireworks = function() {
        const isMobile = window.innerWidth < 768;
        const fireworkCount = isMobile ? 2 : 3;
        
        for (let i = 0; i < fireworkCount; i++) {
            setTimeout(() => {
                createFirework(ctx, canvas.width, canvas.height);
            }, i * 300);
        }
    };
    
    setInterval(() => {
        launchFireworks();
    }, 15000);
}

function createFirework(ctx, width, height) {
    const x = Math.random() * width;
    const y = Math.random() * height * 0.5;
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD700'];
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * (Math.random() * 3 + 2),
            vy: Math.sin(angle) * (Math.random() * 3 + 2),
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1
        });
    }
    
    function animate() {
        particles.forEach((p, index) => {
            if (p.life <= 0) {
                particles.splice(index, 1);
                return;
            }
            
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.fillRect(Math.floor(p.x / 5) * 5, Math.floor(p.y / 5) * 5, 5, 5);
            
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.life -= 0.02;
        });
        
        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.globalAlpha = 1;
        }
    }
    
    animate();
}

function initPortalEffect() {
    const canvas = document.getElementById('portalCanvas');
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    
    const particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1
        });
    }
    
    function animatePortal() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            ctx.fillStyle = `rgba(139, 0, 255, ${Math.random() * 0.5 + 0.3})`;
            ctx.fillRect(Math.floor(p.x / 3) * 3, Math.floor(p.y / 3) * 3, p.size, p.size);
            
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
        
        requestAnimationFrame(animatePortal);
    }
    
    animatePortal();
}

function initPhotoPixelate() {
    const photo = document.getElementById('mainPhoto');
    const btn = document.getElementById('pixelateBtn');
    let isPixelated = false;
    
    btn.addEventListener('click', () => {
        isPixelated = !isPixelated;
        photo.classList.toggle('pixelated');
        btn.textContent = isPixelated ? '还原照片' : '像素化';
        playSound('block');
        
        if (isPixelated) {
            unlockAchievement('pixelate', '🎨 像素大师', '发现像素化照片效果！');
        }
    });
    
    const prevBtn = document.getElementById('photoPrev');
    const nextBtn = document.getElementById('photoNext');
    
    prevBtn.addEventListener('click', () => {
        playSound('portal');
        launchFireworks();
    });
    
    nextBtn.addEventListener('click', () => {
        playSound('portal');
        launchFireworks();
    });
}

function initBlessingGenerator() {
    const blessings = [
        '愿你的生命值永远满格！❤️❤️❤️',
        '祝你获得稀有附魔：快乐V级！✨',
        'Happy Birthday！经验+5岁！⭐',
        '愿你的冒险之路充满钻石！💎',
        '祝你每天都能找到隐藏宝箱！🎁',
        '愿你拥有无限的创造力！🌈',
        '恭喜升级到5级玩家！🏆',
        '获得成就：最快乐的5岁！🎉',
        '祝福效果：幸运BUFF永久生效！🍀',
        '愿你建造最美的梦想世界！🏰',
        '传说装备获得：快乐之剑！⚔️',
        '愿你的背包装满欢笑和爱！🎒',
    ];
    
    const textElement = document.getElementById('blessingText');
    const btn = document.getElementById('generateBlessing');
    let lastIndex = 0;
    
    btn.addEventListener('click', () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * blessings.length);
        } while (newIndex === lastIndex && blessings.length > 1);
        
        lastIndex = newIndex;
        
        textElement.style.transform = 'scale(0)';
        textElement.style.opacity = '0';
        
        setTimeout(() => {
            textElement.textContent = blessings[newIndex];
            textElement.style.transform = 'scale(1)';
            textElement.style.opacity = '1';
        }, 200);
        
        playSound('experience');
        createSparkles(btn);
        
        unlockAchievement('blessing', '📜 祝福收集者', '获取了神秘祝福！');
    });
}

function initCountdown() {
    const birthday = new Date('2025-01-01T00:00:00');
    const creeperAvatar = document.getElementById('creeperAvatar');
    
    function updateCountdown() {
        const now = new Date();
        const diff = birthday - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = Math.abs(days);
        document.getElementById('hours').textContent = Math.abs(hours);
        document.getElementById('minutes').textContent = Math.abs(minutes);
        document.getElementById('seconds').textContent = Math.abs(seconds);
        
        if (diff < 0) {
            document.querySelector('.countdown-title').textContent = '生日已经过去';
        }
        
        if (Math.abs(days) === 0 && Math.abs(hours) === 0 && Math.abs(minutes) === 0) {
            creeperAvatar.style.animation = 'creepShake 0.5s infinite';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    creeperAvatar.addEventListener('click', () => {
        playSound('creeper');
        createExplosion(creeperAvatar);
        unlockAchievement('creeper', '💥 苦力怕好友', '点击了苦力怕！');
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes creepShake {
            0%, 100% { transform: translateX(0) translateY(0); }
            25% { transform: translateX(-5px) translateY(-5px); }
            75% { transform: translateX(5px) translateY(5px); }
        }
    `;
    document.head.appendChild(style);
}

function createExplosion(element) {
    const rect = element.getBoundingClientRect();
    const explosionEmojis = ['💥', '💨', '✨', '⚡', '🔥'];
    
    explosionEmojis.forEach((emoji, index) => {
        const explosion = document.createElement('div');
        explosion.textContent = emoji;
        explosion.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: 3em;
            pointer-events: none;
            z-index: 9999;
            animation: explosionAnim 1s ease-out forwards;
            animation-delay: ${index * 0.1}s;
        `;
        
        document.body.appendChild(explosion);
        setTimeout(() => explosion.remove(), 1500);
    });
    
    if (!document.getElementById('explosion-style')) {
        const style = document.createElement('style');
        style.id = 'explosion-style';
        style.textContent = `
            @keyframes explosionAnim {
                0% {
                    opacity: 1;
                    transform: scale(0);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.5);
                }
                100% {
                    opacity: 0;
                    transform: scale(3);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function initMiningGame() {
    const miningArea = document.getElementById('miningArea');
    const scoreDisplay = document.getElementById('miningScore');
    const startBtn = document.getElementById('startMining');
    let score = 0;
    let gameActive = false;
    let blockInterval;
    
    const blockTypes = [
        { emoji: '🟫', color: '#8D6E63', points: 1, blessing: '挖到了泥土！' },
        { emoji: '⚫', color: '#757575', points: 2, blessing: '获得石头！' },
        { emoji: '💎', color: '#4FC3F7', points: 10, blessing: '钻石！！！' },
        { emoji: '🟡', color: '#FFD700', points: 5, blessing: '金矿！' },
        { emoji: '🟢', color: '#4CAF50', points: 8, blessing: '绿宝石！' },
        { emoji: '🔴', color: '#F44336', points: 3, blessing: '红石！' }
    ];
    
    startBtn.addEventListener('click', () => {
        if (gameActive) {
            stopGame();
        } else {
            startGame();
        }
    });
    
    function startGame() {
        gameActive = true;
        score = 0;
        scoreDisplay.textContent = score;
        startBtn.textContent = '停止游戏';
        miningArea.innerHTML = '';
        
        spawnBlock();
        blockInterval = setInterval(spawnBlock, 1500);
        
        setTimeout(() => {
            if (gameActive) {
                stopGame();
                if (score >= 50) {
                    unlockAchievement('mining_master', '⛏️ 挖矿大师', '挖矿游戏得分超过50！');
                }
            }
        }, 30000);
    }
    
    function stopGame() {
        gameActive = false;
        startBtn.textContent = '开始游戏';
        clearInterval(blockInterval);
    }
    
    function spawnBlock() {
        if (!gameActive) return;
        
        const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
        const block = document.createElement('div');
        block.className = 'mining-block';
        block.textContent = blockType.emoji;
        block.style.backgroundColor = blockType.color;
        
        const maxX = miningArea.offsetWidth - 70;
        const maxY = miningArea.offsetHeight - 70;
        block.style.left = Math.random() * maxX + 'px';
        block.style.top = Math.random() * maxY + 'px';
        
        block.addEventListener('click', () => {
            if (!gameActive) return;
            
            score += blockType.points;
            scoreDisplay.textContent = score;
            
            block.classList.add('breaking');
            playSound('break');
            
            const blessing = document.createElement('div');
            blessing.className = 'blessing-drop';
            blessing.textContent = blockType.blessing;
            blessing.style.left = block.style.left;
            blessing.style.top = block.style.top;
            miningArea.appendChild(blessing);
            
            setTimeout(() => blessing.remove(), 2000);
            setTimeout(() => block.remove(), 300);
        });
        
        miningArea.appendChild(block);
        
        setTimeout(() => {
            if (block.parentElement && gameActive) {
                block.remove();
            }
        }, 3000);
    }
}

function initCakeBuilding() {
    const cakeDisplay = document.getElementById('cakeDisplay');
    const cakeBlocks = document.querySelectorAll('.cake-block-btn');
    const resetBtn = document.getElementById('resetCake');
    let layers = [];
    
    cakeBlocks.forEach(btn => {
        btn.addEventListener('click', () => {
            const layerType = btn.dataset.layer;
            const emoji = btn.textContent;
            
            if (layerType === 'candle' && layers.length === 0) {
                return;
            }
            
            const layer = document.createElement('div');
            layer.className = 'cake-layer';
            layer.textContent = emoji;
            
            if (layerType === '1') {
                layer.style.background = 'linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%)';
            } else if (layerType === '2') {
                layer.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
            } else if (layerType === '3') {
                layer.style.background = 'linear-gradient(135deg, #FF6B6B 0%, #FF4444 100%)';
            }
            
            cakeDisplay.appendChild(layer);
            layers.push(emoji);
            
            playSound('block');
            
            if (layers.includes('🕯️') && layers.length >= 4) {
                setTimeout(() => {
                    launchFireworks();
                    unlockAchievement('cake', '🎂 蛋糕建造师', '成功建造了生日蛋糕！');
                    playSound('experience');
                }, 300);
            }
        });
    });
    
    resetBtn.addEventListener('click', () => {
        cakeDisplay.innerHTML = '';
        layers = [];
        playSound('block');
    });
}

function initVillagerNPC() {
    const villager = document.getElementById('villagerNpc');
    const bubble = document.getElementById('villagerBubble');
    
    const messages = [
        '哼哼！生日快乐！🎉',
        '我有好东西要卖给你...开玩笑的！😄',
        '5岁啦！真是个好年纪！',
        '祝你健康成长！💚',
        '要不要和我做交易？🤝',
        '听说今天有个小朋友过生日？🎂',
        '哼哼哼~~~',
        '你看起来很开心！😊'
    ];
    
    let bubbleTimeout;
    
    villager.addEventListener('click', () => {
        const message = messages[Math.floor(Math.random() * messages.length)];
        bubble.textContent = message;
        bubble.classList.add('show');
        
        playSound('villager');
        
        clearTimeout(bubbleTimeout);
        bubbleTimeout = setTimeout(() => {
            bubble.classList.remove('show');
        }, 3000);
        
        unlockAchievement('villager', '🧑‍🌾 村民朋友', '和村民NPC互动了！');
    });
    
    setInterval(() => {
        if (!bubble.classList.contains('show')) {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            bubble.textContent = randomMessage;
            bubble.classList.add('show');
            
            setTimeout(() => {
                bubble.classList.remove('show');
            }, 2000);
        }
    }, 20000);
}

function initBlockInteraction() {
    const blocks = document.querySelectorAll('.minecraft-cube');
    const messageDisplay = document.getElementById('messageDisplay');
    
    blocks.forEach(block => {
        block.addEventListener('click', function() {
            const message = this.dataset.message;
            
            messageDisplay.textContent = message;
            messageDisplay.classList.add('show');
            
            createParticles(this);
            playSound('block');
            
            setTimeout(() => {
                messageDisplay.classList.remove('show');
            }, 3000);
        });
    });
}

function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const particles = ['✨', '⭐', '💫', '🌟', '💥', '⚡'];
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: 1.5em;
            pointer-events: none;
            z-index: 9999;
            animation: particleExplosion 1s ease-out forwards;
        `;
        
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 100;
        particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
    
    if (!document.getElementById('particle-style')) {
        const style = document.createElement('style');
        style.id = 'particle-style';
        style.textContent = `
            @keyframes particleExplosion {
                0% {
                    opacity: 1;
                    transform: translate(0, 0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(var(--tx), var(--ty)) scale(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.cssText = `
            position: fixed;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            font-size: ${Math.random() * 20 + 10}px;
            pointer-events: none;
            z-index: 9999;
            animation: sparkleAnim 1s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    if (!document.getElementById('sparkle-style')) {
        const style = document.createElement('style');
        style.id = 'sparkle-style';
        style.textContent = `
            @keyframes sparkleAnim {
                0% {
                    opacity: 1;
                    transform: scale(0) rotate(0deg);
                }
                50% {
                    opacity: 1;
                    transform: scale(1) rotate(180deg);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function unlockAchievement(id, title, description) {
    if (achievements.has(id)) return;
    
    achievements.add(id);
    localStorage.setItem('chenle_achievements', JSON.stringify([...achievements]));
    
    const container = document.getElementById('achievementContainer');
    const achievement = document.createElement('div');
    achievement.className = 'achievement';
    achievement.innerHTML = `
        <div class="achievement-icon">🏆</div>
        <div class="achievement-content">
            <div class="achievement-title">${title}</div>
            <div class="achievement-desc">${description}</div>
        </div>
    `;
    
    container.appendChild(achievement);
    playSound('experience');
    
    setTimeout(() => {
        achievement.remove();
    }, 5000);
}

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            console.log('向左滑动');
        } else {
            console.log('向右滑动');
        }
    }
}, { passive: true });

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        const canvas = document.getElementById('fireworksCanvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const portalCanvas = document.getElementById('portalCanvas');
        const container = portalCanvas.parentElement;
        portalCanvas.width = container.offsetWidth;
        portalCanvas.height = container.offsetHeight;
    }, 200);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        console.log('🎮 刘宸乐生日网站已加载完成！');
    });
}
