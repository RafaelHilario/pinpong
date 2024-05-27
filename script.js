const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');
const message = document.getElementById('message');

// Adicionar a imagem de fundo
const backgroundImage = new Image();
backgroundImage.src = 'path_to_your_background_image.jpg'; // Substitua pelo caminho da sua imagem

// Adicionar sons
const hitWallSound = new Audio('hit_wall.mp3'); // Substitua pelo caminho do seu som de batida na parede
const hitPaddleSound = new Audio('hit_paddle.mp3'); // Substitua pelo caminho do seu som de batida na raquete

// Adicionar música de fundo
const backgroundMusic = new Audio('background_music.mp3'); // Substitua pelo caminho do seu som de música de fundo
backgroundMusic.loop = true; // Configurar para tocar em loop

const playerHeight = 100;
const playerWidth = 10;
const playerSpeed = 6;
const winningScore = 5;

const playerLeft = {
    x: 20,
    y: canvas.height / 2 - playerHeight / 2,
    width: playerWidth,
    height: playerHeight,
    dy: 0,
    score: 0
};

const playerRight = {
    x: canvas.width - 30,
    y: canvas.height / 2 - playerHeight / 2,
    width: playerWidth,
    height: playerHeight,
    dy: 0,
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: 4
};

function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = '20px Arial';
    context.fillText(text, x, y);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar a imagem de fundo
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    
    drawRect(playerLeft.x, playerLeft.y, playerLeft.width, playerLeft.height, 'white');
    drawRect(playerRight.x, playerRight.y, playerRight.width, playerRight.height, 'white');
    drawCircle(ball.x, ball.y, ball.radius, 'white');
    drawText(playerLeft.score, canvas.width / 4, 20, 'white');
    drawText(playerRight.score, 3 * canvas.width / 4, 20, 'white');
}

function update() {
    if (playerLeft.score >= winningScore) {
        message.innerText = 'Player 1 venceu!';
        backgroundMusic.pause(); // Pausar música quando o jogo termina
        return;
    } else if (playerRight.score >= winningScore) {
        message.innerText = 'Player 2 venceu!';
        backgroundMusic.pause(); // Pausar música quando o jogo termina
        return;
    }

    playerLeft.y += playerLeft.dy;
    playerRight.y += playerRight.dy;
    
    if (playerLeft.y < 0) {
        playerLeft.y = 0;
    } else if (playerLeft.y + playerLeft.height > canvas.height) {
        playerLeft.y = canvas.height - playerLeft.height;
    }
    
    if (playerRight.y < 0) {
        playerRight.y = 0;
    } else if (playerRight.y + playerRight.height > canvas.height) {
        playerRight.y = canvas.height - playerRight.height;
    }
    
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
        hitWallSound.play();
    }
    
    if (ball.x - ball.radius < playerLeft.x + playerLeft.width &&
        ball.y > playerLeft.y && ball.y < playerLeft.y + playerLeft.height) {
        ball.dx *= -1;
        hitPaddleSound.play();
    } else if (ball.x - ball.radius < 0) {
        playerRight.score++;
        resetBall();
    }
    
    if (ball.x + ball.radius > playerRight.x &&
        ball.y > playerRight.y && ball.y < playerRight.y + playerRight.height) {
        ball.dx *= -1;
        hitPaddleSound.play();
    } else if (ball.x + ball.radius > canvas.width) {
        playerLeft.score++;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4;
    ball.dy = 4;
}

function gameLoop() {
    update();
    draw();
    if (playerLeft.score < winningScore && playerRight.score < winningScore) {
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowUp':
            playerRight.dy = -playerSpeed;
            break;
        case 'ArrowDown':
            playerRight.dy = playerSpeed;
            break;
        case 'w':
            playerLeft.dy = -playerSpeed;
            break;
        case 's':
            playerLeft.dy = playerSpeed;
            break;
    }
});

document.addEventListener('keyup', function(e) {
    switch(e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            playerRight.dy = 0;
            break;
        case 'w':
        case 's':
            playerLeft.dy = 0;
            break;
    }
});

// Carregar a imagem de fundo e iniciar o jogo
backgroundImage.onload = function() {
    backgroundMusic.play(); // Iniciar música de fundo quando o jogo começa
    gameLoop();
}
