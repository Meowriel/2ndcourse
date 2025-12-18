const W = 12, H = 12, BOMBS = 20;

// DOM
let board = document.getElementById("game-board");
let msg = document.getElementById("message");
let reset = document.getElementById("reset-button");
let timerEl = document.getElementById("timer");

// состояние
let grid = [];
let first = true, over = false, win = false;

let timer = 0;
let timerInterval = null;
let flagsLeft = BOMBS;
let moves = 0;

// события
document.addEventListener("mine.start", (e) => {
    const { x, y } = e.detail;
    placeBombs(x, y);
    countBombs();
    first = false;

    startTimer();
    msg.textContent = "Игра началась!";
});

document.addEventListener("mine.step", () => {
    moves++;
    updateTimer();
});

document.addEventListener("mine.flag", () => {
    updateTimer();
});

document.addEventListener("mine.end", (e) => {
    const d = e.detail;
    stopTimer();
    over = true;

    if (d.result === "win") {
        win = true;
        msg.textContent = `Победа! Время: ${d.time}s, Ходов: ${d.moves}`;
    } else {
        msg.textContent = `Поражение! Мина на (${d.x}, ${d.y})`;
        revealBombs();
    }
});

// обработчик комбо
document.addEventListener("mine.combo", (e) => {
    const { opened } = e.detail;

    msg.innerHTML = `<span class="combo">Комбо! +${opened} клеток</span>`;
});

// таймер
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
    timerEl.textContent = `Time: ${timer} | Flags: ${flagsLeft} | Moves: ${moves}`;
}

// генерация игрового поля
function createGrid() {
    board.innerHTML = "";
    grid = [];
    first = true;
    win = false;
    over = false;

    stopTimer();
    timer = 0;
    flagsLeft = BOMBS;
    moves = 0;
    updateTimer();
    msg.textContent = "";

    for (let y = 0; y < H; y++) {
        grid.push([]);
        for (let x = 0; x < W; x++) {
            const el = document.createElement("div");
            el.className = "cell";
            el.dataset.x = x;
            el.dataset.y = y;
            el.onclick = cellClick;
            el.oncontextmenu = rightClick;

            board.appendChild(el);
            grid[y].push({ x, y, el, isBomb: false, open: false, flag: false, n: 0 });
        }
    }
}

// генерация бомб
function placeBombs(cx, cy) {
    let b = 0;
    while (b < BOMBS) {
        const x = Math.random() * W | 0;
        const y = Math.random() * H | 0;

        if ((x !== cx || y !== cy) && !grid[y][x].isBomb) {
            grid[y][x].isBomb = true;
            b++;
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
                        const nx = x + xx, ny = y + yy;
                        if (nx >= 0 && nx < W && ny >= 0 && ny < H && grid[ny][nx].isBomb) c++;
                    }
                grid[y][x].n = c;
            }
}

// ОТКРЫТИЕ КЛЕТКИ + подсчёт комбо
function open(x, y) {
    let openedNow = 0;

    function dfs(x, y) {
        const c = grid[y][x];
        if (c.open || c.flag || over) return;
        c.open = true;
        openedNow++;

        c.el.classList.add("open");

        if (c.isBomb) {
            c.el.textContent = "💣";
            document.dispatchEvent(new CustomEvent("mine.end", {
                detail: { result: "loss", time: timer, moves, x, y }
            }));
            return;
        }

        if (c.n) {
            c.el.textContent = c.n;
        } else {
            for (let yy = -1; yy <= 1; yy++)
                for (let xx = -1; xx <= 1; xx++) {
                    const nx = x + xx, ny = y + yy;
                    if (nx >= 0 && nx < W && ny >= 0 && ny < H) dfs(nx, ny);
                }
        }
    }

    dfs(x, y);

    if (openedNow >= 10) {
        document.dispatchEvent(new CustomEvent("mine.combo", {
            detail: { opened: openedNow }
        }));
    }

    checkWin();
}

// показать все бомбы
function revealBombs() {
    grid.flat().forEach(c => {
        if (c.isBomb) {
            c.el.textContent = "💣";
            c.el.classList.add("bomb");
        }
    });
}

// флаги
function toggleFlag(x, y) {
    let c = grid[y][x];
    if (c.open || over) return;

    c.flag = !c.flag;
    c.el.textContent = c.flag ? "🚩" : "";
    c.el.classList.toggle("flagged");

    flagsLeft += c.flag ? -1 : 1;

    document.dispatchEvent(new CustomEvent("mine.flag", {
        detail: { x, y, flagsLeft }
    }));
}

// победа
function checkWin() {
    if (grid.flat().every(c => c.open || c.isBomb)) {
        document.dispatchEvent(new CustomEvent("mine.end", {
            detail: { result: "win", time: timer, moves, flagsLeft }
        }));
    }
}

// обработчики кликов
function cellClick(e) {
    const x = +e.target.dataset.x;
    const y = +e.target.dataset.y;

    if (first)
        document.dispatchEvent(new CustomEvent("mine.start", { detail: { x, y } }));

    document.dispatchEvent(new CustomEvent("mine.step", { detail: { x, y } }));
    open(x, y);
}

function rightClick(e) {
    e.preventDefault();
    toggleFlag(+e.target.dataset.x, +e.target.dataset.y);
}

// init
reset.onclick = createGrid;
createGrid();
