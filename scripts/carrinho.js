// Verifica se listaCardapio já existe no localStorage, se não, define a lista
if (!localStorage.getItem('listaCardapio')) {
    // Lista com os produtos do restaurante
    let listaCardapio = [
        {
            id: 1, nome: 'Pizza Marguerita', valor: 39.90, descricao: 'Molho artesanal, mussarela, tomate e manjericão.',
            imagem: 'imagens/exemplo_pizza1.png', quantidade: 0, tag: 'Salgada'
        },

        {
            id: 2, nome: 'Pizza Calabresa', valor: 42.90, descricao: 'Fatias de calabresa, cebola, queijo derretido e orégano.',
            imagem: 'imagens/exemplo_pizza1.png', quantidade: 0, tag: 'Calabresa Salgada'
        },

        {
            id: 3, nome: 'Pizza Quatro Queijos', valor: 37.80, descricao: 'Mussarela, parmesão, gorgonzola e catupiry cremoso.',
            imagem: 'imagens/exemplo_pizza1.png', quantidade: 0, tag: 'Queijo Salgada'
        },

        {
            id: 4, nome: 'Pizza de Chocolate', valor: 35.50, descricao: 'Delicioso creme de chocolate, morangos frescos e raspas de chocolate branco.',
            imagem: 'imagens/exemplo_pizza1.png', quantidade: 0, tag: 'Doce'
        }

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
        // Atualiza a quantidade do item
        item.quantidade += delta

        // Se a quantidade for menor ou igual a 0, remove o item do carrinho
        if (item.quantidade <= 0) {
            apagarItem(id)
            return
        }
    }

    // Atualiza o carrinho no localStorage
    localStorage.setItem('listaCarrinho', JSON.stringify(listaCarrinho))

    // Atualiza a tela com a nova quantidade
    mostrarQuantidade()
    renderizarCarrinho('listaCarrinho') // Re-renderiza o carrinho, mas agora sem duplicar os itens
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
// Adicionar evento para busca
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('botaoPesquisa').addEventListener('click', () => {
        const termoPesquisa = document.getElementById('inputPesquisa').value.trim().toLowerCase();
        renderizarCardapio('listaCardapio', null, termoPesquisa);
    });
});

// Modificar a função renderizarCardapio para aceitar busca
function renderizarCardapio(containerId, filtro = null, termoPesquisa = '') {
    let lista = JSON.parse(localStorage.getItem('listaCardapio')) || []
    const container = document.getElementById(containerId)
    container.innerHTML = ''

    // Filtrar por categoria se houver filtro selecionado
    if (filtro) {
        lista = lista.filter(item => item.tag.toLowerCase().includes(filtro.toLowerCase()))
    }

    // Filtrar por pesquisa no nome ou descrição
    if (termoPesquisa) {
        lista = lista.filter(item =>
            item.nome.toLowerCase().includes(termoPesquisa) ||
            item.descricao.toLowerCase().includes(termoPesquisa)
        )
    }

    // Renderizar os itens filtrados
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
                    <button class="botaoEnviar"">Enviar para o carrinho</button>
                </div>
            </div>
        `
        container.appendChild(div)
    })
}

// Adicionar evento aos botões de filtro
document.querySelectorAll('.filtro').forEach(botao => {
    botao.addEventListener('click', () => {
        const filtroSelecionado = botao.textContent.trim()
        renderizarCardapio('listaCardapio', filtroSelecionado)
    })
})

// Renderizar o cardápio inicialmente
if (document.getElementById('listaCardapio')) {
    renderizarCardapio('listaCardapio')
}

// Salvar observações no localStorage sempre que forem digitadas
document.addEventListener('input', (event) => {
    if (event.target.classList.contains('observacao-input')) {
        let listaCarrinho = JSON.parse(localStorage.getItem('listaCarrinho')) || [];
        const itemId = parseInt(event.target.dataset.id, 10);
        const item = listaCarrinho.find(i => i.id === itemId);

        if (item) {
            item.observacao = event.target.value;
            localStorage.setItem('listaCarrinho', JSON.stringify(listaCarrinho));
        }
    }
});

// Renderizar lista do carrinho
function renderizarCarrinho(containerId) {
    const lista = JSON.parse(localStorage.getItem('listaCarrinho')) || [];
    const container = document.getElementById(containerId);

    container.innerHTML = ''; // Limpa o conteúdo do carrinho para evitar duplicação

    if (lista.length === 0) {
        container.innerHTML = `<p>Seu carrinho está vazio. Adicione itens!</p>`;
    } else {
        lista.forEach(item => {
            const divTotal = document.createElement('div');
            divTotal.className = 'item';

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
                    <label for="observacao_${item.id}">Alguma observação?</label>
                    <textarea class="observacao-input" data-id="${item.id}" placeholder="Ex: Sem cebola, ponto da carne, etc.">${item.observacao || ''}</textarea>
                </div>
            `;
            container.appendChild(divTotal);
        });

        document.querySelectorAll('.botaoA').forEach(botao => {
            botao.onclick = () => alterarQuantidade(botao.dataset.id, 1);
        });

        document.querySelectorAll('.botaoD').forEach(botao => {
            botao.onclick = () => alterarQuantidade(botao.dataset.id, -1);
        });
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
        if (event.target.classList.contains('botaoEnviar')) {
            const itemDiv = event.target.closest('.item')
            if (itemDiv) {
                const itemId = parseInt(itemDiv.dataset.id, 10)
                moverItem(itemId)
                renderizarCardapio('listaCardapio')  // Re-renderiza o cardápio para atualizar a exibição
            }
        }
    })
}


