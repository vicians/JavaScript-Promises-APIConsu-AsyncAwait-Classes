const cepInput = document.querySelector("#cepInput");
const btnConsultar = document.querySelector("#btnConsultar");
const resultContainer = document.querySelector("#resultContainer"); 
const errorMsg = document.querySelector("#errorMsg");
const resLogradouro = document.querySelector("#resLogradouro");
const resBairro = document.querySelector("#resBairro");
const resCidade = document.querySelector("#resCidade");
const resEstado = document.querySelector("#resEstado");
const resLat = document.querySelector("#resLat");
const resLng = document.querySelector("#resLng");
const btnMap = document.querySelector("#btnMap");
const mapContainer = document.querySelector("#mapContainer");


async function consultarCep() {
    const cep = cepInput.value.replace(/\D/g, '');
    
    errorMsg.classList.add('hidden');
    resultContainer.classList.add('hidden');

    if (cep.length !== 8) {
        errorMsg.textContent = "CEP inválido. Deve conter 8 dígitos.";
        errorMsg.classList.remove('hidden');
        return;
    }


    document.body.classList.add('loading');
    btnConsultar.disabled = true;


    try {

        const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
        
        if (!response.ok) {
            throw new Error("CEP não encontrado.");
        }

        const data = await response.json();


        resLogradouro.textContent = data.street;
        resBairro.textContent = data.neighborhood;
        resCidade.textContent = data.city;
        resEstado.textContent = data.state;

        const lat = data.location.coordinates.latitude;
        const lng = data.location.coordinates.longitude;

        resLat.textContent = lat;
        resLng.textContent = lng;

        // Mostrar a div de resultados
        resultContainer.classList.remove('hidden');

        // (Opcional) Guardar lat/lng em variáveis globais ou atributos para usar no botão do mapa depois
        btnMap.dataset.lat = lat;
        btnMap.dataset.lng = lng;

    } catch (error) {
        console.error(error);
        errorMsg.textContent = "Erro ao consultar CEP. Verifique o número digitado.";
        errorMsg.classList.remove('hidden');
    } finally {
        document.body.classList.remove('loading');
        btnConsultar.disabled = false;
    }
}


function exibirMapa() {
    const lat = btnMap.dataset.lat;
    const lng = btnMap.dataset.lng;

    // Segurança: se não tiver coordenadas, não faz nada
    if (!lat || !lng) {
        alert("Coordenadas não disponíveis para este local.");
        return;
    }

    
    const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=pt&z=14&output=embed`;

    // Cria o elemento iframe via JavaScript
    const iframe = document.createElement('iframe');
    iframe.src = mapUrl;
    iframe.width = "100%";
    iframe.height = "300";
    iframe.style.border = "0";
    iframe.allowFullscreen = true;

    mapContainer.innerHTML = ''; 
    mapContainer.appendChild(iframe);

    mapContainer.classList.remove('hidden');
}

btnMap.addEventListener("click", exibirMapa);

btnConsultar.addEventListener("click", consultarCep)