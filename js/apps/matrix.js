/**
 * Matrix Effect - Canvas-based Digital Rain
 */

let matrixAnimationId = null;

export function startMatrixEffect() {
    const terminalBody = document.querySelector('#terminal-window .terminal-body');
    if (!terminalBody) return;

    terminalBody.classList.add('matrix-mode');

    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-canvas';
    terminalBody.appendChild(canvas);

    const hint = document.createElement('div');
    hint.className = 'matrix-exit-hint';
    hint.textContent = 'Press any key to exit';
    terminalBody.appendChild(hint);

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = terminalBody.offsetWidth;
        canvas.height = terminalBody.offsetHeight;
    }
    resizeCanvas();

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0f0';
        ctx.font = `${fontSize}px Ubuntu Mono, monospace`;

        for (let i = 0; i < drops.length; i++) {
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        matrixAnimationId = requestAnimationFrame(draw);
    }

    draw();

    function exitMatrix(e) {
        if (matrixAnimationId) {
            cancelAnimationFrame(matrixAnimationId);
            matrixAnimationId = null;
        }
        canvas.remove();
        hint.remove();
        terminalBody.classList.remove('matrix-mode');
        document.removeEventListener('keydown', exitMatrix);
        
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) terminalInput.focus();
    }

    setTimeout(() => {
        document.addEventListener('keydown', exitMatrix);
    }, 100);
}

export default { startMatrixEffect };
