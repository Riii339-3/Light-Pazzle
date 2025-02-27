const board = document.getElementById("board");
const boardSize = 7;
let grid = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));

let startPositions = [];
let goalPositions = [];
let availableBlocks = [];

function createBoard() {
    board.innerHTML = "";
    grid = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));

    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.x = x;
            cell.dataset.y = y;
            board.appendChild(cell);
        }
    }

    generatePuzzle();
}

function generatePuzzle() {
    startPositions = [];
    goalPositions = [];
    let colors = ["red", "blue", "green"];

    colors.forEach((color) => {
        let startX = Math.floor(Math.random() * boardSize);
        let startY = Math.floor(Math.random() * boardSize);
        let goalX = Math.floor(Math.random() * boardSize);
        let goalY = Math.floor(Math.random() * boardSize);

        startPositions.push({ x: startX, y: startY, color });
        goalPositions.push({ x: goalX, y: goalY, color });

        let startCell = document.querySelector(`.cell[data-x="${startX}"][data-y="${startY}"]`);
        let goalCell = document.querySelector(`.cell[data-x="${goalX}"][data-y="${goalY}"]`);

        if (startCell) startCell.style.backgroundColor = color;
        if (goalCell) goalCell.classList.add("goal");
    });

    generateMirrors();
}

function generateMirrors() {
    let mirrorCount = Math.floor(Math.random() * 5) + 2;
    for (let i = 0; i < mirrorCount; i++) {
        let mirrorX = Math.floor(Math.random() * boardSize);
        let mirrorY = Math.floor(Math.random() * boardSize);

        if (!grid[mirrorY][mirrorX]) {
            grid[mirrorY][mirrorX] = "mirror";
            let mirrorCell = document.querySelector(`.cell[data-x="${mirrorX}"][data-y="${mirrorY}"]`);
            if (mirrorCell) mirrorCell.classList.add("mirror");
        }
    }
}

function animateLight(start, direction) {
    const directions = {
        right: { dx: 1, dy: 0 },
        left: { dx: -1, dy: 0 },
        up: { dx: 0, dy: -1 },
        down: { dx: 0, dy: 1 }
    };

    let x = start.x;
    let y = start.y;
    let dir = direction;
    let light = document.createElement("div");
    light.classList.add("light");
    document.body.appendChild(light);

    function moveLight() {
        if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
            light.remove();
            return;
        }

        let cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (!cell) {
            light.remove();
            return;
        }

        let rect = cell.getBoundingClientRect();
        light.style.transform = `translate(${rect.left + 20}px, ${rect.top + 20}px)`;

        if (grid[y][x] === "mirror") {
            showReflectEffect(x, y);
        }

        x += directions[dir].dx;
        y += directions[dir].dy;
        setTimeout(moveLight, 200);
    }

    moveLight();
}

function showReflectEffect(x, y) {
    let effect = document.createElement("div");
    effect.classList.add("reflect-effect");

    let cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
    if (!cell) return;

    let rect = cell.getBoundingClientRect();
    effect.style.left = `${rect.left}px`;
    effect.style.top = `${rect.top}px`;

    document.body.appendChild(effect);
    effect.style.opacity = 1;

    setTimeout(() => {
        effect.style.opacity = 0;
        setTimeout(() => effect.remove(), 300);
    }, 200);
}

function simulateLight() {
    startPositions.forEach(start => {
        animateLight(start, "right");
    });
}

document.getElementById("reset").addEventListener("click", createBoard);
createBoard();
