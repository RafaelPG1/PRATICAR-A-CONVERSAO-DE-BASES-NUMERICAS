document.addEventListener("DOMContentLoaded", function () {
  let numeroSorteado = null
  let respostaCorreta = ""

  const maxNumberInput = document.getElementById("max-number")
  const resultInput = document.getElementById("result")
  const inputNumber = document.getElementById("input-number")
  const checkboxes = document.querySelectorAll(".checkbox")

  // Criar um único contêiner para exibir os resultados dentro do próprio script
  let resultadoContainer = document.createElement("div")
  resultadoContainer.style.marginTop = "20px"

  let labelResposta = document.createElement("label")
  labelResposta.innerText = "Resposta:"
  labelResposta.style.fontWeight = "bold"
  labelResposta.style.color = "red"

  let labelCalculo = document.createElement("div")
  labelCalculo.style.fontWeight = "bold"
  labelCalculo.style.marginTop = "10px"
  labelCalculo.style.lineHeight = "1.8"

  resultadoContainer.appendChild(labelResposta)
  resultadoContainer.appendChild(labelCalculo)
  document.body.appendChild(resultadoContainer)

  function sortearNumero() {
    const maxNumber = parseInt(maxNumberInput.value, 10) || 100
    numeroSorteado = Math.floor(Math.random() * maxNumber) + 1
    resultInput.value = numeroSorteado.toString(8)
    inputNumber.value = ""
    labelResposta.innerHTML = "Resposta:"
    labelCalculo.innerHTML = ""
  }

  function octalToDecimal(octal) {
    let decimal = 0
    let passos = []
    let somaPassos = []
    const length = octal.length

    for (let i = 0; i < length; i++) {
      let digit = parseInt(octal[i], 10)
      if (isNaN(digit) || digit >= 8) {
        return {
          resultado: "Número inválido",
          detalhes: "O número contém dígitos não octais.",
        }
      }
      let power = length - i - 1
      let valor = digit * Math.pow(8, power)
      decimal += valor

      passos.push(`${digit} × 8<sup>${power}</sup>`)
      somaPassos.push(`${valor}`)
    }

    const expressao = passos.join(" + ")
    const valores = somaPassos.join(" + ")
    const formatacao = `${expressao}<br>${valores}<br>${decimal}<br><span style="color: red;">Lemos:</span> <span style="color: white;">${decimal}<sub>10</sub></span>`

    return { resultado: decimal, detalhes: formatacao }
  }

  function calcularBinario(numero) {
    let passos = ["Decimal para Binário:"]
    let restos = []
    let decimalNum = parseInt(numero, 10)

    if (decimalNum === 0) {
      return {
        resultado: "0",
        detalhes:
          'Decimal para Binário:<br>0 em decimal é 0 em binário<br><span style="color: red;">Lemos:</span> <span style="color: white;">0<sub>2</sub></span>',
      }
    }

    while (decimalNum > 0) {
      let resto = decimalNum % 2
      restos.unshift(resto)
      passos.push(
        `${decimalNum} ÷ 2 = ${Math.floor(decimalNum / 2)} → resto = ${resto}`
      )
      decimalNum = Math.floor(decimalNum / 2)
    }

    let binarioFinal = restos.join("")

    passos.push(
      `<span style="color: red;">Lemos:</span> <span style="color: white;">${binarioFinal}<sub>2</sub></span>`
    )
    passos.push("OBS: A ordem que vai ficar começa por baixo")

    return {
      resultado: binarioFinal,
      detalhes: passos.join("<br>"),
    }
  }

  function calcularHexadecimal(numero) {
    let passos = []
    let restoArray = []
    let quociente = parseInt(numero, 10)

    if (quociente === 0) {
      return {
        resultado: "0",
        detalhes:
          '0 em decimal é 0 em hexadecimal<br><span style="color: red;">Lemos:</span> <span style="color: white;">0x0</span>',
      }
    }

    while (quociente >= 16) {
      let novoQuociente = Math.floor(quociente / 16)
      let resto = quociente % 16
      let restoHex = resto.toString(16).toUpperCase()
      let representacao =
        resto >= 10
          ? `- ${resto} é representado como ${restoHex} em hexadecimal.`
          : ""
      passos.push(
        `${quociente} ÷ 16 = ${novoQuociente} (quociente) → (16x${novoQuociente}) = ${
          novoQuociente * 16
        } - ${quociente} = ${resto} (resto) ${representacao}`
      )
      restoArray.push(restoHex)
      quociente = novoQuociente
    }

    let ultimoQuocienteHex = quociente.toString(16).toUpperCase()
    let representacaoFinal =
      quociente >= 10
        ? `${quociente} é representado como ${ultimoQuocienteHex} em hexadecimal.`
        : ""

    if (quociente > 0) {
      restoArray.push(ultimoQuocienteHex)
      passos.push(
        `Último quociente (${quociente}) → Primeiro dígito ${representacaoFinal}`
      )
    }

    passos.push(
      "Observamos que a ordem que vai ficar começa por baixo (o último quociente) e vai até o resto (subindo)."
    )

    let resultadoHex = restoArray.reverse().join("")
    passos.push(
      `<span style="color: red;">Lemos:</span> <span style="color: white;">0x${resultadoHex}</span>`
    )

    return {
      resultado: resultadoHex,
      detalhes: passos.join("<br>"),
    }
  }

  function confirmarNumero() {
    // Verificar se um número foi sorteado
    if (numeroSorteado === null) {
      alert("Primeiro, sorteie um número!")
      return
    }

    // Verificar se uma opção de conversão foi selecionada
    let checkedOption = obterOpcaoSelecionada()
    if (!checkedOption) {
      alert("Selecione um tipo de conversão!")
      return
    }

    const octalValue = resultInput.value.trim()
    let calculoDetalhado = ""

    if (checkedOption.nextSibling.textContent.includes("Octal para Decimal")) {
      let resultado = octalToDecimal(octalValue)
      respostaCorreta = resultado.resultado.toString()
      calculoDetalhado = resultado.detalhes
    } else if (
      checkedOption.nextSibling.textContent.includes("Octal para Binário")
    ) {
      let octalToDecimalResult = octalToDecimal(octalValue)
      let decimalValue = octalToDecimalResult.resultado
      let decimalToBinaryResult = calcularBinario(decimalValue)
      respostaCorreta = decimalToBinaryResult.resultado
      calculoDetalhado = `<span style="color: #00FF00; font-weight: bold; font-size: 16px;">PASSO 1: Octal para Decimal</span><br>${octalToDecimalResult.detalhes}<br><br><span style="color: #00FF00; font-weight: bold; font-size: 16px;">PASSO 2: Decimal para Binário</span><br>${decimalToBinaryResult.detalhes}`
    } else if (
      checkedOption.nextSibling.textContent.includes("Octal para Hexadecimal")
    ) {
      let octalToDecimalResult = octalToDecimal(octalValue)
      let decimalValue = octalToDecimalResult.resultado

      if (
        typeof decimalValue === "number" ||
        !isNaN(parseInt(decimalValue, 10))
      ) {
        let decimalToHexResult = calcularHexadecimal(decimalValue)
        respostaCorreta = decimalToHexResult.resultado
        calculoDetalhado = `<span style="color: #00FF00; font-weight: bold; font-size: 16px;">PASSO 1: Octal para Decimal</span><br>${octalToDecimalResult.detalhes}<br><br><span style="color: #00FF00; font-weight: bold; font-size: 16px;">PASSO 2: Decimal para Hexadecimal</span><br>${decimalToHexResult.detalhes}`
      } else {
        respostaCorreta = ""
        calculoDetalhado =
          "Erro na conversão octal para decimal: " +
          octalToDecimalResult.resultado
      }
    }

    let respostaUsuario = inputNumber.value.trim().toUpperCase()

    // Removendo qualquer prefixo "0X" ou "0x" da resposta do usuário para hexadecimal
    if (
      checkedOption.nextSibling.textContent.includes("Octal para Hexadecimal")
    ) {
      if (
        respostaUsuario.startsWith("0X") ||
        respostaUsuario.startsWith("0x")
      ) {
        respostaUsuario = respostaUsuario.substring(2)
      }
    }

    if (respostaUsuario === respostaCorreta) {
      inputNumber.style.backgroundColor = "green"
    } else {
      inputNumber.style.backgroundColor = "red"
      setTimeout(() => (inputNumber.style.backgroundColor = ""), 3000)
    }

    // Exibir a resposta correta com o prefixo para hexadecimal
    if (
      checkedOption.nextSibling.textContent.includes("Octal para Hexadecimal")
    ) {
      labelResposta.innerHTML = `<strong>Resposta:</strong> 0x${respostaCorreta}`
    } else {
      labelResposta.innerHTML = `<strong>Resposta:</strong> ${respostaCorreta}`
    }

    labelCalculo.innerHTML = `<span style="color: rgb(0, 255, 255);"><strong>CÁLCULO:</strong></span><br>${calculoDetalhado}`
  }

  function obterOpcaoSelecionada() {
    return Array.from(checkboxes).find((chk) => chk.checked)
  }

function Apagartudo() {
  // Limpa as entradas e saídas
  inputNumber.value = ""
  inputNumber.style.backgroundColor = ""
  resultInput.value = ""

  // Limpa os labels de cálculo e resposta
  labelResposta.innerHTML = "Resposta:"
  labelCalculo.innerHTML = ""

  // Desmarca todas as checkboxes
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false
  })

  console.log("Tudo foi apagado!")
}

  window.sortearNumero = sortearNumero
  window.confirmarNumero = confirmarNumero
  window.Apagartudo = Apagartudo // Expõe a função para o escopo global
})
