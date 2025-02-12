// Verifica se listaOriginal já existe no localStorage, se não, define a lista
if (!localStorage.getItem('listaOriginal')) {
    let listaOriginal = [
        { id: 1, nome: 'Item 1', quantidade: 0 },
        { id: 2, nome: 'Item 2', quantidade: 0 },
        { id: 3, nome: 'Item 3', quantidade: 0 }
    ];
    localStorage.setItem('listaOriginal', JSON.stringify(listaOriginal));
}

// Recupera listaOriginal e listaDestino do localStorage
let listaOriginal = JSON.parse(localStorage.getItem('listaOriginal'));
let listaDestino = JSON.parse(localStorage.getItem('listaDestino')) || [];

mostrarQuantidade();

// Apagar item
function apagarItem(id) {
    let listaDestino = JSON.parse(localStorage.getItem('listaDestino')) || [];
    
    const itemIndex = listaDestino.findIndex(item => item.id == id);
    if (itemIndex !== -1) {
        listaDestino.splice(itemIndex, 1);
        localStorage.setItem('listaDestino', JSON.stringify(listaDestino));
    }
    mostrarQuantidade();
    renderizarLista2('lista2');
}

// Alterar quantidade
function alterarQuantidade(id, delta) {
    let listaDestino = JSON.parse(localStorage.getItem('listaDestino')) || [];

    const item = listaDestino.find(item => item.id == id);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            apagarItem(id);
            return;
        }
    }
    localStorage.setItem('listaDestino', JSON.stringify(listaDestino));
    mostrarQuantidade();
    renderizarLista2('lista2');
}

// Calcular total de itens dinamicamente
function calcularTotalItens() {
    let listaDestino = JSON.parse(localStorage.getItem('listaDestino')) || [];
    return listaDestino.reduce((acc, item) => acc + item.quantidade, 0);
}

// Mostrar quantidade de itens
function mostrarQuantidade() {
    document.getElementById('QuantCarrinho').innerHTML = `<p>Item: ${calcularTotalItens()}</p>`;
}

// Renderizar lista original
function renderizarLista1(containerId) {
    const lista = JSON.parse(localStorage.getItem('listaOriginal')); // Pega do localStorage
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    lista.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = item.nome;
        div.dataset.id = item.id;
        container.appendChild(div);
    });
}

// Renderizar lista \
function renderizarLista2(containerId) {
    const lista = JSON.parse(localStorage.getItem('listaDestino')) || [];
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    lista.forEach(item => {
        const divTotal = document.createElement('div');
        divTotal.className = 'divTotal';

        divTotal.innerHTML = `
            <div class="item">${item.nome}</div>
            <button class="botaoX" onclick="apagarItem(${item.id})">X</button>
            <div class="divAD">
                <button class="botaoD" data-id="${item.id}">-</button>
                <p class="ADQuantidade">${item.quantidade}</p>
                <button class="botaoA" data-id="${item.id}">+</button>
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

// Mover item para lista de destino
function moverItem(id) {
    let lista = JSON.parse(localStorage.getItem('listaOriginal'));
    let listaDestino = JSON.parse(localStorage.getItem('listaDestino')) || [];

    const itemOriginal = lista.find(item => item.id === id);
    if (itemOriginal) {
        const itemDestino = listaDestino.find(item => item.id === id);
        if (itemDestino) {
            itemDestino.quantidade += 1;
        } else {
            listaDestino.push({ ...itemOriginal, quantidade: 1 });
        }
        localStorage.setItem('listaDestino', JSON.stringify(listaDestino));
    }
    mostrarQuantidade();
}

// Página 1 (Lista Original)
if (document.getElementById('lista1')) {
    renderizarLista1('lista1');
    document.getElementById('lista1').addEventListener('click', (event) => {
        if (event.target.classList.contains('item')) {
            const itemId = parseInt(event.target.dataset.id, 10);
            moverItem(itemId);
        }
    });
}

// Página 2 (Lista Destino)
if (document.getElementById('lista2')) {
    renderizarLista2('lista2');
}