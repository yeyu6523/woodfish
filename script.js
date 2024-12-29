let meritCount = 0;
let secondsWasted = 0;
const knockSound = new Audio();
const fireworksSound = new Audio();

function loadAudio() {
    return new Promise((resolve, reject) => {
        knockSound.src = 'assets/knock.mp3';
        fireworksSound.src = 'assets/fireworks.mp3';
        
        let loadedCount = 0;
        const totalAudio = 2;
        
        function onAudioLoad() {
            loadedCount++;
            if (loadedCount === totalAudio) {
                resolve();
            }
        }

        knockSound.oncanplaythrough = onAudioLoad;
        fireworksSound.oncanplaythrough = onAudioLoad;
        
        knockSound.onerror = (e) => {
            console.error('木鱼音效加载失败', e);
            reject(e);
        };
        
        fireworksSound.onerror = (e) => {
            console.error('烟花音效加载失败', e);
            reject(e);
        };
    });
}

// 在页面加载时初始化音频
window.addEventListener('load', async function() {
    try {
        await loadAudio();
        hideLoadingScreen();
    } catch (error) {
        document.getElementById('loading-progress').textContent = '资源加载失败，请刷新页面重试';
    }
});

window.addEventListener('load', function() {
    // 检查图片加载
    const woodfishImg = document.getElementById('woodfish');
    woodfishImg.onerror = function() {
        console.error('木鱼图片加载失败');
        this.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22200%22 height%3D%22200%22%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 fill%3D%22%23ddd%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22%3E木鱼图片加载失败%3C%2Ftext%3E%3C%2Fsvg%3E';
    };

    // 检查视频加载
    const video = document.getElementById('reward-video');
    video.onerror = function() {
        console.error('视频加载失败');
        // 添加视频加载失败的提示
        const errorMsg = document.createElement('div');
        errorMsg.style.color = 'white';
        errorMsg.style.padding = '20px';
        errorMsg.textContent = '视频加载失败，请检查视频文件';
        video.parentNode.appendChild(errorMsg);
    };
});

document.getElementById('woodfish').addEventListener('click', function(e) {
    // 播放敲击音效
    knockSound.currentTime = 0;
    knockSound.play();
    
    // 增加功德计数
    meritCount++;
    document.getElementById('merit').textContent = meritCount;
    
    // 增加浪费时间
    secondsWasted++;
    document.getElementById('seconds').textContent = secondsWasted;
    
    // 创建烟花效果
    createFirework();
    
    // 创建点击涟漪效果
    createRipple(e);
    
    // 创建功德弹出动画
    createMeritPopup(e);
    
    // 检查是否达到10次
    if (meritCount === 10) {
        showRewardVideo();
    }
});

function createFirework() {
    const firework = document.createElement('div');
    firework.className = 'firework';
    
    // 随机位置
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    firework.style.left = x + 'px';
    firework.style.top = y + 'px';
    
    document.getElementById('fireworks-container').appendChild(firework);
    
    // 播放烟花音效
    fireworksSound.currentTime = 0;
    fireworksSound.play();
    
    // 移除烟花元素
    setTimeout(() => {
        firework.remove();
    }, 1000);
}

function createRipple(e) {
    const woodfish = document.getElementById('woodfish');
    const rect = woodfish.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    woodfish.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function createMeritPopup(e) {
    const popup = document.createElement('div');
    popup.className = 'merit-popup';
    popup.textContent = '+1';
    
    const rect = e.target.getBoundingClientRect();
    popup.style.left = (e.clientX - rect.left) + 'px';
    popup.style.top = (e.clientY - rect.top) + 'px';
    
    document.getElementById('woodfish-container').appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 1000);
}

function showRewardVideo() {
    // 隐藏木鱼和计数器
    document.getElementById('woodfish-container').style.display = 'none';
    document.getElementById('merit-counter').style.display = 'none';
    document.getElementById('time-wasted').style.display = 'none';
    
    // 显示视频容器
    const videoContainer = document.getElementById('video-container');
    const video = document.getElementById('reward-video');
    videoContainer.style.display = 'flex';
    
    // 确保视频从头开始播放
    video.currentTime = 0;
    
    // 尝试播放视频
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // 自动播放成功
            console.log('视频开始播放');
        })
        .catch(error => {
            // 自动播放被阻止
            console.log('视频自动播放被阻止，请点击视频播放');
        });
    }
    
    // 视频播放结束后重置页面
    video.onended = function() {
        videoContainer.style.display = 'none';
        document.getElementById('woodfish-container').style.display = 'block';
        document.getElementById('merit-counter').style.display = 'block';
        document.getElementById('time-wasted').style.display = 'block';
        meritCount = 0;
        secondsWasted = 0;
        document.getElementById('merit').textContent = meritCount;
        document.getElementById('seconds').textContent = secondsWasted;
    };
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transition = 'opacity 0.5s';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
} 