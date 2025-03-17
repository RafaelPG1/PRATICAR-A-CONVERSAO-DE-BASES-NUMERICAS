document.addEventListener("DOMContentLoaded", function () {
  let numeroSorteado = null
  let respostaCorreta = ""

  const maxNumberInput = document.getElementById("max-number")
  const resultInput = document.getElementById("result")
  const inputNumber = document.getElementById("input-number")
  const checkboxes = document.querySelectorAll(".checkbox")
  const labelResposta = document.createElement("label")
  const labelCalculo = document.createElement("div")
  const labelObs = document.createElement("div")

  labelResposta.innerText = "Resposta:"
  labelResposta.style.fontWeight = "bold"
  labelResposta.style.marginTop = "10px"
  labelResposta.style.color = "red" // Adicionando cor vermelha para "Resposta:"

  labelCalculo.style.fontWeight = "bold"
  labelCalculo.style.marginTop = "10px"
  labelCalculo.style.lineHeight = "1.8" // Ajuste o valor conforme necessário

  labelObs.style.fontWeight = "bold"
  labelObs.style.marginTop = "10px"
  labelCalculo.style.whiteSpace = "pre-line"

  document.body.appendChild(labelResposta)
  document.body.appendChild(labelCalculo)
  document.body.appendChild(labelObs)

  function sortearNumero() {
    let checkedOption = obterOpcaoSelecionada()

    const maxNumber = parseInt(maxNumberInput.value, 10) || 99
    numeroSorteado = Math.floor(Math.random() * maxNumber) + 1
    resultInput.value = numeroSorteado
    inputNumber.value = ""
    labelCalculo.innerText = ""
    labelObs.innerText = ""

    if (
      checkedOption.nextSibling.textContent.includes("Decimal para binário")
    ) {
      respostaCorreta = numeroSorteado.toString(2)
    } else if (
      checkedOption.nextSibling.textContent.includes("Decimal para Hexadecimal")
    ) {
      respostaCorreta = numeroSorteado.toString(16).toUpperCase() // Removido o prefixo "0x" aqui
    } else if (
      checkedOption.nextSibling.textContent.includes("Decimal para Octal")
    ) {
      respostaCorreta = numeroSorteado.toString(8)
    }
  }

  function calcularBinario(numero) {
    let passos = ["Decimal para Binário:"]
    while (numero >= 2) {
      let quociente = Math.floor(numero / 2)
      let resto = numero % 2
      passos.push(`${numero} ÷ 2 = ${quociente} → resto = ${resto}`)
      numero = quociente
    }
    passos.push(`Último quociente (${numero}) → Primeiro dígito`)
    passos.push(
      `<span style="color: red;">Lemos:</span> <span style="color: white;">${(respostaCorreta =
        numeroSorteado.toString(
          2
        ))}<span style="font-size: 60%; vertical-align: bottom;">2</span></span>`
    )

    return passos.join("\n")
  }

  function calcularHexadecimal(numero) {
    let passos = []
    let restoArray = []
    let quociente = numero

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
    restoArray.push(ultimoQuocienteHex)
    passos.push(
      `Último quociente (${quociente}) → Primeiro dígito ${representacaoFinal}`
    )
    passos.push(
      "Observamos que a ordem que vai ficar começa por baixo (o último quociente) e vai até o resto (subindo)."
    )
    let resultadoHex = restoArray.reverse().join("")
    passos.push(
      `<span style="color: red;">Lemos:</span> <span style="color: white;">0x${resultadoHex}</span>`
    )

    return passos.join("\n")
  }

  function calcularOctal(numero) {
    let passos = []
    let restoArray = []
    let quociente = numero

    // Calcula os quocientes e restos e armazena-os
    while (quociente >= 8) {
      let novoQuociente = Math.floor(quociente / 8)
      let resto = quociente % 8
      passos.push(
        `${quociente} ÷ 8 = ${novoQuociente} (quociente) → (8x${novoQuociente}) = ${
          novoQuociente * 8
        } - ${quociente} = ${resto} (resto)`
      )
      restoArray.push(resto)
      quociente = novoQuociente
    }

    // Adiciona o último quociente
    restoArray.push(quociente)

    // Observa a ordem e converte para octal
    passos.push(`Último quociente (${quociente}) → primeiro dígito`)
    passos.push(
      `Observamos que a ordem que vai ficar começa por baixo (o último quociente) e vai até o resto (subindo).`
    )
    let resultadoOctal = restoArray.reverse().join("")
    passos.push(
      `<span style="color: red;">Lemos:</span> <span style="color: white;"><strong>${resultadoOctal}<span style="font-size: 60%; vertical-align: bottom;">8</span></strong></span>`
    )
    return passos.join("\n")
  }

  // Exemplos de uso:
  console.log(calcularOctal(60))
  console.log(calcularOctal(98))

  function confirmarNumero() {
    if (numeroSorteado === null) {
      alert("Primeiro, sorteie um número!")
      return
    }

    let checkedOption = obterOpcaoSelecionada()
    if (!checkedOption) {
      alert("Selecione um tipo de conversão!")
      return
    }

    // Definir resposta correta com base na conversão escolhida
    if (
      checkedOption.nextSibling.textContent.includes("Decimal para binário")
    ) {
      respostaCorreta = numeroSorteado.toString(2)
    } else if (
      checkedOption.nextSibling.textContent.includes("Decimal para Hexadecimal")
    ) {
      respostaCorreta = numeroSorteado.toString(16).toUpperCase() // Removido o prefixo "0x" aqui
    } else if (
      checkedOption.nextSibling.textContent.includes("Decimal para Octal")
    ) {
      respostaCorreta = numeroSorteado.toString(8)
    }

    let respostaUsuario = inputNumber.value.trim().toUpperCase()

    // Removendo qualquer prefixo "0X" ou "0x" da resposta do usuário para hexadecimal
    if (
      checkedOption.nextSibling.textContent.includes("Decimal para Hexadecimal")
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
      checkedOption.nextSibling.textContent.includes("Decimal para Hexadecimal")
    ) {
      labelResposta.textContent = `Resposta: 0x${respostaCorreta}`
    } else {
      labelResposta.textContent = `Resposta: ${respostaCorreta}`
    }

    if (
      checkedOption.nextSibling.textContent.includes("Decimal para binário")
    ) {
      labelCalculo.innerHTML = `<span style="color: rgb(0, 255, 255);">CÁLCULO:</span><br>${calcularBinario(
        numeroSorteado
      ).replace(/\n/g, "<br>")}`
      labelObs.textContent = "OBS: A ordem que vai ficar começa por baixo"
    } else if (
      checkedOption.nextSibling.textContent.includes("Decimal para Hexadecimal")
    ) {
      labelCalculo.innerHTML = `<span style="color: rgb(0, 255, 255);">CÁLCULO:</span><br>${calcularHexadecimal(
        numeroSorteado
      ).replace(/\n/g, "<br>")}`
      labelObs.textContent = ""
    } else if (
      checkedOption.nextSibling.textContent.includes("Decimal para Octal")
    ) {
      labelCalculo.innerHTML = `<span style="color: rgb(0, 255, 255);">CÁLCULO:</span><br>${calcularOctal(
        numeroSorteado
      ).replace(/\n/g, "<br>")}`
      labelObs.textContent = ""
    }
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
    labelObs.textContent = ""

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
