{/* <script> */}
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const bestElement = document.getElementById('best');
    const newGameButton = document.getElementById('new-game');

    let grid = [];
    let score = 0;
    let bestScore = 0;

    // Initialize the game board
    function initializeGame() {
      grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];

      score = 0;
      scoreElement.textContent = score;

      bestScore = localStorage.getItem('bestScore') || 0;
      bestElement.textContent = bestScore;

      // Add two random tiles
      addRandomTile();
      addRandomTile();

      renderGameBoard();
    }

    // Add a random tile to the game board
    function addRandomTile() {
      let emptyCells = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (grid[i][j] === 0) {
            emptyCells.push([i, j]);
          }
        }
      }

      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const [row, col] = emptyCells[randomIndex];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4;
      }
    }

    // Render the game board to the HTML
    function renderGameBoard() {
      gameBoard.innerHTML = '';

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const tile = document.createElement('div');
          tile.classList.add('tile');
          if (grid[i][j] !== 0) {
            tile.classList.add(grid[i][j].toString());
            tile.textContent = grid[i][j];
          }
          gameBoard.appendChild(tile);
        }
      }
    }

    // Move tiles to the left
    function moveLeft() {
      for (let i = 0; i < 4; i++) {
        let j = 0;
        while (j < 3) {
          if (grid[i][j] === 0) {
            let k = j + 1;
            while (k < 4 && grid[i][k] === 0) {
              k++;
            }
            if (k < 4) {
              grid[i][j] = grid[i][k];
              grid[i][k] = 0;
            }
          } else {
            if (grid[i][j] === grid[i][j + 1]) {
              grid[i][j] *= 2;
              score += grid[i][j];
              grid[i][j + 1] = 0;
            }
          }
          j++;
        }
      }
    }

    // Move tiles to the right
    function moveRight() {
      for (let i = 0; i < 4; i++) {
        let j = 3;
        while (j > 0) {
          if (grid[i][j] === 0) {
            let k = j - 1;
            while (k >= 0 && grid[i][k] === 0) {
              k--;
            }
            if (k >= 0) {
              grid[i][j] = grid[i][k];
              grid[i][k] = 0;
            }
          } else {
            if (grid[i][j] === grid[i][j - 1]) {
              grid[i][j] *= 2;
              score += grid[i][j];
              grid[i][j - 1] = 0;
            }
          }
          j--;
        }
      }
    }

    // Move tiles to the up
    function moveUp() {
      for (let j = 0; j < 4; j++) {
        let i = 0;
        while (i < 3) {
          if (grid[i][j] === 0) {
            let k = i + 1;
            while (k < 4 && grid[k][j] === 0) {
              k++;
            }
            if (k < 4) {
              grid[i][j] = grid[k][j];
              grid[k][j] = 0;
            }
          } else {
            if (grid[i][j] === grid[i + 1][j]) {
              grid[i][j] *= 2;
              score += grid[i][j];
              grid[i + 1][j] = 0;
            }
          }
          i++;
        }
      }
    }

    // Move tiles to the down
    function moveDown() {
      for (let j = 0; j < 4; j++) {
        let i = 3;
        while (i > 0) {
          if (grid[i][j] === 0) {
            let k = i - 1;
            while (k >= 0 && grid[k][j] === 0) {
              k--;
            }
            if (k >= 0) {
              grid[i][j] = grid[k][j];
              grid[k][j] = 0;
            }
          } else {
            if (grid[i][j] === grid[i - 1][j]) {
              grid[i][j] *= 2;
              score += grid[i][j];
              grid[i - 1][j] = 0;
            }
          }
          i--;
        }
      }
    }

    // Check if the game is over
    function isGameOver() {
      // Check if there are any empty cells
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (grid[i][j] === 0) {
            return false;
          }
        }
      }

      // Check if there are any adjacent tiles with the same value
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (i > 0 && grid[i][j] === grid[i - 1][j]) {
            return false;
          }
          if (i < 3 && grid[i][j] === grid[i + 1][j]) {
            return false;
          }
          if (j > 0 && grid[i][j] === grid[i][j - 1]) {
            return false;
          }
          if (j < 3 && grid[i][j] === grid[i][j + 1]) {
            return false;
          }
        }
      }

      // If no empty cells or adjacent tiles with the same value, the game is over
      return true;
    }

    // Handle keyboard input
    document.addEventListener('keydown', (event) => {
      if (isGameOver()) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowUp':
          moveUp();
          break;
        case 'ArrowDown':
          moveDown();
          break;
      }

      if (hasMoved()) {
        addRandomTile();
        renderGameBoard();
        if (isGameOver()) {
          alert('Game Over!');
        }
      }

      scoreElement.textContent = score;
      if (score > bestScore) {
        bestScore = score;
        bestElement.textContent = bestScore;
        localStorage.setItem('bestScore', bestScore);
      }
    });

    // Check if any tiles have moved
    function hasMoved() {
      let moved = false;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (grid[i][j] !== 0) {
            moved = true;
            break;
          }
        }
      }
      return moved;
    }

    // Start a new game
    newGameButton.addEventListener('click', () => {
      initializeGame();
    });

    // Initialize the game on page load
    initializeGame();
//   </script>

