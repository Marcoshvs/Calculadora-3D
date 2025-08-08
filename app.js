function calcular() {
    const nomeOrcamento = document.getElementById('nomeOrcamento').value.trim();
    if (!nomeOrcamento) {
        alert("Por favor, preencha o nome do orçamento.");
        return;
    }

    // Pegar valores dos campos
    const custoEnergiaKWh = parseFloat(document.getElementById('custoEnergiaKWh').value);
    const potenciaW = 310;
    const precoFilamentoKg = parseFloat(document.getElementById('precoFilamentoKg').value);
    const custoEmbalagem = parseFloat(document.getElementById('custoEmbalagem').value);
    const margemLucroPercent = parseFloat(document.getElementById('margemLucro').value);
    const horas = parseFloat(document.getElementById('horas').value);
    const peso = parseFloat(document.getElementById('peso').value) / 1000; // converter g para kg
    const custosExtras = parseFloat(document.getElementById('custosExtras').value) || 0;

    const precoMaquina = 2100;
    const vidaUtilHoras = 5000;

    if (
        isNaN(custoEnergiaKWh) || custoEnergiaKWh < 0 ||
        isNaN(precoFilamentoKg) || precoFilamentoKg < 0 ||
        isNaN(custoEmbalagem) || custoEmbalagem < 0 ||
        isNaN(margemLucroPercent) || margemLucroPercent < 0 ||
        isNaN(horas) || horas < 0 ||
        isNaN(peso) || peso < 0
    ) {
        alert("Por favor, preencha todos os campos corretamente com valores positivos.");
        return;
    }

    // Cálculos
    const consumoKWh = (potenciaW / 1000) * horas;
    const custoEnergia = consumoKWh * custoEnergiaKWh;
    const custoFilamento = peso * precoFilamentoKg;
    const custoDepreciacao = (precoMaquina / vidaUtilHoras) * horas;

    let custoTotal = custoEnergia + custoFilamento + custoEmbalagem + custoDepreciacao + custosExtras;
    let precoVenda = custoTotal * (1 + margemLucroPercent / 100);

    // Mostrar resultado
    const resultadoHTML = `
        <p><b>Nome do Orçamento:</b> ${nomeOrcamento}</p>
        <p><b>Custo Total:</b> R$ ${custoTotal.toFixed(2)}</p>
        <p><b>Preço de Venda:</b> <span style="color:#00ffcc;">R$ ${precoVenda.toFixed(2)}</span></p>
    `;

    document.getElementById('resultado').innerHTML = resultadoHTML;

    salvarOrcamento({
        data: new Date().toLocaleString(),
        nome: nomeOrcamento,
        horas: horas,
        peso: peso * 1000,
        custoTotal: custoTotal,
        precoVenda: precoVenda,
        custosExtras: custosExtras
    });
}

function salvarOrcamento(orcamento) {
    let historico = JSON.parse(localStorage.getItem('orcamentos')) || [];
    historico.unshift(orcamento);
    if (historico.length > 50) historico.pop(); // limita a 50 orçamentos
    localStorage.setItem('orcamentos', JSON.stringify(historico));
    mostrarHistorico();
}

function mostrarHistorico() {
    let historico = JSON.parse(localStorage.getItem('orcamentos')) || [];
    let lista = document.getElementById('historico');
    lista.innerHTML = '';
    historico.forEach((o, i) => {
        let li = document.createElement('li');
        li.innerHTML = `<b>${o.nome}</b> — ${o.data} — ${o.horas}h, ${o.peso.toFixed(1)}g, Extras: R$${o.custosExtras.toFixed(2)} — Venda: R$${o.precoVenda.toFixed(2)}`;
        lista.appendChild(li);
    });
}

mostrarHistorico();