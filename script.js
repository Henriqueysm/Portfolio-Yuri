const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const startBtn = document.querySelector('#start-btn');
const scoreDisplay = document.querySelector('#score');
const bestScoreDisplay = document.querySelector('#best-score');

let isJumping = false;
let gameRunning = false;
let score = 0;
let gameLoop;
let scoreTimer;
let jumpCheckInterval;
let jumpTimeout;
let scores = JSON.parse(localStorage.getItem('marioScores')) || [];

// Carregar melhor score ao iniciar
const loadBestScore = () => {
    if (scores.length > 0) {
        const bestScore = Math.max(...scores);
        bestScoreDisplay.textContent = bestScore + 's';
    }
}

const jump = (event) => {
    if (event.code === 'Space' && !isJumping && gameRunning) {
        event.preventDefault();
        isJumping = true;
        mario.classList.add('jump');

        // Verificar colisão durante o pulo (a cada 50ms)
        jumpCheckInterval = setInterval(() => {
            const pipePosition = pipe.offsetLeft;
            const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
            const marioRect = mario.getBoundingClientRect();
            const gameboardRect = document.querySelector('.game-board').getBoundingClientRect();
            
            // Posição de Mario relativa ao gameBoard
            const marioLeftRelative = marioRect.left - gameboardRect.left;

            if (pipePosition < 120 && pipePosition > 0 && marioPosition < 80) {
                clearInterval(jumpCheckInterval);
                clearTimeout(jumpTimeout);
                
                // Congelar Mario no exato lugar da colisão
                mario.classList.remove('jump');
                mario.style.animation = 'none';
                mario.style.bottom = `${marioPosition}px`;
                mario.style.left = `${marioLeftRelative}px`;
                mario.style.marginLeft = '0px';
                mario.style.width = '75px';
                mario.src = './imagens/game-over.png';
                
                isJumping = false;
                endGame();
            }
        }, 50);

        jumpTimeout = setTimeout(() => {
            clearInterval(jumpCheckInterval);
            if (gameRunning) {
                mario.classList.remove('jump');
                isJumping = false;
            }
        }, 500);
    }
}

const startGame = () => {
    // Limpar tudo antes de reiniciar
    clearInterval(gameLoop);
    clearInterval(scoreTimer);
    
    // Reset do jogo
    gameRunning = true;
    isJumping = false;
    score = 0;
    scoreDisplay.textContent = '0';
    startBtn.disabled = true;
    
    // Reset completo do Mario
    mario.classList.remove('jump');
    mario.src = './imagens/mario.gif';
    mario.style.width = '150px';
    mario.style.marginLeft = '40px';
    mario.style.animation = '';
    mario.style.left = '';
    mario.style.right = '';
    mario.style.bottom = '0px';
    mario.style.position = 'absolute';
    mario.style.zIndex = 'auto';
    
    // Reset do pipe - remove todas as propriedades inline
    pipe.style.animation = 'none';
    pipe.style.left = '';
    pipe.style.right = '';
    
    // Force reflow para reiniciar a animação
    pipe.offsetHeight;
    
    pipe.style.animation = 'piper-animation 1.5s infinite linear';

    // Inicia o cronômetro
    scoreTimer = setInterval(() => {
        if (gameRunning) {
            score++;
            scoreDisplay.textContent = score;
        }
    }, 1000);

    // Inicia o loop de colisão
    gameLoop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

        if (pipePosition < 120 && pipePosition > 0 && marioPosition < 80) {
            endGame();
        }
    }, 10);
}

const endGame = () => {
    gameRunning = false;
    clearTimeout(jumpTimeout);
    clearInterval(jumpCheckInterval);
    
    // Salvar score
    scores.push(score);
    localStorage.setItem('marioScores', JSON.stringify(scores));
    loadBestScore();
    
    pipe.style.animation = 'none';
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    const marioRect = mario.getBoundingClientRect();
    const gameboardRect = document.querySelector('.game-board').getBoundingClientRect();
    const marioLeftRelative = marioRect.left - gameboardRect.left;
    
    pipe.style.left = `${pipePosition}px`;
    mario.classList.remove('jump');
    mario.style.animation = 'none';
    mario.style.left = `${marioLeftRelative}px`;
    mario.style.marginLeft = '40px';
    mario.style.bottom = `${marioPosition}px`;
    mario.src = './imagens/game-over.png';
    mario.style.width = '75px';
    mario.style.position = 'absolute';
    mario.style.zIndex = '100';

    clearInterval(gameLoop);
    clearInterval(scoreTimer);
    startBtn.disabled = false;
    
    alert(`Game Over! Você durou ${score} segundos!`);
}

startBtn.addEventListener('click', startGame);
document.addEventListener('keydown', jump);

// Carregar melhor score ao iniciar a página
loadBestScore();