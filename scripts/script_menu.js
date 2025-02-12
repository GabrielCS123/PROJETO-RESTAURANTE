document.addEventListener('DOMContentLoaded', () => {
    // Seletores
    const botaoMenu = document.querySelector('.botao_menu'); // Botão para abrir o menu
    const botaoFecharMenu = document.querySelector('.menu_mobile div'); // Botão para fechar o menu
    const main = document.querySelector('main'); // Elemento principal
    const header = document.querySelector('header'); // Cabeçalho
    const menuMobile = document.querySelector('.menu_mobile'); // Menu móvel

    // Função para abrir o menu
    const abrirMenu = () => {
        main.style.display = 'none'; // Esconde o main
        header.style.display = 'none'; // Esconde o header
        menuMobile.style.display = 'block'; // Mostra o menu mobile
    };

    // Função para fechar o menu
    const fecharMenu = () => {
        main.style.display = ''; // Restaura o display padrão do main
        header.style.display = ''; // Restaura o display padrão do header
        menuMobile.style.display = 'none'; // Esconde o menu mobile
    };

    // Adicionar os eventos de clique
    botaoMenu.addEventListener('click', abrirMenu);
    botaoFecharMenu.addEventListener('click', fecharMenu);
});
