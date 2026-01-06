# 🚀 JavaScript Study Projects

Este repositório contém uma coleção de exercícios práticos focados em **JavaScript Vanilla**, **Consumo de APIs** e **Orientação a Objetos**. O objetivo foi consolidar o aprendizado sobre assincronismo, manipulação do DOM e arquitetura de código limpo (separando HTML, CSS e JS).

## 🛠️ Tecnologias Utilizadas

* **HTML5** (Semântico)
* **CSS3** (Grid, Flexbox, Animações simples)
* **JavaScript** (ES6+, Fetch API, Async/Await, Classes)

---

## 📂 Projetos

### 1. 📍 Buscador de CEP com Mapa
Aplicação para consulta de endereços via CEP.
* **Funcionalidades:**
    * Validação de entrada (apenas números, 8 dígitos).
    * Consumo da **BrasilAPI** para obter endereço e coordenadas (Lat/Lon).
    * Geração dinâmica de `iframe` com o Google Maps baseado nas coordenadas retornadas.
    * Feedback visual de "Carregando" e tratamento de erros.

### 2. 🌦️ Previsão do Tempo (Selects Dependentes)
Sistema para verificar a previsão do tempo de qualquer cidade do Brasil.
* **Funcionalidades:**
    * Consumo da API do **IBGE** para listar Estados e Municípios.
    * Lógica de **Selects Encadeados**: As cidades só carregam após a escolha do Estado.
    * Consumo da API do **INMET** para previsão meteorológica.
    * Implementação de **Debounce**: Evita requisições excessivas (Erro 429) enquanto o usuário navega pela lista de cidades.
    * Uso estrito de `Promises` (.then/.catch) sem async/await (conforme desafio).

### 3. 🃏 Deck of Cards (Async Flow)
Manipulação de baralho virtual para estudo de fluxos assíncronos.
* **Funcionalidades:**
    * Consumo da **Deck of Cards API**.
    * **Modo Sequencial:** Uso de `for` loop com `await` para sacar cartas uma a uma (efeito visual progressivo).
    * **Modo Paralelo:** Uso de `Promise.all` para disparar múltiplas requisições simultâneas.

### 4. ⚔️ Classes RPG (Avatar, Cowboy e Mago)
Simulação de um jogo de plataforma utilizando Programação Orientada a Objetos (POO).
* **Conceitos Aplicados:**
    * **Classes e Construtores:** Criação da classe base `Avatar`.
    * **Encapsulamento:** Uso de atributos "privados" (convenção `_atributo`) e Getters.
    * **Herança (`extends`):** Subclasses `Cowboy` e `Mago` herdando movimentação e vida.
    * **Polimorfismo:** Sobrescrita do método `attack()` para comportamentos diferentes (uso de munição vs. feitiços).
    * **Lógica de Jogo:** Controle de munição, cooldown de feitiços e bloqueio de ações após a "morte" do personagem.

---

## 🎨 Padrões de Projeto

Em todos os exercícios, foi mantida a estrutura de arquivos separados para garantir a manutenibilidade:

```text
/projeto
│
├── index.html   # Apenas estrutura e marcação
├── style.css    # Apenas estilos e layouts
└── script.js    # Lógica, eventos e requisições