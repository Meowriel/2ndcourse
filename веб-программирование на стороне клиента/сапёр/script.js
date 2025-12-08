const W = 12, H = 12, BOMBS = 20;

let board = document.getElementById("game-board");
let msg = document.getElementById("message");
let reset = document.getElementById("reset-button");
let timerEl = document.getElementById("timer");

let grid = [], first = true, over = false, win = false;
let cursor = { x: 0, y: 0 }, useKeys = false, showCursor = false;

let timer = 0;
let timerInterval = null;
let flagsLeft = BOMBS; // Счётчик оставшихся флажков

function startTimer() {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
        timer++;
        updateTimer();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function updateTimer() {
    timerEl.textContent = `Time: ${timer} | Flags: ${flagsLeft}`;
}

function createGrid() {
    board.innerHTML = "";
    grid = []; first = true; over = false; win = false;
    msg.textContent = ""; showCursor = false;

    stopTimer();
    timer = 0;
    flagsLeft = BOMBS;
    updateTimer();

    for (let y = 0; y < H; y++) {
        grid.push([]);
        for (let x = 0; x < W; x++) {
            let el = document.createElement("div");
            el.className = "cell";
            el.dataset.x = x; el.dataset.y = y;
            el.onclick = cellClick;
            el.oncontextmenu = rightClick;
            board.appendChild(el);

            grid[y].push({ x, y, el, isBomb: false, open: false, flag: false, n: 0 });
        }
    }
}

function placeBombs(cx, cy) {
    let b = 0;
    while (b < BOMBS) {
        let x = Math.random() * W | 0, y = Math.random() * H | 0;
        if ((x !== cx || y !== cy) && !grid[y][x].isBomb) {
            grid[y][x].isBomb = true; b++;
        }
    }
}

function countBombs() {
    for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++)
            if (!grid[y][x].isBomb) {
                let c = 0;
                for (let yy = -1; yy <= 1; yy++)
                    for (let xx = -1; xx <= 1; xx++) {
                        let nx = x + xx, ny = y + yy;
                        if (nx >= 0 && nx < W && ny >= 0 && ny < H && grid[ny][nx].isBomb) c++;
                    }
                grid[y][x].n = c;
            }
}

function open(x, y) {
    let c = grid[y][x];
    if (c.open || c.flag || over) return;

    if (first) { 
        placeBombs(x, y); 
        countBombs(); 
        first = false;
        startTimer();
    }

    c.open = true;
    c.el.classList.add("open");

    if (c.isBomb) {
        c.el.textContent = "💣";
        msg.textContent = "Вы продули! :)";
        over = true;
        stopTimer();
        revealBombs();
        return;
    }

    if (c.n) c.el.textContent = c.n;
    else {
        for (let yy = -1; yy <= 1; yy++)
            for (let xx = -1; xx <= 1; xx++) {
                let nx = x + xx, ny = y + yy;
                if (nx >= 0 && nx < W && ny >= 0 && ny < H) open(nx, ny);
            }
    }
    checkWin();
}

function revealBombs() {
    grid.flat().forEach(c => {
        if (c.isBomb) {
            c.el.textContent = "💣";
            c.el.classList.add("bomb");
        }
    });
}

function toggleFlag(x, y) {
    let c = grid[y][x];
    if (c.open || over) return;
    c.flag = !c.flag;
    c.el.textContent = c.flag ? "🚩" : "";

    // Обновляем счётчик оставшихся флажков
    flagsLeft += c.flag ? -1 : 1;
    updateTimer();
}

function checkWin() {
    if (grid.flat().every(c => c.open || c.isBomb)) {
        win = true;
        msg.textContent = "ЕЕЕ Вы победили! Ваше время: " + timer;
        revealBombs();
        stopTimer();
    }
}

function cellClick(e) {
    let x = +e.target.dataset.x, y = +e.target.dataset.y;
    showCursor = false;
    open(x, y);
}

function rightClick(e) {
    e.preventDefault();
    let x = +e.target.dataset.x, y = +e.target.dataset.y;
    toggleFlag(x, y);
}

function key(e) {
    if (over || win) return;

    useKeys = true; showCursor = true;

    if (e.key === "ArrowUp") cursor.y = Math.max(0, cursor.y - 1);
    if (e.key === "ArrowDown") cursor.y = Math.min(H - 1, cursor.y + 1);
    if (e.key === "ArrowLeft") cursor.x = Math.max(0, cursor.x - 1);
    if (e.key === "ArrowRight") cursor.x = Math.min(W - 1, cursor.x + 1);

    if (e.key === "Enter" || e.key === " ") {
        e.ctrlKey ? toggleFlag(cursor.x, cursor.y) : open(cursor.x, cursor.y);
    }

    updateCursor();
}

function updateCursor() {
    grid.flat().forEach(c => c.el.classList.remove("cursor"));
    if (showCursor && !over)
        grid[cursor.y][cursor.x].el.classList.add("cursor");
}

reset.onclick = createGrid;
document.addEventListener("keydown", key);

createGrid();
