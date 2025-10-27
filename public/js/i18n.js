let translations = {};

// Lista de páginas HTML que NÃO possuem um arquivo de tradução próprio 
// e que, portanto, o fetch deve ser ignorado para evitar o erro 404/SyntaxError.
const PAGE_EXCEPTIONS = ['cones']; // Exemplo: se o arquivo for 'cones.html'

// Carrega os arquivos de tradução (common.json e pageName.json)
async function loadLanguage(lang, pageName) {
    try {
        // 1. SEMPRE BUSCA common.json (Menu/Geral)
        const menuResponse = await fetch(`../../src/translations/${lang}/common.json`);
        const menuTranslations = await menuResponse.json();

        let pageTranslations = {};
        
        // 2. VERIFICA A EXCEÇÃO DA PÁGINA
        if (!PAGE_EXCEPTIONS.includes(pageName)) {
            // Se a página não está na exceção, tenta buscar o arquivo dela
            try {
                 const pageResponse = await fetch(`../../src/translations/${lang}/${pageName}.json`);
                 // Se o fetch for bem-sucedido, processa o JSON
                 pageTranslations = await pageResponse.json();

            } catch (pageError) {
                 // Captura o erro 404 ou erro de sintaxe e ignora, mas mantém a tradução 'common'.
                 console.warn(`[i18n] Falha ao carregar ${pageName}.json. Continuando com common.json.`, pageError.message);
            }
        } else {
             console.warn(`[i18n] Ignorando busca por ${pageName}.json, pois está na lista de exceções.`);
        }
        
        // 3. Combina as traduções (common + página, sendo página vazio se for exceção/erro)
        translations = { ...menuTranslations, ...pageTranslations };
        return true;

    } catch (error) {
        // Captura erros críticos (ex: common.json falhou)
        console.error('Erro CRÍTICO ao carregar arquivos de tradução (common.json falhou?):', error);
        return false;
    }
}

// Traduz todos os elementos da página
function translatePage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        // === PONTO DE EXCEÇÃO (Para elementos HTML) ===
        if (el.hasAttribute('data-no-translate')) {
            return; 
        }
        // ===========================================

        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let translatedText = translations;

        for (const k of keys) {
            if (translatedText) {
                translatedText = translatedText[k];
            }
        }

        if (translatedText) {
            el.textContent = translatedText;
        }
    });
}

// Define o idioma e inicia o processo de tradução
async function setLanguage(lang) {
    // Pega o nome do arquivo HTML atual (ex: 'galeria-de-imagens' se a url for galeria-de-imagens.html)
    const pageName = window.location.pathname.split('/').pop().replace('.html', '');
    
    if (await loadLanguage(lang, pageName)) {
        localStorage.setItem('lang', lang);
        translatePage();
        // Atualiza o botão de idioma, se existir
        const langButton = document.getElementById('language-button');
        if(langButton) {
             langButton.textContent = lang.toUpperCase();
        }
       
    }
}

// Inicia a tradução e os eventos do botão
const savedLang = localStorage.getItem('lang') || 'pt';
setLanguage(savedLang);

// Adição da lógica de eventos (fora das funções)
const langButton = document.getElementById('language-button');
const langList = document.getElementById('language-list');

if (langButton && langList) {
    // Faz a lista de idiomas aparecer/desaparecer ao clicar no botão
    langButton.addEventListener('click', () => {
        langList.classList.toggle('hidden');
    });

    // Esconde a lista somente quando um idioma é selecionado
    langList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const newLang = e.target.getAttribute('data-lang');
            setLanguage(newLang);
            langList.classList.add('hidden'); 
        }
    });
}

// Lógica para o menu suspenso (dropdowns)
const dropdownContainers = document.querySelectorAll('.dropdown-menu-container');

dropdownContainers.forEach(container => {
    const dropdownMenu = container.querySelector('.dropdown-menu');
    const dropdownLink = container.querySelector('a');

    dropdownLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        if (dropdownMenu) {
            dropdownMenu.classList.toggle('hidden');
        }
    });
});