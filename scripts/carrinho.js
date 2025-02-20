// Verifica se listaCardapio já existe no localStorage, se não, define a lista
if (!localStorage.getItem('listaCardapio')) {
    // Lista com os produtos do restaurante
    let listaCardapio = [
        { id: 1, nome: 'Pizza Marguerita', valor: 39.90, descricao: 'Molho artesanal, mussarela, tomate e manjericão.', imagem: 'imagens/exemplo_pizza1.png', quantidade: 10 },
        { id: 2, nome: 'Pizza Calabresa', valor: 42.90, descricao: 'Fatias de calabresa, cebola, queijo derretido e orégano.', imagem: 'imagens/exemplo_pizza1.png', quantidade: 10 },
        { id: 3, nome: 'Pizza Quatro Queijos', valor: 37.80, descricao: 'Mussarela, parmesão, gorgonzola e catupiry cremoso.', imagem: 'imagens/exemplo_pizza1.png', quantidade: 10 }
    ];

    localStorage.setItem('listaCardapio', JSON.stringify(listaCardapio));
}

// Recupera listaCardapio e listaCarrinho do localStorage
let listaCardapio = JSON.parse(localStorage.getItem('listaCardapio'))
let listaCarrinho = JSON.parse(localStorage.getItem('listaCarrinho')) || []

mostrarQuantidade()

// Apagar o item do carrinho
function apagarItem(id) {
    let listaCarrinho = JSON.parse(localStorage.getItem('listaCarrinho')) || []

    const itemIndex = listaCarrinho.findIndex(item => item.id == id)
    if (itemIndex !== -1) {
        listaCarrinho.splice(itemIndex, 1)
        localStorage.setItem('listaCarrinho', JSON.stringify(listaCarrinho))
    }
    mostrarQuantidade()
    renderizarCarrinho('listaCarrinho')
}

// Alterar quantidade de um produto do carrinho
function alterarQuantidade(id, delta) {
    let listaCarrinho = JSON.parse(localStorage.getItem('listaCarrinho')) || []

    const item = listaCarrinho.find(item => item.id == id)
    if (item) {
        item.quantidade += delta
        if (item.quantidade <= 0) {
            apagarItem(id)
            return
        }
    }
    localStorage.setItem('listaCarrinho', JSON.stringify(listaCarrinho))
    mostrarQuantidade()
    renderizarCarrinho('listaCarrinho')
}

// Calcular total de itens dinamicamente
function calcularTotalItens() {
    let listaCarrinho = JSON.parse(localStorage.getItem('listaCarrinho')) || []
    return listaCarrinho.reduce((acc, item) => acc + item.quantidade, 0)
}

// Mostrar quantidade de itens no carrinho
function mostrarQuantidade() {
    const quantidade = calcularTotalItens()
    const quantCarrinho = document.getElementById('QuantCarrinho')
    
    if (quantidade > 0) {
        quantCarrinho.innerHTML = `<p>Itens no Carrinho: ${quantidade}</p>`
        quantCarrinho.style.display = 'block' // Exibe o QuantCarrinho
    } else {
        quantCarrinho.style.display = 'none' // Esconde o QuantCarrinho
    }
}

