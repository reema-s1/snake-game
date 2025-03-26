document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const booText = document.getElementById("boo");
    const okDivaText = document.getElementById("okDiva");

    const grid = 20; //snake size
    let snake = [{ x: 200, y: 200 }]; //start pos
    let dx = 0, dy = 0; // movement
    let food = { x: 0, y: 0 }; //food pos
    let score = 0;
    let gameInterval;

    function drawSnake() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height); 

        ctx.fillStyle = "#FFB6C1"; //snake
        snake.forEach(segment => ctx.fillRect(segment.x, segment.y, grid, grid));

        // draw food
        ctx.fillStyle = "#90EE90"; 
        ctx.fillRect(food.x, food.y, grid, grid);
    }

    function moveSnake() {
        let head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // Check if food is eaten
        if (head.x === food.x && head.y === food.y) {
            score++;
            document.getElementById("score").textContent = "Score: " + score;
            placeFood();

//positive reinforcement
            if (score % 10 === 0) {
                showOkDiva();
            }
        } else {
            snake.pop();
        }

        checkCollision();
    }

    function placeFood() {
        food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
        food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
    }

    function checkCollision() {
        //if snake hits walls
        if (snake[0].x < 0 || snake[0].y < 0 || snake[0].x >= canvas.width || snake[0].y >= canvas.height) {
            triggerBOO();
            return;
        }
        //if snake collides with itself
        for (let i = 1; i < snake.length; i++) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
                triggerBOO();
                return;
            }
        }
    }

    function triggerBOO() {
        clearInterval(gameInterval);
        gameInterval = null;

        let flashCount = 0;
        const flashInterval = setInterval(() => {
            booText.style.display = flashCount % 2 === 0 ? "block" : "none";
            flashCount++;

            if (flashCount > 5) {
                clearInterval(flashInterval);
                resetGame();
            }
        }, 300);
    }

    function showOkDiva() {
        okDivaText.style.display = "block";
        setTimeout(() => {
            okDivaText.style.display = "none";
        }, 1500);
    }

    function resetGame() {
        booText.style.display = "none";
        snake = [{ x: 200, y: 200 }];
        dx = 0;
        dy = 0;
        score = 0;
        document.getElementById("score").textContent = "Score: 0";
        placeFood();
        drawSnake();
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowUp" && dy === 0) {
            dx = 0;
            dy = -grid;
        } else if (event.key === "ArrowDown" && dy === 0) {
            dx = 0;
            dy = grid;
        } else if (event.key === "ArrowLeft" && dx === 0) {
            dx = -grid;
            dy = 0;
        } else if (event.key === "ArrowRight" && dx === 0) {
            dx = grid;
            dy = 0;
        }
        if (!gameInterval) {
            gameInterval = setInterval(updateGame, 100);
        }
    });

    function updateGame() {
        moveSnake();
        drawSnake();
    }

    placeFood();
    drawSnake();
});
