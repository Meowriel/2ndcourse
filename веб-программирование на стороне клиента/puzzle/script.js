const COLS = 9;
const ROWS = 6;

let draggedPiece = null;


function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function createField() {
  const field = document.getElementById("field");

  for (let i = 0; i < COLS * ROWS; i++) {
    const cell = document.createElement("div");

    //дропаем
    cell.addEventListener("dragover", e => e.preventDefault());

    cell.addEventListener("drop", () => {
      if (draggedPiece && cell.children.length === 0) {
        cell.appendChild(draggedPiece);
        draggedPiece = null;
      }
    });

    field.appendChild(cell);
  }
}

// ваши кусочки. кусочки вас :D
function createPieces() {
  const pieces = document.getElementById("pieces");

  let indices = [];
  for (let i = 0; i < COLS * ROWS; i++) indices.push(i);
  shuffle(indices);

  indices.forEach(i => {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.draggable = true;

    const row = Math.floor(i / COLS);
    const col = i % COLS;
    piece.style.backgroundPosition = `${-50 * col}px ${-50 * row}px`;

    piece.addEventListener("dragstart", () => {
      draggedPiece = piece;
    });

    pieces.appendChild(piece);
  });
}


createPieces();
createField();
