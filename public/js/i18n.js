let translations = {};

// Carrega os arquivos de tradução
async function loadLanguage(lang, pageName) {
  try {
    // Busca os arquivos menu.json e o arquivo específico da página (ex: index.json)
    const menuResponse = await fetch(`../../src/translations/${lang}/common.json`);
    const pageResponse = await fetch(`../../src/translations/${lang}/${pageName}.json`);
    
    const menuTranslations = await menuResponse.json();
    const pageTranslations = await pageResponse.json();
    
    // Combina as traduções para uso
    translations = { ...menuTranslations, ...pageTranslations };
    return true;
  } catch (error) {
    console.error('Erro ao carregar os arquivos de tradução:', error);
    return false;
  }
}

// Traduz todos os elementos da página
function translatePage() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
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
  const pageName = window.location.pathname.split('/').pop().replace('.html', '');
  
  if (await loadLanguage(lang, pageName)) {
    localStorage.setItem('lang', lang);
    translatePage();
    document.getElementById('language-button').textContent = lang.toUpperCase();
  }
}

// Inicia a tradução e os eventos do botão
const savedLang = localStorage.getItem('lang') || 'pt';
setLanguage(savedLang);

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

// Lógica para o menu suspenso, garantindo que ele apareça/desapareça
const dropdownContainers = document.querySelectorAll('.dropdown-menu-container');

dropdownContainers.forEach(container => {
    const dropdownMenu = container.querySelector('.dropdown-menu');
    const dropdownLink = container.querySelector('a');

    dropdownLink.addEventListener('click', (e) => {
        // Impede que o link navegue antes de exibir o menu
        e.preventDefault(); 
        if (dropdownMenu) {
            dropdownMenu.classList.toggle('hidden');
        }
    });
});