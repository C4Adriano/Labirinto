import { COLUMNS, ctx, grid, ROWS, SIZE, TOTAL } from "./lab.js"

/**
 * @returns {[number, number]}
 */
function ask() {
    const LIMIT = ROWS * COLUMNS
    while (true) {
        const [s, g] = [
            Number(prompt(`Início\n(Obs.: Deve ser um número inteiro, maior ou igual a zero, menor que o limite (${LIMIT}) e diferente do fim; ou seja: 0 ≤ i < ${LIMIT} / i ≠ f)`) ?? ""),
            Number(prompt(`Fim\n(Obs.: Deve ser um número inteiro, maior ou igual a zero, menor que o limite (${LIMIT}) e diferente do início; ou seja: 0 ≤ f < ${LIMIT} / f ≠ i)`) ?? ""),
        ]

        if (s >= 0 && s < LIMIT && g >= 0 && g < LIMIT && s !== g) return [s, g]
    }
}

const [START, GOAL] = ask(),
    PATH_COLOR = "red",
    MARKER_SIZE = 6,
    /** @type {number[]} */ distances = new Array(TOTAL).fill(Infinity),
    /** @type {boolean[]} */ visited = new Array(TOTAL).fill(false),
    /** @type {number[]} */ previous = new Array(TOTAL).fill(-1)

distances[START] = 0

/**
 * @param {number} index
 * @returns {number[]}
 */
function getNeighbors(index) {
    const { walls } = grid[index],
        /** @type {number[]} */ neighbors = []

    if (!walls[0] && index >= COLUMNS) neighbors.push(index - COLUMNS)
    if (!walls[1] && (index + 1) % COLUMNS !== 0) neighbors.push(index + 1)
    if (!walls[2] && index < TOTAL - COLUMNS) neighbors.push(index + COLUMNS)
    if (!walls[3] && index % COLUMNS !== 0) neighbors.push(index - 1)

    return neighbors
}

/**
 * @returns {number}
 */
function findNearest() {
    let nearest = Infinity,
        found = -1

    for (let index = 0; index < TOTAL; index++)
        if (!visited[index] && distances[index] < nearest) {
            nearest = distances[index]
            found = index
        }

    return found
}

function explore() {
    while (true) {
        const current = findNearest()

        if (current === -1 || current === GOAL) return

        visited[current] = true

        for (const neighbor of getNeighbors(current)) {
            if (visited[neighbor]) continue

            const distance = distances[current] + 1

            if (distance < distances[neighbor]) {
                distances[neighbor] = distance
                previous[neighbor] = current
            }
        }
    }
}

/**
 * @returns {number[]}
 */
function reconstructPath() {
    const /** @type {number[]} */ path = []

    let current = GOAL

    while (current !== -1) {
        path.unshift(current)
        current = previous[current]
    }

    if (path[0] !== START) return []

    return path
}

/**
 * @param {number} index
 * @returns {{ x: number, y: number }}
 */
function getCellCenter(index) {
    return { x: (index % COLUMNS) * SIZE + SIZE / 2, y: Math.floor(index / COLUMNS) * SIZE + SIZE / 2 }
}

/**
 * @param {number[]} path
 */
function drawPath(path) {
    if (path.length === 0) return

    ctx.beginPath()
    ctx.strokeStyle = PATH_COLOR
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    for (let index = 0; index < path.length; index++) {
        const { x: _x, y: _y } = getCellCenter(path[index])

        index === 0 ? ctx.moveTo(_x, _y) : ctx.lineTo(_x, _y)
    }

    ctx.stroke()

    const { x, y } = getCellCenter(START),
        markerOffset = MARKER_SIZE / 2

    ctx.fillStyle = PATH_COLOR
    ctx.fillRect(x - markerOffset, y - markerOffset, MARKER_SIZE, MARKER_SIZE)
}

explore()
drawPath(reconstructPath())
