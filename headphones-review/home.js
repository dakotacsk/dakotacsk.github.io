// Waveform Animation
function initWaveform() {
    const canvas = document.getElementById('waveform');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Waveform parameters
    const bars = 64;
    const barWidth = width / bars;
    const barGap = 2;
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < bars; i++) {
            const barHeight = Math.random() * (height * 0.8) + (height * 0.1);
            const x = i * barWidth;
            const y = (height - barHeight) / 2;
            
            ctx.fillStyle = '#1C1C1C';
            ctx.fillRect(x + barGap / 2, y, barWidth - barGap, barHeight);
        }
        
        setTimeout(() => requestAnimationFrame(animate), 100);
    }
    
    animate();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initWaveform);

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initWaveform, 250);
});