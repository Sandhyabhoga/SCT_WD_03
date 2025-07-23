const board = document.getElementById('board');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

let currentPlayer = 'X';
let gameActive = true;
let cells = ['', '', '', '', '', '', '', '', ''];

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8], 
  [0,3,6], [1,4,7], [2,5,8], 
  [0,4,8], [2,4,6]           
];

function initBoard() {
  board.innerHTML = '';
  cells = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
  statusText.classList.remove('win');
  stopConfetti();

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (cells[index] || !gameActive) return;

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin()) {
    statusText.textContent = `🎉 Player ${currentPlayer} Wins!`;
    statusText.classList.add('win');
    highlightWin();
    triggerConfetti();
    gameActive = false;
  } else if (!cells.includes('')) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function checkWin() {
  return winningCombos.some(combo =>
    combo.every(index => cells[index] === currentPlayer)
  );
}

function highlightWin() {
  winningCombos.forEach(combo => {
    if (combo.every(index => cells[index] === currentPlayer)) {
      combo.forEach(index => {
        board.children[index].classList.add('win');
      });
    }
  });
}

resetBtn.addEventListener('click', initBoard);

// 🎉 Confetti Animation
let confettiCanvas, confettiCtx, confettiPieces = [], animationFrameId;

function triggerConfetti() {
  confettiCanvas = document.getElementById('confetti-canvas');
  confettiCtx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  confettiPieces = Array.from({ length: 150 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height - confettiCanvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 40 + 10,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    tilt: Math.random() * 10 - 10,
    tiltAngle: 0,
    tiltAngleIncrement: Math.random() * 0.08 + 0.02
  }));

  function drawConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(p => {
      p.tiltAngle += p.tiltAngleIncrement;
      p.y += Math.cos(p.d / 10);
      p.x += Math.sin(p.d / 10);
      p.tilt = Math.sin(p.tiltAngle) * 15;

      confettiCtx.beginPath();
      confettiCtx.lineWidth = p.r;
      confettiCtx.strokeStyle = p.color;
      confettiCtx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
      confettiCtx.stroke();
    });

    animationFrameId = requestAnimationFrame(drawConfetti);
  }

  drawConfetti();
}

function stopConfetti() {
  cancelAnimationFrame(animationFrameId);
  if (confettiCtx) confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

initBoard();
