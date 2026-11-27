/** @typedef {{ visited: boolean, block: boolean[], id: number }} Cell */

export const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas")),
    ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d")),
    ROWS = 20,
    COLUMNS = 20,
    BLOCK_SIZE = 20,
    EXTRA_PERCENT = 0.0,
    AREA = ROWS * COLUMNS,
    /** @type {number[][]} */ OFFSETS = [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
    ],
    /** @type {Cell[]} */ grid = []
for (let id = 0; id < AREA; id++) grid.push({ visited: false, block: [true, true, true, true], id })

/**
 * @param {number} cell
 * @param {number} direction
 * @returns {number}
 */
function neighborOf(cell, direction) {
    const x = (cell % COLUMNS) + OFFSETS[direction][0],
        y = Math.floor(cell / COLUMNS) + OFFSETS[direction][1]

    if (x < 0 || x >= COLUMNS || y < 0 || y >= ROWS) return -1

    return y * COLUMNS + x
}

const /** @type {number[]} */ stack = []

let current = 0,
    visitedCount = 1

grid[current].visited = true

while (visitedCount < AREA) {
    /** @type {number[]} */
    const options = []

    for (let direction = 0; direction < 4; direction++) {
        const neighbor = neighborOf(current, direction)
        if (neighbor !== -1 && !grid[neighbor].visited) options.push(direction)
    }

    if (options.length > 0) {
        stack.push(current)

        const direction = options[Math.floor(Math.random() * options.length)],
            neighbor = neighborOf(current, direction)

        grid[current].block[direction] = false
        grid[neighbor].block[(direction + 2) % 4] = false

        current = neighbor

        grid[current].visited = true
        visitedCount++
    } else current = /** @type {number} */ (stack.pop())
}

for (let left = Math.round(EXTRA_PERCENT * AREA); left > 0; left--) {
    const cell = Math.floor(Math.random() * AREA),
        direction = Math.floor(Math.random() * 4),
        neighbor = neighborOf(cell, direction)

    if (neighbor !== -1) {
        grid[cell].block[direction] = true
        grid[neighbor].block[(direction + 2) % 4] = true
    }
}

/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1 + 1, y1 + 1)
    ctx.lineTo(x2 + 1, y2 + 1)
    ctx.stroke()
}

ctx.clearRect(0, 0, canvas.width, canvas.height)
ctx.strokeStyle = "black"

for (let cell = 0; cell < AREA; cell++) {
    const x = (cell % COLUMNS) * BLOCK_SIZE,
        y = Math.floor(cell / COLUMNS) * BLOCK_SIZE,
        { block: walls } = grid[cell]

    if (walls[0]) drawLine(x, y, x + BLOCK_SIZE, y)
    if (walls[1]) drawLine(x + BLOCK_SIZE, y, x + BLOCK_SIZE, y + BLOCK_SIZE)
    if (walls[2]) drawLine(x + BLOCK_SIZE, y + BLOCK_SIZE, x, y + BLOCK_SIZE)
    if (walls[3]) drawLine(x, y + BLOCK_SIZE, x, y)
}
