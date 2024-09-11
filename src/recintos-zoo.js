class RecintosZoo {

    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'macaco', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'gazela', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'leao', quantidade: 1 }] }
        ]

        this.animaisValidos = ['LEAO', 'LEOPARDO', 'CROCODILO', 'MACACO', 'GAZELA', 'HIPOPOTAMO']
        this.carnivoros = ['LEAO', 'LEOPARDO', 'CROCODILO']
    }

    analisaRecintos(animal, quantidade) {
        animal = animal.toUpperCase()

        if (!this.animaisValidos.includes(animal)) {
            return { erro: "Animal inválido" }
        }
        if (typeof quantidade !== 'number' || quantidade <= 0) {
            return { erro: "Quantidade inválida" }
        }

        const recintosViaveis = []

        this.recintos.forEach((recinto) => {
            if (this.verificaCompatibilidadeBioma(recinto, animal) && this.temEspacoSuficiente(recinto, animal, quantidade)) {
                if (this.carnivoros.includes(animal) && this.existeOutroCarnivoro(recinto, animal)) {
                    return
                }
                if (animal === 'MACACO' && this.existeOutroCarnivoro(recinto, animal)) {
                    return
                }
                if (animal === 'HIPOPOTAMO' && !this.podeConviverHipopotamo(recinto)) {
                    return
                }
                if (animal === 'MACACO' && this.ficaraSozinho(recinto, quantidade)) {
                    return
                }

                let espacoLivre = this.calculaEspacoLivre(recinto, animal, quantidade)
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`)
            }
        })

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" }
        }
        return { recintosViaveis: recintosViaveis.sort() }
    }

    verificaCompatibilidadeBioma(recinto, animal) {
        const bioma = recinto.bioma.toLowerCase()

        if (animal === 'LEAO' || animal === 'LEOPARDO') {
            return bioma.includes('savana')
        }
        if (animal === 'CROCODILO') {
            return bioma === 'rio'
        }
        if (animal === 'MACACO') {
            return bioma.includes('savana') || bioma.includes('floresta')
        }
        if (animal === 'GAZELA') {
            return bioma.includes('savana')
        }
        if (animal === 'HIPOPOTAMO') {
            return bioma.includes('savana e rio') || bioma.includes('rio')
        }
        return false
    }

    temEspacoSuficiente(recinto, animal, quantidade) {
        let espacoOcupado = recinto.animais.reduce((total, a) => total + (a.quantidade * this.quantidadeAnimais(a.especie)), 0)

        if (recinto.animais.some(a => a.especie.toUpperCase() !== animal)) {
            espacoOcupado += 1
        }
        return (recinto.tamanhoTotal - espacoOcupado) >= (quantidade * this.quantidadeAnimais(animal))
    }

    existeOutroCarnivoro(recinto, especie) {
        return recinto.animais.some(a => this.carnivoros.includes(a.especie.toUpperCase()) && a.especie.toUpperCase() !== especie)
    }

    podeConviverHipopotamo(recinto) {
        return recinto.bioma.toLowerCase() === 'savana e rio'
    }

    ficaraSozinho(recinto, quantidade) {
        const totalMacacos = recinto.animais.reduce((total, a) => (a.especie.toUpperCase() === 'MACACO' ? total + a.quantidade : total), 0)
        return totalMacacos + quantidade < 2 && recinto.animais.length === 0
    }

    calculaEspacoLivre(recinto, animal, quantidade) {
        let espacoOcupado = recinto.animais.reduce((total, a) => total + (a.quantidade * this.quantidadeAnimais(a.especie)), 0)

        if (recinto.animais.some(a => a.especie.toUpperCase() !== animal)) {
            espacoOcupado += 1
        }
        return recinto.tamanhoTotal - (espacoOcupado + (quantidade * this.quantidadeAnimais(animal)))
    }

    quantidadeAnimais(animal) {
        const tamanhos = { LEAO: 3, LEOPARDO: 2, CROCODILO: 3, MACACO: 1, GAZELA: 2, HIPOPOTAMO: 4 }

        return tamanhos[animal.toUpperCase()] || 0
    }

}

export { RecintosZoo as RecintosZoo }


const zoo = new RecintosZoo()
console.log(zoo.analisaRecintos('CROCODILO', 1))
console.log(zoo.analisaRecintos('MACACO', 2))