// Página 2 (Lista Carrinho)
if (document.getElementById('listaCarrinho')) {
    renderizarCarrinho('listaCarrinho')
}

// Função para processar o pedido quando o botão "Enviar" for clicado
document.querySelector('.botao_enviar').addEventListener('click', (event) => {
    // Prevenir o comportamento padrão (como o envio de um formulário)
    event.preventDefault();

    // Coletar a lista de itens do carrinho
    let listaCarrinho = JSON.parse(localStorage.getItem('listaCarrinho')) || [];

    // Criar um array para armazenar os objetos do pedido com observações
    let pedidoItens = listaCarrinho.map(item => {
        // Coletar a observação do item, se houver
        const observacao = document.querySelector(`#observacao[data-id="${item.id}"]`)?.value || ''; // Pode estar vazio

        return {
            id: item.id,
            nome: item.nome,
            quantidade: item.quantidade,
            valor: item.valor,
            observacao: observacao // Adiciona a observação
        };
    });

    // Coletar os dados da seção de detalhes do pedido
    const nome = document.getElementById('nome').value;
    const tipoPedido = document.querySelector('input[name="tipoPedido"]:checked').value;
    const endereco = document.getElementById('endereco').value;

    // Criar o objeto final do pedido com os dados do cliente e do pedido
    const pedido = {
        cliente: {
            nome: nome,
            tipoPedido: tipoPedido,
            endereco: endereco
        },
        itens: pedidoItens
    };

    // Apenas exibir os dados no console (não enviar)
    console.log('Pedido preparado:', pedido);

    // Ação para limpar o carrinho, se desejar
    // localStorage.removeItem('listaCarrinho');
});


// Função para enviar os itens do carrinho para o WhatsApp
function enviarCarrinhoParaWhatsApp() {
    const listaCarrinho = JSON.parse(localStorage.getItem('listaCarrinho')) || [];

    // Verifique se há itens no carrinho
    if (listaCarrinho.length > 0) {
        let mensagem = 'Olá! Gostaria de pedir os seguintes produtos:\n\n';

        // Para cada item no carrinho, adicione as informações (nome, quantidade, preço, observação)
        listaCarrinho.forEach(item => {
            const observacao = document.getElementById(`observacao_${item.id}`).value || 'Sem observação';
            mensagem += `
            Produto: ${item.nome}
            Quantidade: ${item.quantidade}
            Preço: R$ ${item.valor}
            Observação: ${observacao}
            -------------------------
            `;
        });

        // Codifique a mensagem para ser usada na URL
        const mensagemCodificada = encodeURIComponent(mensagem.trim());

        // Número de telefone do WhatsApp
        const numeroWhatsApp = "5569993060826";

        // Crie o link do WhatsApp com a mensagem
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

        // Abra o WhatsApp com a mensagem pré-preenchida
        window.open(urlWhatsApp, "_blank");
    } else {
        alert('O carrinho está vazio!');
    }
}

// Função para renderizar os itens do carrinho
function enviarCarrinhoParaWhatsApp() {
    const listaCarrinho = JSON.parse(localStorage.getItem('listaCarrinho')) || [];

    // Verifique se há itens no carrinho
    if (listaCarrinho.length > 0) {
        // Captura os detalhes do pedido
        const nome = document.getElementById('nome').value || 'Não informado';
        const tipoPedido = document.querySelector('input[name="tipoPedido"]:checked').value;
        const endereco = document.getElementById('endereco').value || 'Não informado';

        // Cria a mensagem
        let mensagem = `Olá, gostaria de realizar o seguinte pedido:\n\n`;

        // Adiciona os detalhes do pedido
        mensagem += `Detalhes do Pedido:\n`;
        mensagem += `Nome: ${nome}\n`;
        mensagem += `Tipo de pedido: ${tipoPedido}\n`;
        mensagem += `Endereço: ${endereco}\n\n`;

        // Para cada item no carrinho, adicione as informações (nome, quantidade, preço, observação)
        listaCarrinho.forEach(item => {
            // Captura a observação diretamente do item salvo no localStorage
            const observacao = item.observacao || 'Sem observação';
        
            mensagem += `
            Produto: ${item.nome}
            Quantidade: ${item.quantidade}
            Preço: R$ ${item.valor}
            Observação: ${observacao}
            -------------------------
            `;
        });
        

        // Codifique a mensagem para ser usada na URL
        const mensagemCodificada = encodeURIComponent(mensagem.trim());

        // Número de telefone do WhatsApp
        const numeroWhatsApp = "5569993060826";

        // Crie o link do WhatsApp com a mensagem
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

        // Abra o WhatsApp com a mensagem pré-preenchida
        window.open(urlWhatsApp, "_blank");
    } else {
        alert('O carrinho está vazio!');
    }
}

// Adicionar evento ao botão de envio
document.getElementById('enviarCarrinho').addEventListener('click', enviarCarrinhoParaWhatsApp);

