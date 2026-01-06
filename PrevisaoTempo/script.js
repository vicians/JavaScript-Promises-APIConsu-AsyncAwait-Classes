const ufSelect = document.querySelector("#ufSelect");
const cidadeSelect = document.querySelector("#cidadeSelect");
const errorMsg = document.querySelector("#errorMsg");
const loadingMsg = document.querySelector("#loadingMsg");
const previsaoContainer = document.querySelector("#previsaoContainer");

// Função auxiliar para requisições
function fazerFetch(url) {
    return fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erro na requisição: ${res.status}`);
            }
            return res.json();
        });
}

function carregarUfs() {
    fazerFetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
        .then(estados => {
            estados.sort((a, b) => a.nome.localeCompare(b.nome));
            
            estados.forEach(estado => {
                const option = document.createElement("option");
                option.value = estado.id; 
                option.textContent = estado.nome;
                ufSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error(error);
            errorMsg.textContent = "Erro ao carregar estados.";
            errorMsg.classList.remove('hidden');
        });
}

carregarUfs();

ufSelect.addEventListener("change", () => {
    const ufId = ufSelect.value;
    
    cidadeSelect.innerHTML = '<option value="">Selecione a cidade...</option>';
    previsaoContainer.innerHTML = '';
    previsaoContainer.classList.add('hidden');
    errorMsg.classList.add('hidden');

    if (ufId) {
        cidadeSelect.disabled = true;
        carregarCidades(ufId); 
    } else {
        cidadeSelect.disabled = true;
    }
});

function carregarCidades(ufId) {
    fazerFetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios`)
        .then(cidades => {
            cidades.sort((a, b) => a.nome.localeCompare(b.nome));
            
            cidades.forEach(cidade => {
                const option = document.createElement("option");
                option.value = cidade.id; 
                option.textContent = cidade.nome;
                cidadeSelect.appendChild(option);
            });
            cidadeSelect.disabled = false;
        })
        .catch(error => {
            console.error(error);
            errorMsg.textContent = "Erro ao carregar cidades.";
            errorMsg.classList.remove('hidden');
        });
}

// 4. Evento de troca de Cidade
cidadeSelect.addEventListener("change", () => {
    const cidadeId = cidadeSelect.value;
    
    errorMsg.classList.add('hidden');
    previsaoContainer.innerHTML = '';
    previsaoContainer.classList.add('hidden');

    if (cidadeId) {
        loadingMsg.classList.remove('hidden');
        carregarPrevisao(cidadeId);
    }
});

function carregarPrevisao(cidadeId) {
    fazerFetch(`https://apiprevmet3.inmet.gov.br/previsao/${cidadeId}`)
        .then(dados => {
            const previsoesObj = dados[cidadeId];
            
            // Transforma as chaves (datas) em array e pega os 4 primeiros
            const datas = Object.keys(previsoesObj).slice(0, 4);

            datas.forEach(data => {
                const dadosDia = previsoesObj[data];

              
                const parteDia = dadosDia.tarde || dadosDia.manha || dadosDia.noite;

             
                if (!parteDia) return;

                const card = document.createElement('div');
                card.className = 'forecast-card';

                // Helpers para formatar dia da semana e ícone
                const diaSemana = getDiaSemana(data);
                
                card.innerHTML = `
                    <div class="card-date">${data}</div>
                    <div class="card-day">${diaSemana}</div>
                    <div class="card-icon">
                        <img src="${parteDia.icone}" alt="${parteDia.resumo}">
                    </div>
                    <div class="temp-range">
                        <span class="min">Min: ${parteDia.temp_min}°C</span>
                        <span class="max">Max: ${parteDia.temp_max}°C</span>
                    </div>
                    <div class="period-details">
                        <div class="period-title">Resumo:</div>
                        <div>${parteDia.resumo}</div>
                    </div>
                `;

                previsaoContainer.appendChild(card);
            });

            previsaoContainer.classList.remove('hidden');
        })
        .catch(error => {
            console.error(error);
            errorMsg.textContent = "Não foi possível obter a previsão para esta cidade.";
            errorMsg.classList.remove('hidden');
        })
        .finally(() => {
            loadingMsg.classList.add('hidden');
        });
}


function getDiaSemana(dataStr) {
    const partes = dataStr.split('/');
    // Cria data no formato ISO para o JS entender: yyyy-mm-dd
    const dataObj = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
    
    // O 'utc' ajuda a não dar problema de fuso horário pegando o dia anterior
    const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'long', timeZone: 'UTC' });
    return diaSemana;
}