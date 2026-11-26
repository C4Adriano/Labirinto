/* eslint-disable no-unused-vars */
import { COLUNAS, grade } from "./lab.js"

const start = 1,
    final = 10

/**
 * @param {number} block
 * @returns {void}
 */
function getSided(block) {
    const norte = block > COLUNAS - 1 ? grade.at(block - COLUNAS) : null
    console.log(norte)
}

getSided(0)

// leste = block % (COLUNAS - 1) === 0 ? null : grade.at(block + 1),
// sul = block < AREA - COLUNAS ? grade.at(block + COLUNAS) : null,
// oeste = block % COLUNAS === 0 ? null : grade.at(block - 1)
