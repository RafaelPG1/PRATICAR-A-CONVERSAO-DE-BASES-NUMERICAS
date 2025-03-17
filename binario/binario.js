document.addEventListener("DOMContentLoaded", function () {
  let numeroBinario = null
  let respostaCorreta = ""

  const resultInput = document.getElementById("result")
  const inputBinario = document.getElementById("input-number")
  const checkboxes = document.querySelectorAll(".checkbox")
  const labelResposta = document.createElement("label")
  const labelCalculo = document.createElement("div")
  const labelObs = document.createElement("div")

  labelResposta.innerText = "Resposta:"
  labelResposta.style.fontWeight = "bold"
  labelResposta.style.marginTop = "10px"
  labelCalculo.style.fontWeight = "bold"
  labelResposta.style.color = "red" // Adicionado cor vermelha para "Resposta:"
  labelCalculo.style.marginTop = "10px"
  labelCalculo.style.lineHeight = "1.8" // Ajuste o valor conforme necessário
  labelCalculo.style.whiteSpace = "pre-line"
  labelObs.style.fontWeight = "bold"
  labelObs.style.marginTop = "10px"

  document.body.appendChild(labelResposta)
  document.body.appendChild(labelCalculo)
  document.body.appendChild(labelObs)

function sortearNumero() {
  // Sorteia um número decimal entre 1 e 100 diretamente
  let valorDecimal = Math.floor(Math.random() * 100) + 1

  // Converte para binário
  numeroBinario = valorDecimal.toString(2)

  resultInput.value = numeroBinario
  inputBinario.value = ""
  labelResposta.textContent = "Resposta:"
  labelCalculo.textContent = ""
  labelObs.textContent = ""

  // Podemos adicionar um log para verificar a distribuição (opcional)
  console.log(`Sorteado: ${numeroBinario} (decimal: ${valorDecimal})`)
}

  function calcularDecimal(binario) {
    let soma = 0
    let termos = []
    let valores = []

    for (let i = 0; i < binario.length; i++) {
      let digito = binario[binario.length - 1 - i]
      let valor = parseInt(digito) * Math.pow(2, i)
      termos.push(
        `${digito} × 2<span style="font-size: 60%; vertical-align: top;">${i}</span>`
      )
      valores.push(valor.toString())
      soma += valor
    }

    let calculoExpressao = termos.reverse().join(" + ")
    let calculoValores = valores.reverse().join(" + ") + ` = ${soma}`

    // Lemos em vermelho com o valor em branco
    let resultadoFormatado = `<span style="color: red; font-weight: bold;">Lemos: </span><span style="color: white; font-weight: bold;">${soma}<span style="font-size: 60%; vertical-align: bottom;">10</span></span>`

    return {
      expressao: `${calculoExpressao}<br>${calculoValores}<br>${resultadoFormatado}`,
      soma,
    }
  }

  function calcularHexadecimalPrimeiraForma(binario) {
    let resultadoDecimal = calcularDecimal(binario)
    let decimal = resultadoDecimal.soma

    // Adicionando Passo 1 antes da expressão de cálculo do decimal
    let passosBinarioParaDecimal = `<span style="color: green; font-weight: bold;">Passo 1: Converter de binário para decimal</span><br>${resultadoDecimal.expressao}`

    let passosHex = []
    let restoArray = []
    let quociente = decimal

    // Agora só adicionar o Passo 2
    passosHex.push(
      `<span style="color: green; font-weight: bold;">Passo 2: Converter de decimal para hexadecimal</span>`
    )

    while (quociente >= 16) {
      let novoQuociente = Math.floor(quociente / 16)
      let resto = quociente % 16
      let restoHex = resto.toString(16).toUpperCase()
      passosHex.push(
        `${quociente} ÷ 16 = ${novoQuociente} (quociente) → (16x${novoQuociente}) = ${
          novoQuociente * 16
        } - ${quociente} = ${resto} (resto)`
      )
      restoArray.push(restoHex)
      quociente = novoQuociente
    }

    restoArray.push(quociente.toString(16).toUpperCase())
    passosHex.push(`Último quociente (${quociente}) → Primeiro dígito`)
    passosHex.push(
      "Observamos que a ordem que vai ficar começa por baixo (o último quociente) e vai até o resto (subindo)."
    )

    let resultadoHex = restoArray.reverse().join("")
    passosHex.push(
      `<span style="color: red; font-weight: bold;">Lemos: </span><span style="color: white; font-weight: bold;">0x${resultadoHex}</span>`
    )

    return `<span style="color: #0066cc; font-weight: bold;">PRIMEIRA FORMA: Binário para Decimal para Hexadecimal</span><br>${passosBinarioParaDecimal}<br><br>${passosHex.join("<br>")}`
  }

  function calcularHexadecimalSegundaForma(binario) {
    if (binario.length % 4 !== 0) {
      binario = binario.padStart(Math.ceil(binario.length / 4) * 4, "0")
    }

    let grupos = []
    for (let i = 0; i < binario.length; i += 4) {
      grupos.push(binario.slice(i, i + 4))
    }

    let pesos = [8, 4, 2, 1]
    let valoresHexadecimais = []
    let detalhes = []

    grupos.forEach((grupo) => {
      let soma = 0
      let detalhesGrupo = []
      for (let i = 0; i < grupo.length; i++) {
        const bit = parseInt(grupo[i])
        const valor = bit * pesos[i]
        soma += valor
        detalhesGrupo.push(`${bit}×${pesos[i]}`)
      }
      valoresHexadecimais.push(soma.toString(16).toUpperCase())
      detalhes.push(`${grupo} → ${detalhesGrupo.join(" + ")} = ${soma}`)
    })

    let resultadoHex = `0x${valoresHexadecimais.join("")}`
    return (
      `<span style="color: yellow; font-weight: bold;">SEGUNDA FORMA: Binário para Hexadecimal</span><br>` +
      `<span style="color: green; font-weight: bold;">Passo 1: Separar em grupos de 4 bits</span><br>${grupos.join(
        " - "
      )}<br><br>` +
      `<span style="color: green; font-weight: bold;">Passo 2: Associar os pesos (8421) e calcular os valores decimais</span><br>` +
      detalhes.join("<br>") +
      `<br><br>Passo 3: Juntar os valores<br><span style="color: red; font-weight: bold;">Lemos: </span><span style="color: white; font-weight: bold;">${resultadoHex}</span>`
    )
  }

  function calcularOctalPrimeiraForma(binario) {
    let resultadoDecimal = calcularDecimal(binario)
    let decimal = resultadoDecimal.soma

    // Mesma modificação aplicada aqui
    let passosBinarioParaDecimal = `<span style="color: green; font-weight: bold;">Passo 1: Converter de binário para decimal</span><br>${resultadoDecimal.expressao}`

    let passosOctal = []
    let restoArray = []
    let quociente = decimal

    // Agora só adicionar o Passo 2
    passosOctal.push(
      `<span style="color: green; font-weight: bold;">Passo 2: Converter de decimal para octal</span>`
    )

    while (quociente >= 8) {
      let novoQuociente = Math.floor(quociente / 8)
      let resto = quociente % 8
      passosOctal.push(
        `${quociente} ÷ 8 = ${novoQuociente} (quociente) → (8x${novoQuociente}) = ${
          novoQuociente * 8
        } - ${quociente} = ${resto} (resto)`
      )
      restoArray.push(resto)
      quociente = novoQuociente
    }

    restoArray.push(quociente)
    passosOctal.push(`Último quociente (${quociente}) → Primeiro dígito`)
    passosOctal.push(
      "Observamos que a ordem que vai ficar começa por baixo (o último quociente) e vai até o resto (subindo)."
    )

    let resultadoOctal = restoArray.reverse().join("")
    passosOctal.push(
      `<span style="color: red; font-weight: bold;">Lemos: </span><span style="color: white; font-weight: bold;">${resultadoOctal}<span style="font-size: 60%; vertical-align: bottom;">8</span></span>`
    )

    return `<span style="color: #0066cc; font-weight: bold;">PRIMEIRA FORMA: Binário para Decimal para Octal</span><br>${passosBinarioParaDecimal}<br><br>${passosOctal.join("<br>")}`
  }

  function calcularOctalSegundaForma(binario) {
    if (binario.length % 3 !== 0) {
      binario = binario.padStart(Math.ceil(binario.length / 3) * 3, "0")
    }

    let grupos = []
    for (let i = 0; i < binario.length; i += 3) {
      grupos.push(binario.slice(i, i + 3))
    }

    let pesos = [4, 2, 1]
    let valoresOctais = []
    let detalhes = []

    grupos.forEach((grupo) => {
      let soma = 0
      let detalhesGrupo = []
      for (let i = 0; i < grupo.length; i++) {
        const bit = parseInt(grupo[i])
        const valor = bit * pesos[i]
        soma += valor
        detalhesGrupo.push(`${bit}×${pesos[i]}`)
      }
      valoresOctais.push(soma.toString())
      detalhes.push(`${grupo} → ${detalhesGrupo.join(" + ")} = ${soma}`)
    })

    let resultadoOctal = valoresOctais.join("")
    return (
      `<span style="color: yellow; font-weight: bold;">SEGUNDA FORMA: Binário para Octal</span><br>` +
      `<span style="color: green; font-weight: bold;">Passo 1: Separar em grupos de 3 bits</span><br>${grupos.join(
        " - "
      )}<br><br>` +
      `<span style="color: green; font-weight: bold;">Passo 2: Associar os pesos (421) e calcular os valores decimais</span><br>` +
      detalhes.join("<br>") +
      `<br><br>Passo 3: Juntar os valores<br><span style="color: red; font-weight: bold;">Lemos: </span><span style="color: white; font-weight: bold;">${resultadoOctal}<span style="font-size: 60%; vertical-align: bottom;">8</span></span>`
    )
  }

  function obterOpcaoSelecionada() {
    return Array.from(checkboxes).find((chk) => chk.checked)
  }

  function confirmarNumero() {
    if (numeroBinario === null) {
      alert("Primeiro, sorteie um número!")
      return
    }

    let checkedOption = obterOpcaoSelecionada()
    if (!checkedOption) {
      alert("Selecione um tipo de conversão!")
      return
    }

    let respostaUsuario = inputBinario.value.trim()
    let respostaEsperada = ""
    let calculo = ""
    let respostaLimpa = ""

    if (
      checkedOption.nextSibling.textContent.includes("Binário para Decimal")
    ) {
      let resultadoDecimal = calcularDecimal(numeroBinario)
      respostaEsperada = resultadoDecimal.soma.toString()
      respostaLimpa = respostaEsperada // Sem formatação especial para decimal
      calculo = resultadoDecimal.expressao
    } else if (
      checkedOption.nextSibling.textContent.includes("Binário para Hexadecimal")
    ) {
      let primeiraForma = calcularHexadecimalPrimeiraForma(numeroBinario)
      let segundaForma = calcularHexadecimalSegundaForma(numeroBinario)
      let resultadoHex = parseInt(numeroBinario, 2).toString(16).toUpperCase()
      respostaEsperada = "0x" + resultadoHex
      respostaLimpa = resultadoHex // Sem o prefixo 0x
      calculo = `${primeiraForma}<br><br>${segundaForma}`
    } else if (
      checkedOption.nextSibling.textContent.includes("Binário para Octal")
    ) {
      let primeiraForma = calcularOctalPrimeiraForma(numeroBinario)
      let segundaForma = calcularOctalSegundaForma(numeroBinario)

      // Calcular o valor octal correto do binário
      let resultadoOctal = parseInt(numeroBinario, 2).toString(8)
      respostaEsperada =
        resultadoOctal 

      respostaLimpa = resultadoOctal // Apenas o valor numérico, sem formatação
      calculo = `${primeiraForma}<br><br>${segundaForma}`
    }

    let respostaCorreta = false

    if (
      checkedOption.nextSibling.textContent.includes("Binário para Hexadecimal")
    ) {
      // Para hexadecimal, permita tanto o formato com "0x" quanto sem
      respostaCorreta =
        respostaUsuario === respostaLimpa ||
        respostaUsuario === "0x" + respostaLimpa
    } else {
      // Para os outros tipos, comparação direta com o valor limpo
      respostaCorreta = respostaUsuario === respostaLimpa
    }

    if (respostaCorreta) {
      inputBinario.style.backgroundColor = "green"
    } else {
      inputBinario.style.backgroundColor = "red"
      setTimeout(() => (inputBinario.style.backgroundColor = ""), 3000)
    }

    labelResposta.innerHTML = `Resposta: ${respostaEsperada}`
    // Certifique-se de que o texto CÁLCULO: esteja presente e visível
    labelCalculo.innerHTML = `<span style="color: rgb(0, 255, 255); font-weight: bold;">CÁLCULO:</span><br>${calculo}`
  }

  function Apagartudo() {
    // Limpa as entradas e saídas
    inputBinario.value = ""
    inputBinario.style.backgroundColor = ""
    resultInput.value = ""
    numeroHexadecimal = null // Reinicia o número sorteado

    // Limpa os labels de cálculo e resposta
    labelResposta.innerHTML = "Resposta:"
    labelCalculo.innerHTML = ""

    // Desmarca todas as checkboxes
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false
    })

    console.log("Tudo foi apagado!")
  }

  // Adicionar os manipuladores de eventos para os botões
  document.getElementById("limpar-btn").addEventListener("click", function () {
    console.log("Botão limpar clicado")
    Apagartudo()
  })

  window.sortearNumero = sortearNumero
  window.confirmarNumero = confirmarNumero
  window.Apagartudo = Apagartudo // Expõe a função para o escopo global
})
