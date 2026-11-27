import { AREA, BLOCK_SIZE, COLUMNS, ctx, grid } from "./lab.js"

/**
 * @returns {[number, number]}
 */
function ask() {
    while (true) {
        const [s, f] = [
            parseInt(prompt(`Início\n(Obs.: Deve ser um número inteiro, maior ou igual a zero, menor que o limite (${AREA}) e diferente do fim; ou seja: 0 ≤ i < ${AREA} / i ≠ f)`) ?? ""),
            parseInt(prompt(`Fim\n(Obs.: Deve ser um número inteiro, maior ou igual a zero, menor que o limite (${AREA}) e diferente do início; ou seja: 0 ≤ f < ${AREA} / f ≠ i)`) ?? ""),
        ]

        if (s >= 0 && s < AREA && f >= 0 && f < AREA && s !== f) return [s, f]
    }
}

const [START, FINAL] = ask(),
    color = "red",
    pointSize = 6,
    /** @type {number[]} */ distances = new Array(AREA).fill(Infinity),
    /** @type {boolean[]} */ visited = new Array(AREA).fill(false),
    /** @type {number[]} */ previous = new Array(AREA).fill(-1)

distances[START] = 0

/**
 * Pegar os lados
 * @param {number} i
 * @returns {number[]}
 */
function getSided(i) {
    const { block } = grid[i],
        /** @type {number[]} */ sided = []

    if (!block[0] && i >= COLUMNS) sided.push(i - COLUMNS) // n
    if (!block[1] && (i + 1) % COLUMNS !== 0) sided.push(i + 1) // l
    if (!block[2] && i < AREA - COLUMNS) sided.push(i + COLUMNS) // s
    if (!block[3] && i % COLUMNS !== 0) sided.push(i - 1) // o

    return sided
}

/**
 * Retorna o vértice de menor distância
 * @returns {number} Vértice
 */
function getNearest() {
    let nearest = Infinity,
        current = -1

    for (let i = 0; i < AREA; i++)
        if (!visited[i] && distances[i] < nearest) {
            nearest = distances[i]
            current = i
        }

    return current
}

/**
 * Setup do caminho e algoritmo de DIJKSTRA
 */
function explore() {
    while (true) {
        const current = getNearest() // pegar o vértice de menor distância em relação ao start

        if (current === -1 || current === FINAL) return // para de rodar aqui

        visited[current] = true

        for (const target of getSided(current)) {
            if (visited[target]) continue // ignorar caso já tenha passado por ali

            const distance = distances[current] + 1 // adicionar 1 de distância pro próximo bloco

            if (distance < distances[target]) {
                // verifica se a distância do alvo é menor que a já definida
                distances[target] = distance // definir a distância
                previous[target] = current // adiciona o bloco no caminho
            }
        }
    }
}

/**
 * Forma o caminho
 * @returns {number[]}
 */
function makePath() {
    const /** @type {number[]} */ path = []

    let current = FINAL // começa pelo final e vai até o início

    while (current !== -1) {
        path.unshift(current)
        current = previous[current]
    }

    if (path[0] !== START) return [] // se não achar o caminho ( se o início do caminho não for a posição inicial )

    return path
}

/**
 * @param {number} block
 * @returns {{ x: number, y: number }}
 */
function getCenter(block) {
    return { x: (block % COLUMNS) * BLOCK_SIZE + BLOCK_SIZE / 2, y: Math.floor(block / COLUMNS) * BLOCK_SIZE + BLOCK_SIZE / 2 }
}

/**
 * @param {number[]} path
 */
function drawPath(path) {
    if (path.length === 0) return // não desenha nada se o caminho for vazio

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    for (let i = 0; i < path.length; i++) {
        const { x: _x, y: _y } = getCenter(path[i]) // pega o centro dos bloco

        i === 0 ? ctx.moveTo(_x, _y) : ctx.lineTo(_x, _y) // 1ª vez = moveTo; 2ª+ = lineTo
    }

    ctx.stroke() // pintar

    const { x, y } = getCenter(START), // meio do bloco
        offset = pointSize / 2 // centralizar o □ do início

    ctx.fillStyle = color // cor
    ctx.fillRect(x - offset, y - offset, pointSize, pointSize) // preencher o □
}

explore() // preparar todo o caminho
drawPath(makePath()) // desenhar o caminho se ele existir
