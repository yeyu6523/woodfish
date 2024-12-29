function loadAudio() {
    return new Promise((resolve, reject) => {
        knockSound.src = './assets/knock.mp3';
        fireworksSound.src = './assets/fireworks.mp3';
        
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