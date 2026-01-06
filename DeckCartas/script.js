const btnStart = document.querySelector("#btnStart");
const loading = document.querySelector("#loading");
const errorMsg = document.querySelector("#errorMsg");
const cardsContainer = document.querySelector("#cardsContainer");

// Função auxiliar genérica (Reutilizável)
async function fazerRequisicao(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
    }

    return await response.json();
}

btnStart.addEventListener("click", async () => {
    errorMsg.classList.add("hidden");
    cardsContainer.innerHTML = "";
    loading.classList.remove("hidden");
    btnStart.disabled = true; // Evita cliques duplos

    try {
        // O await aqui faz o código PARAR e esperar a resposta do servidor
        const deckData = await fazerRequisicao("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
        
        const deckId = deckData.deck_id;
        console.log(`Deck criado com ID: ${deckId}`);

        for (let i = 0; i < 5; i++) {
            
            const cardData = await fazerRequisicao(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            
            // A API retorna um array 'cards', pegamos a primeira (e única) carta
            const carta = cardData.cards[0];

            // Renderizar a carta na tela
            const img = document.createElement("img");
            img.src = carta.image;
            img.alt = `${carta.value} of ${carta.suit}`;
            img.className = "card-img"; 
            
            cardsContainer.appendChild(img);
        }

    } catch (error) {
        console.error(error);
        errorMsg.textContent = "Ocorreu um erro ao buscar as cartas. Tente novamente.";
        errorMsg.classList.remove("hidden");
    } finally {
        loading.classList.add("hidden");
        btnStart.disabled = false;
    }
});