// Renderizar lista do cardapio
function renderizarCardapio(containerId) {
    const lista = JSON.parse(localStorage.getItem('listaCardapio')) // Pega do localStorage
    const container = document.getElementById(containerId)
    container.innerHTML = ''

    lista.forEach(item => {
        const div = document.createElement('div')
        div.className = 'item'
        div.setAttribute('data-id', item.id)
        div.innerHTML = `
            <div class="item" data-id="${item.id}">
                <div class="produto" data-id="${item.id}">
                    <img src="${item.imagem}" alt="Imagem do produto">
                    <p class="nome">${item.nome}</p>
                    <p class="descricao">${item.descricao}</p>
                    <p class="preco">${item.valor}</p>
                </div>
            </div>
        `
        container.appendChild(div)
    })
}
// Renderizar lista do carrinho
function renderizarCarrinho(containerId) {
    const lista = JSON.parse(localStorage.getItem('listaCarrinho')) || []
    const container = document.getElementById(containerId)
    container.innerHTML = ''

    if (lista.length === 0) {
        container.innerHTML = `<p>Seu carrinho está vazio. Adicione itens!</p>` // Exibe mensagem se o carrinho estiver vazio
    } else {
        lista.forEach(item => {
            const divTotal = document.createElement('div')
            divTotal.className = 'item'
            divTotal.innerHTML = `
                <div class="item_detalhes">

                    <div class="item_detalhes_imagem">
                        <img src="${item.imagem}" alt="Imagem do produto">
                    </div>

                    <div class="item_detalhes_descricoes">
                        <h3>${item.nome}</h3>
                        <div class="item_detalhes_descricoes_quantidade">
                            <button class="botaoD" data-id="${item.id}">-</button>
                            <p class="ADQuantidade">${item.quantidade}</p>
                            <button class="botaoA" data-id="${item.id}">+</button>
                        </div>
                    </div>

                    <div class="item_detalhes_valor">
                        <p>${item.valor}</p>
                        <div class="botao_apagar" onclick="apagarItem(${item.id})">
                            <img src="imagens/lixeira.png" alt="apagar">
                        </div>
                    </div>

                </div>

                <div class="item_observacao">
                    <label for="observacao">Alguma observação?</label>
                    <textarea id="observacao" name="observacao" placeholder="Ex: Sem cebola, ponto da carne, etc."></textarea>
                </div>
            `
            container.appendChild(divTotal)
        })

        document.querySelectorAll('.botaoA').forEach(botao => {
            botao.onclick = () => alterarQuantidade(botao.dataset.id, 1)
        })

        document.querySelectorAll('.botaoD').forEach(botao => {
            botao.onclick = () => alterarQuantidade(botao.dataset.id, -1)
        })
    }
}

// Mover item para lista do carrinho
function moverItem(id) {
    // Verifica o conteúdo de listaCardapio no localStorage
    let listaCardapio = JSON.parse(localStorage.getItem('listaCardapio'))
    let listaCarrinho = JSON.parse(localStorage.getItem('listaCarrinho')) || []

    // Verifica se o item existe no cardápio
    const item = listaCardapio.find(item => item.id === id)
    if (item) {
        const itemCarrinho = listaCarrinho.find(item => item.id === id)

        if (itemCarrinho) {
            // Se o item já estiver no carrinho, apenas aumenta a quantidade
            itemCarrinho.quantidade += 1
        } else {
            // Se o item não estiver no carrinho, adiciona um novo item com quantidade 1
            listaCarrinho.push({ ...item, quantidade: 1 })
        }

        // Atualiza o localStorage com a nova lista do carrinho
        localStorage.setItem('listaCarrinho', JSON.stringify(listaCarrinho))

        // Se quiser também atualizar a quantidade do item no cardápio, faça isso:
        item.quantidade -= 1 // Diminui a quantidade do item no cardápio (ou conforme sua lógica de estoque)

        // Atualiza o localStorage com a lista atualizada do cardápio
        localStorage.setItem('listaCardapio', JSON.stringify(listaCardapio))

        // Atualiza o QuantCarrinho automaticamente
        mostrarQuantidade()
    }
}

// Página 1 (Lista Cardapio)
if (document.getElementById('listaCardapio')) {
    renderizarCardapio('listaCardapio')

    document.getElementById('listaCardapio').addEventListener('click', (event) => {
        const itemDiv = event.target.closest('.item')
        if (itemDiv) {
            const itemId = parseInt(itemDiv.dataset.id, 10)
            moverItem(itemId)
            renderizarCardapio('listaCardapio')  // Re-renderiza o cardápio para atualizar a exibição
        }
    })
}

// Página 2 (Lista Carrinho)
if (document.getElementById('listaCarrinho')) {
    renderizarCarrinho('listaCarrinho')
}
