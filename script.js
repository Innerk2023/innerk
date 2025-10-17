let soundEnabled = true;
let audioContext = null;
const achievements = new Set(JSON.parse(localStorage.getItem('chenle_achievements') || '[]'));
let miningBlocksDestroyed = 0;
let photosViewed = new Set();
let hasShownWelcomeTip = localStorage.getItem('chenle_welcome_tip_shown') === 'true';

// Toast提示函数
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 按钮点击反馈函数
function buttonClickFeedback(button) {
    button.classList.add('btn-flash');
    setTimeout(() => {
        button.classList.remove('btn-flash');
    }, 300);
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        initLoadingScreen();
        initAudioContext();
        init3DFloatingBlocks();
        initFireworks();
        initPortalEffect();
        initSoundToggle();
        initBlessingGenerator();
        initMiningGame();
        initCakeBuilding();
        initVillagerNPC();
        initBlockInteraction();
        initPhotoPixelate();
        initPhotoGestures();
        initHiddenCreeper();
        initPixelCake();
        initPhotoModal();
        
        console.log('%c🎉 生日快乐，刘宸乐！🎉', 'font-size: 30px; color: #FFD700; text-shadow: 2px 2px 4px #000;');
        console.log('%c✅ 所有功能已成功初始化', 'font-size: 16px; color: #4CAF50;');
    } catch (error) {
        console.error('❌ 初始化错误:', error);
    }
});

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const welcomeTip = document.getElementById('welcomeTip');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            setTimeout(() => {
                launchFireworks();
                unlockAchievement('welcome', '🎉 欢迎！', '参加刘宸乐的5岁生日会！');
                playSound('portal');
                
                if (!hasShownWelcomeTip) {
                    setTimeout(() => {
                        welcomeTip.classList.add('show');
                        setTimeout(() => {
                            welcomeTip.classList.remove('show');
                            localStorage.setItem('chenle_welcome_tip_shown', 'true');
                        }, 3000);
                    }, 500);
                }
            }, 500);
            
            document.getElementById('mainBanner').addEventListener('click', () => {
                launchFireworks();
                playSound('experience');
            });
        }, 1500);
    });
}

function initAudioContext() {
    // 移动端需要用户交互才能初始化音频
    const initAudio = () => {
        if (!audioContext && (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined')) {
            const AudioContextClass = AudioContext || webkitAudioContext;
            audioContext = new AudioContextClass();

            // 移动端需要 resume
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            console.log('✅ 音频系统已初始化');
            showToast('🔊 音效已启用！', 'info');
        }
    };

    // 立即尝试初始化
    initAudio();

    // 同时监听首次用户交互（移动端需要）
    const userInteractionEvents = ['touchstart', 'touchend', 'click'];
    const onFirstInteraction = () => {
        initAudio();
        // 移除监听器
        userInteractionEvents.forEach(event => {
            document.removeEventListener(event, onFirstInteraction);
        });
    };

    userInteractionEvents.forEach(event => {
        document.addEventListener(event, onFirstInteraction, { once: true });
    });
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

        if (soundEnabled) {
            showToast('🔊 音效已开启', 'info');
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume();
            }
        } else {
            showToast('🔇 音效已关闭', 'warning');
        }

        buttonClickFeedback(soundToggle);
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
    
    // Global particles array shared by all fireworks
    let allParticles = [];
    let animationFrameId = null;
    let isAnimating = false;
    let forceStopTimeout = null;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Single animation loop that manages all particles
    function animate() {
        // Clear canvas before each frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Filter out dead particles
        allParticles = allParticles.filter(p => p.life > 0);
        
        // Update and draw all alive particles
        allParticles.forEach(p => {
            // Update particle physics
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity
            p.life -= p.decay; // Life decay
            
            // Draw particle with opacity based on life
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;
            ctx.fillRect(Math.floor(p.x / 5) * 5, Math.floor(p.y / 5) * 5, 5, 5);
        });
        
        // Reset global alpha
        ctx.globalAlpha = 1;
        
        // Continue animation if particles exist
        if (allParticles.length > 0) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            // Stop animation when no particles left
            stopAnimation();
        }
    }
    
    // Start animation loop if not already running
    function startAnimation() {
        if (!isAnimating) {
            isAnimating = true;
            animate();
            
            // Force stop after 5 seconds to ensure cleanup (for both desktop and mobile)
            if (forceStopTimeout) {
                clearTimeout(forceStopTimeout);
            }
            forceStopTimeout = setTimeout(() => {
                forceStopAnimation();
            }, 5000);
        }
    }
    
    // Stop animation normally
    function stopAnimation() {
        isAnimating = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        // Final cleanup - ensure canvas is completely clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (forceStopTimeout) {
            clearTimeout(forceStopTimeout);
            forceStopTimeout = null;
        }
    }
    
    // Force stop animation and clear everything
    function forceStopAnimation() {
        allParticles = [];
        stopAnimation();
    }
    
    window.launchFireworks = function() {
        const isMobile = window.innerWidth < 768;
        const fireworkCount = isMobile ? 2 : 3;
        
        // Limit total particles to prevent accumulation
        const maxParticles = isMobile ? 150 : 300;
        
        for (let i = 0; i < fireworkCount; i++) {
            setTimeout(() => {
                // Check particle limit before creating new firework
                if (allParticles.length < maxParticles) {
                    createFirework(canvas.width, canvas.height, allParticles, maxParticles);
                    startAnimation();
                }
            }, i * 300);
        }
    };
}

