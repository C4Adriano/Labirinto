export const canvas = document.getElementById("canvas")

if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Canvas não encontrado")
}

export const ctx = canvas.getContext("2d")

if (!ctx) {
    throw new Error("Contexto 2D não disponível")
}

export const LINHAS = 20, // x
    COLUNAS = 20, // y
    AREA = LINHAS * COLUNAS, // x × y
    LADO = 30, // ?
    PERCENTUAL = 0.05, // variação das células já criadas
    /** @type {{visitada: boolean, paredes: (boolean | number)[]}[]} */ grade = [] // células

const /** @type {number[]} */ pilha = [] // backtracking

let celula = 0 // célula atual

for (let quantidade = 0; quantidade < AREA; quantidade++) {
    // criar células
    grade.push({
        visitada: false, // backtracking
        paredes: [true, true, true, true], // Norte, Leste, Sul, Oeste
    })
}

grade[celula].visitada = true // 0 começa visitada
for (let quantidade = 1; quantidade < AREA; quantidade++) {
    const /** @type {number[]} */ vizinhos = []

    for (let direcao = 0; direcao < 4; direcao++) {
        const x = (celula % COLUNAS) + (direcao % 2) * (2 - direcao),
            y = Math.floor(celula / COLUNAS) + ((direcao + 1) % 2) * (direcao - 1)
        if (x >= 0 && x < COLUNAS && y >= 0 && y < LINHAS) {
            const vizinho = y * COLUNAS + x
            if (!grade[vizinho].visitada) {
                vizinhos.push(vizinho)
            }
        }
    }

    if (vizinhos.length > 0) {
        pilha.push(celula)
        const vizinho = vizinhos[Math.floor(Math.random() * vizinhos.length)],
            diferenca = vizinho - celula,
            direcao = 1 + (diferenca - (diferenca % COLUNAS)) / COLUNAS + (diferenca % COLUNAS) ** 2 - (diferenca % COLUNAS)

        grade[celula].paredes[direcao] = false
        grade[vizinho].paredes[(direcao + 2) % 4] = false
        celula = vizinho
        grade[celula].visitada = true
        quantidade++
    } else if (pilha.length > 0) {
        celula = pilha.pop() ?? 0
    }
}

for (let quantidade = PERCENTUAL * AREA; quantidade > 0; quantidade--) {
    const _celula = Math.floor(Math.random() * AREA),
        direcao = Math.floor(Math.random() * 4),
        x = (_celula % COLUNAS) + (direcao % 2) * (2 - direcao),
        y = Math.floor(_celula / COLUNAS) + ((direcao + 1) % 2) * (direcao - 1)

    if (x >= 0 && x < COLUNAS && y >= 0 && y < LINHAS) {
        const parede = Math.floor(Math.random() * 2)
        grade[_celula].paredes[direcao] = parede
        grade[y * COLUNAS + x].paredes[(direcao + 2) % 4] = parede
    }
}

/**
 * @param {number} x1
 * @param {number} x2
 * @param {number} y1
 * @param {number} y2
 */
function desenharLinha(x1, y1, x2, y2) {
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(x1 + 1, y1 + 1)
    ctx.lineTo(x2 + 1, y2 + 1)
    ctx.stroke()
}

ctx.clearRect(0, 0, canvas.width, canvas.height)
ctx.strokeStyle = "black"
for (let _celula = 0; _celula < AREA; _celula++) {
    const x = _celula % COLUNAS,
        y = Math.floor(_celula / COLUNAS)

    if (grade[_celula].paredes[0]) {
        desenharLinha(x * LADO, y * LADO, x * LADO + LADO, y * LADO)
    }
    if (grade[_celula].paredes[1]) {
        desenharLinha(x * LADO + LADO, y * LADO, x * LADO + LADO, y * LADO + LADO)
    }
    if (grade[_celula].paredes[2]) {
        desenharLinha(x * LADO + LADO, y * LADO + LADO, x * LADO, y * LADO + LADO)
    }
    if (grade[_celula].paredes[3]) {
        desenharLinha(x * LADO, y * LADO + LADO, x * LADO, y * LADO)
    }
}
