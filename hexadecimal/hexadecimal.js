document.addEventListener("DOMContentLoaded", function () {
  let numeroHexadecimal = null
  let respostaCorreta = ""

  const maxNumberInput = document.getElementById("max-number")
  const resultInput = document.getElementById("result")
  const inputHex = document.getElementById("input-number")
  const checkboxes = document.querySelectorAll(".checkbox")
  const labelResposta = document.createElement("label")
  const labelCalculo = document.createElement("div")

  labelResposta.innerText = "Resposta:"
  labelResposta.style.fontWeight = "bold"
  labelResposta.style.marginTop = "10px"
  labelResposta.style.color = "red" // Adicionado cor vermelha para "Resposta:"
  labelCalculo.style.lineHeight = "1.8" // Ajuste o valor conforme necessário
  labelCalculo.style.fontWeight = "bold"
  labelCalculo.style.marginTop = "10px"
  labelCalculo.style.whiteSpace = "pre-line"

  document.body.appendChild(labelResposta)
  document.body.appendChild(labelCalculo)

  function sortearNumero() {
    let maxNumber = parseInt(maxNumberInput.value, 10) || 255
    if (maxNumber < 1) maxNumber = 1
    if (maxNumber > 65535) maxNumber = 65535

    let numeroDecimal = Math.floor(Math.random() * maxNumber) + 1
    let numeroHex = numeroDecimal.toString(16).toUpperCase()

    while (numeroHex.length < 3) {
      numeroHex = "0" + numeroHex
    }

    numeroHexadecimal = "0x" + numeroHex.replace(/^0+/, "")

    resultInput.value = numeroHexadecimal
    inputHex.value = ""
    labelResposta.textContent = "Resposta:"
    labelCalculo.textContent = ""
  }

  function hexToDecimal(hex) {
    if (hex.startsWith("0x") || hex.startsWith("0X")) {
      hex = hex.slice(2)
    }

    let decimal = 0
    let termos = []
    let valores = []

    for (let i = 0; i < hex.length; i++) {
      let currentChar = hex[i].toUpperCase()
      let currentValue
      let representacao = ""

      if (currentChar >= "0" && currentChar <= "9") {
        currentValue = parseInt(currentChar)
      } else {
        currentValue = 10 + (currentChar.charCodeAt(0) - "A".charCodeAt(0))
        representacao = ` → (${currentChar} representa ${currentValue})`
      }

      let potencia = hex.length - 1 - i
      let multiplicacao = currentValue * Math.pow(16, potencia)

      termos.push(
        `${currentChar} × 16<span style="font-size: 60%; vertical-align: top;">${potencia}</span>${representacao}`
      )
      valores.push(multiplicacao)
      decimal += multiplicacao
    }

    let expressao = termos.join(" + ")
    let valoresStr = valores.join(" + ")

    return {
      expressao: `${expressao}<br>${valoresStr}<br>${decimal}<br><br><span style="color: red;">Lemos: </span><span style="color: white;">${decimal}<span style="font-size: 60%; vertical-align: bottom;">10</span></span>`,
      resultado: decimal,
      resultadoHex: "0x" + hex.toUpperCase(),
    }
  }

  function hexToOctal(hex) {
    if (hex.startsWith("0x") || hex.startsWith("0X")) {
      hex = hex.slice(2)
    }

    // Primeira forma: usando a conversão para decimal como passo intermediário
    let resultadoDecimal = hexToDecimal(hex)
    let decimal = resultadoDecimal.resultado

    // Função para converter decimal para octal através de subtração
    function calcularOctalSubtracao(numero) {
      let passos = []
      let resultadoOctal = ""
      let calculos = []

      if (numero === 0) {
        return (
          passos.join("<br>") +
          '<br><span style="color: red;">Lemos: </span><span style="color: white;">0<span style="font-size: 60%; vertical-align: bottom;">8</span></span>'
        )
      }

      while (numero > 0) {
        let quociente = Math.floor(numero / 8)
        let resto = numero - quociente * 8
        calculos.push(
          `${numero} ÷ 8 = ${quociente} (quociente) → (8×${quociente}) = ${
            quociente * 8
          } - ${numero} = ${resto} (resto)`
        )
        resultadoOctal = resto + resultadoOctal
        numero = quociente

        if (quociente < 8) {
          if (quociente > 0) {
            calculos.push(`Último quociente (${quociente}) → Primeiro dígito`)
            resultadoOctal = quociente + resultadoOctal
          }
          break
        }
      }

      passos.push(calculos.join("<br>"))
      passos.push(
        "Observamos que a ordem que vai ficar começa por baixo (o último quociente) e vai até o resto (subindo)."
      )

      return (
        passos.join("<br>") +
        `<br><span style="color: red;">Lemos: </span><span style="color: white;">${resultadoOctal}<span style="font-size: 60%; vertical-align: bottom;">8</span></span>`
      )
    }

    // Monta o resultado final apenas com a segunda forma
    let primeiraForma = `<span style="color: #00FF00; font-weight: bold;">Passo 1:</span> Converta o hexadecimal para decimal<br>${resultadoDecimal.expressao}<br><br>`
    let segundaForma = `<span style="color: #00FF00; font-weight: bold;">Passo 2:</span> Converta o decimal para octal<br>${calcularOctalSubtracao(
      decimal
    )}`

    // Calcula o resultado final em octal diretamente
    let resultadoOctal = decimal.toString(8)

    return {
      primeiraForma: primeiraForma,
      segundaForma: segundaForma,
      resultado: resultadoOctal,
      // Adiciona todo o cálculo em um único campo para garantir que será exibido
      calculoCompleto: primeiraForma + segundaForma,
    }
  }

  function hexToBinary(hex) {
    if (hex.startsWith("0x") || hex.startsWith("0X")) {
      hex = hex.slice(2)
    }

    let primeiraForma = [
      `<span style="color: #00FF00; font-weight: bold;">Passo 1:</span> Hexadecimal para Binário diretamente`,
    ] // Alterado para verde #00FF00
    let binaryResult = ""

    for (let i = 0; i < hex.length; i++) {
      let currentChar = hex[i].toUpperCase()
      let decimalValue = parseInt(currentChar, 16)

      let passoAtual = i + 1
      primeiraForma.push(
        `<span style="color: green; font-weight: bold;">Passo ${passoAtual}:</span> Pegue o ${passoAtual}º número/peso "${currentChar}" após o prefixo "0x".`
      ) // Verde
      primeiraForma.push(`"${currentChar}" representa ${decimalValue}.`)
      primeiraForma.push(
        "Divida o número por 2 e registre os restos sucessivamente:"
      )

      let binSteps = []
      let resto = []
      let numero = decimalValue

      while (numero >= 2) {
        let quociente = Math.floor(numero / 2)
        resto.unshift(numero % 2)
        binSteps.push(`${numero} ÷ 2 = ${quociente} → resto = ${numero % 2}`)
        numero = quociente
      }

      resto.unshift(numero)
      primeiraForma.push(binSteps.join("<br>"))

      if (numero === 1 || numero === 0) {
        primeiraForma.push(`Último quociente = ${numero}`)
      }

      let binarySegment = resto.join("")

      // Verifica quantos bits tem e adiciona zeros à esquerda se necessário
      let bitsNecessarios = Math.ceil(binarySegment.length / 4) * 4
      let zerosAdicionados = bitsNecessarios - binarySegment.length
      let binarySegmentCorrigido = binarySegment.padStart(bitsNecessarios, "0")

      primeiraForma.push("Monte o número binário começando pelos restos:")
      primeiraForma.push(
        `O resultado para "${currentChar}" é ${binarySegmentCorrigido}.`
      )

      if (zerosAdicionados > 0) {
        primeiraForma.push(
          `<span style="color: yellow;">O número "${binarySegment}" precisava de ${zerosAdicionados} zero(s) à esquerda para completar ${bitsNecessarios} bits.</span>`
        )
      }

      binaryResult += binarySegmentCorrigido
    }

    let resultadoDecimal = hexToDecimal(hex)
    let decimal = resultadoDecimal.resultado

    function calcularBinario(numero) {
      let passos = ["Decimal para Binário:"]
      let resultadoBinario = ""

      while (numero >= 2) {
        let quociente = Math.floor(numero / 2)
        let resto = numero % 2
        passos.push(`${numero} ÷ 2 = ${quociente} → resto = ${resto}`)
        resultadoBinario = resto + resultadoBinario
        numero = quociente
      }
      resultadoBinario = numero + resultadoBinario
      passos.push(`Último quociente (${numero}) → Primeiro dígito`)

      let bitsNecessarios = Math.ceil(resultadoBinario.length / 4) * 4
      let zerosAdicionados = bitsNecessarios - resultadoBinario.length
      let resultadoBinarioCorrigido = resultadoBinario.padStart(
        bitsNecessarios,
        "0"
      )

      let explicacaoZeros =
        zerosAdicionados > 0
          ? `<span style="color: yellow;">O número "${resultadoBinario}" precisava de ${zerosAdicionados} zero(s) à esquerda para completar ${bitsNecessarios} bits.</span><br>`
          : ""

      return (
        passos.join("<br>") +
        `<br>${explicacaoZeros}<span style="color: red;">Lemos: </span><span style="color: white;">${resultadoBinarioCorrigido}<span style="font-size: 60%; vertical-align: bottom;">2</span></span>`
      )
    }

    let segundaForma = `<span style="color: #00FF00; font-weight: bold;">Passo 2:</span> Hexadecimal para Decimal para Binário<br>${
      resultadoDecimal.expressao
    }<br><br>${calcularBinario(decimal)}` // Alterado para verde #00FF00

    return {
      primeiraForma:
        primeiraForma.join("<br>") +
        `<br><br><span style="color: red;">Lemos: </span><span style="color: white;">${binaryResult}<span style="font-size: 60%; vertical-align: bottom;">2</span></span>`,
      segundaForma,
      resultado: binaryResult,
    }
  }

  function obterOpcaoSelecionada() {
    return Array.from(checkboxes).find((chk) => chk.checked)?.value
  }

  function confirmarNumero() {
    if (numeroHexadecimal === null) {
      alert("Primeiro, sorteie um número!")
      return
    }

    let checkedOption = obterOpcaoSelecionada()
    if (!checkedOption) {
      alert("Selecione um tipo de conversão!")
      return
    }

    let respostaUsuario = inputHex.value.trim().toUpperCase()
    let respostaEsperada = ""
    let calculo = ""

    if (checkedOption === "Decimal") {
      let resultadoDecimal = hexToDecimal(numeroHexadecimal)
      respostaEsperada = resultadoDecimal.resultado.toString()
      calculo = resultadoDecimal.expressao
    } else if (checkedOption === "Binario") {
      let resultadoBinario = hexToBinary(numeroHexadecimal)
      respostaEsperada = resultadoBinario.resultado
      calculo = `${resultadoBinario.primeiraForma}<br><br>${resultadoBinario.segundaForma}`
    } else if (checkedOption === "Octal") {
      let resultadoOctal = hexToOctal(numeroHexadecimal)
      respostaEsperada = resultadoOctal.resultado
      calculo = resultadoOctal.calculoCompleto
    }

    if (respostaUsuario === respostaEsperada) {
      inputHex.style.backgroundColor = "green"
    } else {
      inputHex.style.backgroundColor = "red"
      setTimeout(() => (inputHex.style.backgroundColor = ""), 3000)
    }

    labelResposta.innerHTML = `Resposta: ${respostaEsperada}`

    // Certifique-se de que o texto CÁLCULO: esteja presente e visível
    labelCalculo.innerHTML = `<span style="color: rgb(0, 255, 255); font-weight: bold;">CÁLCULO:</span><br>${calculo}`

    // Para depuração - remova depois se necessário
    console.log("Opção selecionada:", checkedOption)
    console.log("Cálculo gerado:", calculo)
  }

  function Apagartudo() {
    // Limpa as entradas e saídas
    inputHex.value = ""
    inputHex.style.backgroundColor = ""
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

  // Expor as funções para o escopo global para uso nos atributos onclick
  window.sortearNumero = sortearNumero
  window.confirmarNumero = confirmarNumero
  window.Apagartudo = Apagartudo
})