function createFirework(width, height, allParticles, maxParticles) {
    const x = Math.random() * width;
    const y = Math.random() * height * 0.5;
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD700'];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 50;
    
    // Calculate how many particles we can actually add
    const availableSlots = maxParticles - allParticles.length;
    const actualParticleCount = Math.min(particleCount, availableSlots);
    
    for (let i = 0; i < actualParticleCount; i++) {
        const angle = (Math.PI * 2 * i) / actualParticleCount;
        const velocity = Math.random() * 3 + 2;
        
        allParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1.0,
            decay: 0.025 // Increased decay rate - particles will live for ~40 frames (~1.5-2 seconds at 60fps)
        });
    }
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
    try {
        const photo = document.getElementById('mainPhoto');
        const btn = document.getElementById('pixelateBtn');

        if (!photo || !btn) {
            console.error('照片像素化功能：缺少必要元素');
            return;
        }

        let isPixelated = false;

        btn.addEventListener('click', () => {
            try {
                isPixelated = !isPixelated;
                photo.classList.toggle('pixelated');
                btn.textContent = isPixelated ? '还原照片' : '像素化';
                playSound('block');
                buttonClickFeedback(btn);

                if (isPixelated) {
                    showToast('🎨 照片已像素化！', 'success');
                    unlockAchievement('pixelate', '🎨 像素大师', '发现像素化照片效果！');
                } else {
                    showToast('📷 照片已还原！', 'info');
                }
            } catch (error) {
                console.error('照片像素化功能错误:', error);
            }
        });

        const prevBtn = document.getElementById('photoPrev');
        const nextBtn = document.getElementById('photoNext');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                try {
                    playSound('portal');
                    buttonClickFeedback(prevBtn);
                    showToast('◀ 切换照片', 'info');
                    launchFireworks();
                    photosViewed.add('prev');
                    checkPhotoExplorer();
                } catch (error) {
                    console.error('照片前一张功能错误:', error);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                try {
                    playSound('portal');
                    buttonClickFeedback(nextBtn);
                    showToast('切换照片 ▶', 'info');
                    launchFireworks();
                    photosViewed.add('next');
                    checkPhotoExplorer();
                } catch (error) {
                    console.error('照片下一张功能错误:', error);
                }
            });
        }
    } catch (error) {
        console.error('初始化照片像素化功能错误:', error);
    }
}

function checkPhotoExplorer() {
    if (photosViewed.size >= 3) {
        unlockAchievement('explorer', '🗺️ 探险家', '浏览了所有照片！');
    }
}

function initPhotoGestures() {
    const photoWrapper = document.getElementById('photoWrapper');
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let lastTapTime = 0;
    
    photoWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });
    
    photoWrapper.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndTime = Date.now();
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        const timeDiff = touchEndTime - touchStartTime;
        
        if (timeDiff < 300 && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
            const currentTime = Date.now();
            if (currentTime - lastTapTime < 300) {
                openPhotoModal();
            }
            lastTapTime = currentTime;
        }
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                document.getElementById('photoNext').click();
            } else {
                document.getElementById('photoPrev').click();
            }
        }
    }, { passive: true });
}

function initPhotoModal() {
    const modal = document.getElementById('photoModal');
    const modalPhoto = document.getElementById('modalPhoto');
    const modalClose = document.getElementById('modalClose');
    const mainPhoto = document.getElementById('mainPhoto');
    
    modalClose.addEventListener('click', closePhotoModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePhotoModal();
        }
    });
}

function openPhotoModal() {
    const modal = document.getElementById('photoModal');
    const modalPhoto = document.getElementById('modalPhoto');
    const mainPhoto = document.getElementById('mainPhoto');
    
    modalPhoto.src = mainPhoto.src;
    modal.classList.add('show');
    playSound('portal');
}

function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    modal.classList.remove('show');
}

