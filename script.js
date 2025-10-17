// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initFloatingBlocks();
    initBlockInteraction();
    initConfetti();
    initParticles();
    
    console.log('🎉 刘宸乐的生日网站加载完成！');
});

// 创建浮动方块动画
function initFloatingBlocks() {
    const floatingContainer = document.querySelector('.floating-blocks');
    const colors = [
        'rgba(124, 179, 66, 0.3)',  // 草方块绿
        'rgba(79, 195, 247, 0.3)',  // 钻石蓝
        'rgba(255, 215, 0, 0.3)',    // 金色
        'rgba(229, 115, 115, 0.3)',  // 红石红
        'rgba(76, 175, 80, 0.3)'     // 绿宝石绿
    ];
    
    // 创建多个浮动方块
    for (let i = 0; i < 15; i++) {
        const block = document.createElement('div');
        block.className = 'floating-block';
        
        const size = Math.random() * 40 + 20;
        const startPosition = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 10 + 15;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        block.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border: 2px solid rgba(0, 0, 0, 0.2);
            left: ${startPosition}%;
            top: 100%;
            animation: float ${duration}s infinite;
            animation-delay: ${delay}s;
            border-radius: 5px;
        `;
        
        floatingContainer.appendChild(block);
    }
}

// 方块点击互动
function initBlockInteraction() {
    const blocks = document.querySelectorAll('.minecraft-cube');
    const messageDisplay = document.getElementById('messageDisplay');
    let lastClickedBlock = null;
    
    blocks.forEach(block => {
        // 点击方块显示消息
        block.addEventListener('click', function() {
            const message = this.dataset.message;
            
            // 移除之前的高亮
            if (lastClickedBlock) {
                lastClickedBlock.style.transform = '';
            }
            
            // 高亮当前方块
            this.style.transform = 'scale(1.15) rotate(10deg)';
            lastClickedBlock = this;
            
            // 显示消息
            messageDisplay.textContent = message;
            messageDisplay.classList.add('show');
            
            // 创建点击特效
            createClickEffect(this);
            
            // 播放音效（模拟）
            playBlockSound();
            
            // 3秒后重置
            setTimeout(() => {
                if (lastClickedBlock === this) {
                    this.style.transform = '';
                }
            }, 3000);
        });
        
        // 鼠标悬停效果
        block.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.2s ease';
        });
    });
}

// 创建点击特效
function createClickEffect(element) {
    const rect = element.getBoundingClientRect();
    const particles = ['✨', '⭐', '💫', '🌟', '💥'];
    
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
    
    // 添加粒子爆炸动画
    if (!document.getElementById('particle-animation-style')) {
        const style = document.createElement('style');
        style.id = 'particle-animation-style';
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

// 模拟方块音效
function playBlockSound() {
    // 创建音频上下文（如果浏览器支持）
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        try {
            const AudioContextClass = AudioContext || webkitAudioContext;
            const audioContext = new AudioContextClass();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('音频播放不可用');
        }
    }
}

// 初始化彩纸效果
function initConfetti() {
    // 在页面加载时触发一次彩纸效果
    setTimeout(() => {
        createConfetti();
    }, 1000);
    
    // 每20秒触发一次
    setInterval(() => {
        createConfetti();
    }, 20000);
}

// 创建彩纸效果
function createConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD700', '#FF69B4'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 2;
        const size = Math.random() * 10 + 5;
        
        confetti.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            top: -10%;
            z-index: 9999;
            pointer-events: none;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${animationDuration}s linear forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), animationDuration * 1000);
    }
    
    // 添加彩纸下落动画
    if (!document.getElementById('confetti-animation-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-animation-style';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    top: -10%;
                    opacity: 1;
                }
                100% {
                    top: 110%;
                    opacity: 0;
                    transform: translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 720}deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 初始化粒子效果
function initParticles() {
    const banner = document.querySelector('.banner');
    
    if (banner) {
        setInterval(() => {
            createSparkle(banner);
        }, 300);
    }
}

// 创建闪烁粒子
function createSparkle(container) {
    const sparkle = document.createElement('div');
    const rect = container.getBoundingClientRect();
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    
    sparkle.textContent = '✨';
    sparkle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        font-size: ${Math.random() * 20 + 10}px;
        pointer-events: none;
        animation: sparkleAnimation 1s ease-out forwards;
        z-index: 10;
    `;
    
    container.style.position = 'relative';
    container.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 1000);
    
    // 添加闪烁动画
    if (!document.getElementById('sparkle-animation-style')) {
        const style = document.createElement('style');
        style.id = 'sparkle-animation-style';
        style.textContent = `
            @keyframes sparkleAnimation {
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

// Creeper 互动
const creeper = document.querySelector('.creeper');
if (creeper) {
    creeper.addEventListener('click', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'creepBounce 2s ease-in-out infinite';
        }, 10);
        
        // 创建爆炸效果
        createExplosionEffect(this);
    });
}

// 创建爆炸效果
function createExplosionEffect(element) {
    const explosionEmojis = ['💥', '💨', '✨', '⚡'];
    const rect = element.getBoundingClientRect();
    
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
    
    // 添加爆炸动画
    if (!document.getElementById('explosion-animation-style')) {
        const style = document.createElement('style');
        style.id = 'explosion-animation-style';
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

// 照片区域提示
const photoPlaceholder = document.querySelector('.photo-placeholder');
if (photoPlaceholder) {
    photoPlaceholder.addEventListener('click', function() {
        const messages = [
            '这里可以放宸乐的照片哦！📸',
            '期待看到可爱的宸乐！😊',
            '快来添加生日照片吧！🎈',
            '准备好最帅的照片！⭐'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const messageDisplay = document.getElementById('messageDisplay');
        
        if (messageDisplay) {
            messageDisplay.textContent = randomMessage;
            messageDisplay.classList.add('show');
        }
        
        // 添加点击波纹效果
        createRipple(this, event);
    });
}

// 创建波纹效果
function createRipple(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: rippleEffect 0.6s ease-out;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
    
    // 添加波纹动画
    if (!document.getElementById('ripple-animation-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-animation-style';
        style.textContent = `
            @keyframes rippleEffect {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 祝福卡片动画
const wishItems = document.querySelectorAll('.wish-item');
wishItems.forEach((item, index) => {
    item.style.animation = `slideIn 0.5s ease-out ${index * 0.1}s backwards`;
});

// 添加滑入动画
if (!document.getElementById('slide-in-style')) {
    const style = document.createElement('style');
    style.id = 'slide-in-style';
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// 添加滚动显示动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 观察所有主要区域
const sections = document.querySelectorAll('.photo-section, .info-cards, .interactive-section, .creeper-section, .wishes-section');
sections.forEach(section => {
    observer.observe(section);
});

// 添加淡入上移动画
if (!document.getElementById('fade-in-up-style')) {
    const style = document.createElement('style');
    style.id = 'fade-in-up-style';
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// 欢迎消息
console.log('%c🎉 生日快乐，刘宸乐！🎉', 'font-size: 30px; color: #FFD700; text-shadow: 2px 2px 4px #000;');
console.log('%c祝你5岁生日快乐，健康成长！', 'font-size: 18px; color: #4CAF50;');
console.log('%c探索我的世界，创造无限可能！', 'font-size: 16px; color: #2196F3;');