function initHiddenCreeper() {
    try {
        const creeper = document.getElementById('hiddenCreeper');
        
        if (!creeper) {
            console.error('苦力怕彩蛋功能：缺少必要元素');
            return;
        }
        
        const positions = [
            { top: '80px', left: '20px' },
            { top: '80px', right: '100px' },
            { bottom: '150px', left: '30px' },
            { bottom: '150px', right: '30px' },
            { top: '300px', left: '15px' },
            { top: '300px', right: '15px' }
        ];
        
        const randomPos = positions[Math.floor(Math.random() * positions.length)];
        Object.keys(randomPos).forEach(key => {
            creeper.style[key] = randomPos[key];
        });
        
        creeper.addEventListener('click', () => {
            try {
                playSound('creeper');
                createMegaExplosion(creeper);
                showToast('💚 发现隐藏的苦力怕！', 'success');
                unlockAchievement('hidden_creeper', '💚 发现了害羞的苦力怕！', '你找到了隐藏的彩蛋！');

                creeper.style.animation = 'creeperCelebrate 0.5s ease-out';
                setTimeout(() => {
                    creeper.style.animation = '';
                }, 500);

                launchFireworks();
                launchFireworks();
            } catch (error) {
                console.error('苦力怕彩蛋功能错误:', error);
            }
        });
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes creeperCelebrate {
                0%, 100% { transform: rotate(0deg) scale(1); }
                25% { transform: rotate(-15deg) scale(1.2); }
                75% { transform: rotate(15deg) scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    } catch (error) {
        console.error('初始化苦力怕彩蛋功能错误:', error);
    }
}

function createMegaExplosion(element) {
    const rect = element.getBoundingClientRect();
    const emojis = ['💚', '💥', '✨', '⭐', '🎉', '🎊', '💎', '🎁', '🌟', '⚡', '💫'];
    
    for (let i = 0; i < 20; i++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const explosion = document.createElement('div');
        explosion.textContent = emoji;
        
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 150 + Math.random() * 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        explosion.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            font-size: ${2 + Math.random() * 2}em;
            pointer-events: none;
            z-index: 9999;
            animation: megaExplosionAnim 1.5s ease-out forwards;
        `;
        
        explosion.style.setProperty('--tx', `${tx}px`);
        explosion.style.setProperty('--ty', `${ty}px`);
        
        document.body.appendChild(explosion);
        setTimeout(() => explosion.remove(), 1500);
    }
    
    if (!document.getElementById('mega-explosion-style')) {
        const style = document.createElement('style');
        style.id = 'mega-explosion-style';
        style.textContent = `
            @keyframes megaExplosionAnim {
                0% {
                    opacity: 1;
                    transform: translate(0, 0) scale(0) rotate(0deg);
                }
                50% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                    transform: translate(var(--tx), var(--ty)) scale(1.5) rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function initPixelCake() {
    try {
        const blowBtn = document.getElementById('blowCandleBtn');
        const candle = document.getElementById('cakeCandle');
        const flame = candle.querySelector('.candle-flame');
        const hint = document.querySelector('.candle-hint');

        if (!blowBtn || !candle || !flame || !hint) {
            console.error('吹蜡烛功能：缺少必要元素');
            return;
        }

        let isBlown = false;

        blowBtn.addEventListener('click', () => {
            try {
                buttonClickFeedback(blowBtn);

                if (isBlown) {
                    flame.classList.remove('blown');
                    isBlown = false;
                    blowBtn.textContent = '吹蜡烛 🎂';
                    hint.classList.remove('hidden');
                    showToast('🔥 蜡烛已点燃', 'info');
                } else {
                    flame.classList.add('blown');
                    isBlown = true;
                    blowBtn.textContent = '点燃蜡烛 🔥';
                    hint.classList.add('hidden');
                    showToast('🎂 蜡烛已吹灭！许个愿吧！', 'success');

                    playSound('experience');

                    setTimeout(() => {
                        launchFireworks();
                        launchFireworks();
                        createConfetti();
                        unlockAchievement('cake_blown', '🎂 许愿成功', '吹灭了生日蜡烛！');
                    }, 300);
                }
            } catch (error) {
                console.error('吹蜡烛功能错误:', error);
            }
        });
    } catch (error) {
        console.error('初始化吹蜡烛功能错误:', error);
    }
}

function createConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD700', '#FF69B4', '#7CB342'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            top: -20px;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
            z-index: 9999;
            transform: rotate(${Math.random() * 360}deg);
        `;
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
    
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
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
        buttonClickFeedback(btn);
        showToast('✨ 获得新祝福！', 'success');

        unlockAchievement('blessing', '📜 祝福收集者', '获取了神秘祝福！');
    });
}

function initMiningGame() {
    try {
        const miningArea = document.getElementById('miningArea');
        const scoreDisplay = document.getElementById('miningScore');
        const startBtn = document.getElementById('startMining');
        
        if (!miningArea || !scoreDisplay || !startBtn) {
            console.error('挖方块游戏功能：缺少必要元素');
            return;
        }
        
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
        buttonClickFeedback(startBtn);
        showToast('⛏️ 挖矿游戏开始！30秒倒计时！', 'success');

        spawnBlock();
        blockInterval = setInterval(spawnBlock, 1500);

        // 添加倒计时提醒
        let timeLeft = 30;
        const countdownInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft === 20) {
                showToast('⏰ 还剩20秒！', 'info');
            } else if (timeLeft === 10) {
                showToast('⏰ 还剩10秒！快点挖！', 'warning');
            } else if (timeLeft === 5) {
                showToast('⏰ 最后5秒！！！', 'warning');
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(countdownInterval);
            if (gameActive) {
                stopGame();
                if (score >= 50) {
                    showToast('🏆 挖矿大师！得分：' + score, 'success');
                    unlockAchievement('mining_master', '⛏️ 挖矿大师', '挖矿游戏得分超过50！');
                } else {
                    showToast('⛏️ 游戏结束！得分：' + score, 'info');
                }
            }
        }, 30000);
    }

    function stopGame() {
        gameActive = false;
        startBtn.textContent = '开始游戏';
        clearInterval(blockInterval);
        buttonClickFeedback(startBtn);
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
            
            miningBlocksDestroyed++;
            if (miningBlocksDestroyed >= 10) {
                unlockAchievement('mining_expert', '⛏️ 挖矿达人', '挖掘了10个方块！');
            }
            
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
    } catch (error) {
        console.error('初始化挖方块游戏功能错误:', error);
    }
}

function initCakeBuilding() {
    try {
        const cakeDisplay = document.getElementById('cakeDisplay');
        const cakeBlocks = document.querySelectorAll('.cake-block-btn');
        const resetBtn = document.getElementById('resetCake');
        
        if (!cakeDisplay || !cakeBlocks || cakeBlocks.length === 0 || !resetBtn) {
            console.error('蛋糕建造游戏功能：缺少必要元素');
            return;
        }
        
        let layers = [];
        
        cakeBlocks.forEach(btn => {
            btn.addEventListener('click', () => {
                try {
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
                } catch (error) {
                    console.error('蛋糕建造功能错误:', error);
                }
            });
        });
        
        resetBtn.addEventListener('click', () => {
            try {
                cakeDisplay.innerHTML = '';
                layers = [];
                playSound('block');
            } catch (error) {
                console.error('重置蛋糕功能错误:', error);
            }
        });
    } catch (error) {
        console.error('初始化蛋糕建造游戏功能错误:', error);
    }
}

function initVillagerNPC() {
    try {
        const villager = document.getElementById('villagerNpc');
        const bubble = document.getElementById('villagerBubble');
        
        if (!villager || !bubble) {
            console.error('村民NPC功能：缺少必要元素');
            return;
        }
        
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
            try {
                const message = messages[Math.floor(Math.random() * messages.length)];
                bubble.textContent = message;
                bubble.classList.add('show');

                playSound('villager');
                showToast('🧑‍🌾 ' + message, 'info');

                clearTimeout(bubbleTimeout);
                bubbleTimeout = setTimeout(() => {
                    bubble.classList.remove('show');
                }, 3000);

                unlockAchievement('villager', '🧑‍🌾 村民朋友', '和村民NPC互动了！');
            } catch (error) {
                console.error('村民NPC点击功能错误:', error);
            }
        });
        
        setInterval(() => {
            try {
                if (!bubble.classList.contains('show')) {
                    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                    bubble.textContent = randomMessage;
                    bubble.classList.add('show');
                    
                    setTimeout(() => {
                        bubble.classList.remove('show');
                    }, 2000);
                }
            } catch (error) {
                console.error('村民NPC自动消息错误:', error);
            }
        }, 20000);
    } catch (error) {
        console.error('初始化村民NPC功能错误:', error);
    }
}

function initBlockInteraction() {
    try {
        const blocks = document.querySelectorAll('.minecraft-cube');
        const messageDisplay = document.getElementById('messageDisplay');
        
        if (!blocks || blocks.length === 0 || !messageDisplay) {
            console.error('方块互动功能：缺少必要元素');
            return;
        }
        
        blocks.forEach(block => {
            block.addEventListener('click', function() {
                try {
                    const message = this.dataset.message;
                    
                    messageDisplay.textContent = message;
                    messageDisplay.classList.add('show');
                    
                    createParticles(this);
                    playSound('block');
                    
                    setTimeout(() => {
                        messageDisplay.classList.remove('show');
                    }, 3000);
                } catch (error) {
                    console.error('方块点击功能错误:', error);
                }
            });
        });
    } catch (error) {
        console.error('初始化方块互动功能错误:', error);
    }
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
