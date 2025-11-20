// =================================================================
// DADOS GLOBAIS E INICIALIZAÇÃO
// =================================================================

const URL_DADOS = '/src/data/cones.json';
let dadosCompletos = null; 
let idiomaAtual = 'pt'; 

// =================================================================
// MECANISMO ISOLADO DE TRADUÇÃO (t)
// =================================================================

function t(chave) {
    if (!dadosCompletos) return `[Dados não carregados]`;
    
    const dicionario = dadosCompletos.TRADUCOES[idiomaAtual];
    return dicionario && dicionario[chave] ? dicionario[chave] : `[Erro na Tradução: ${chave}]`;
}

// =================================================================
// CARREGAMENTO DE DADOS
// =================================================================

async function carregarDados() {
    try {
        const response = await fetch(URL_DADOS);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        dadosCompletos = await response.json();
        console.log("Dados JSON carregados com sucesso.");
    } catch (error) {
        console.error("Erro ao buscar e analisar o JSON:", error);
        document.getElementById('lista-itens-container').innerHTML = `<p style="color: red;">Falha ao carregar dados.</p>`;
        dadosCompletos = null; 
    }
}

// =================================================================
// FUNÇÕES DE RENDERIZAÇÃO
// =================================================================

/**
 * 1. Renderiza a lista de todos os itens clicáveis.
 * @param {string} lang - O idioma atual.
 */
async function renderizarListaDeItens(lang) {
    if (lang) {
        idiomaAtual = lang;
    }

    if (!dadosCompletos) {
        await carregarDados();
        if (!dadosCompletos) return;
    }

    const containerLista = document.getElementById('lista-itens-container');
    if (!containerLista) return;
    
    // Mapeia os itens do JSON para HTML clicável
    const listaHTML = dadosCompletos.ITENS.map(item => {
        // Obtém o título traduzido para o item atual
        const tituloChave = `TITULO_${item.id.replace('ITEM001_', '')}`; 
        const titulo = t(tituloChave);

        return `
            <div 
                class="item-miniatura" 
                data-item-id="${item.id}"
                onclick="exibirDetalhesDoItem('${item.id}')"
            >
                <img src="${item.imagem_url}" alt="${titulo}">
                <span>${titulo}</span>
            </div>
        `;
    }).join('');

    containerLista.innerHTML = listaHTML;
    
    // (Opcional) Exibir o primeiro item por padrão
    // if (dadosCompletos.ITENS.length > 0) {
    //     exibirDetalhesDoItem(dadosCompletos.ITENS[0].id);
    // }
}


/**
 * 2. Exibe os detalhes de um item específico no contêiner de detalhes.
 * É chamada pelo 'onclick' da lista.
 * @param {string} itemId - O ID do item a ser exibido (ex: "ITEM001_NOVA_ESCAMA").
 */
function exibirDetalhesDoItem(itemId) {
    if (!dadosCompletos) return;

    const containerDetalhes = document.getElementById('detalhes-item-container');
    if (!containerDetalhes) return;
    
    const item = dadosCompletos.ITENS.find(i => i.id === itemId);
    
    if (!item) {
        containerDetalhes.innerHTML = "<p>Detalhes do item não encontrados.</p>";
        return;
    }

    // --- OBTÉM AS TRADUÇÕES ---
    // Adaptando as chaves para corresponder ao ID (ex: ITEM001_NOVA_ESCAMA -> NOVA_ESCAMA)
    const chaveBase = item.id.replace('ITEM001_', ''); 
    
    const titulo = t(`TITULO_${chaveBase}`);
    const descA = t(`DESC_A_CONTEXTO`); 
    const descB_base = t(`DESC_B_EFEITO_BASE`); 
    const imagemUrl = item.imagem_url;
    
    // --- MONTA O HTML DE DETALHES ---
    const detalhesHTML = `
        <div class="item-detalhe-card">
            <img src="${imagemUrl}" alt="${titulo}" style="max-width: 150px;">
            <h2>${titulo}</h2>
            
            <h4>Contexto</h4> 
            <p>${descA}</p>
            
            <h4>Efeitos</h4>
            <p id="cone-desc-efeito">${descB_base}</p>
        </div>
    `;
    
    containerDetalhes.innerHTML = detalhesHTML;
    
    // Opcional: Adicionar uma classe de destaque ao item selecionado na lista
    document.querySelectorAll('.item-miniatura').forEach(el => {
        el.classList.remove('selecionado');
    });
    const miniaturaSelecionada = document.querySelector(`[data-item-id="${itemId}"]`);
    if (miniaturaSelecionada) {
        miniaturaSelecionada.classList.add('selecionado');
    }
}


// =================================================================
// FUNÇÕES DE CONTROLE E INICIALIZAÇÃO
// =================================================================

/**
 * Função pública chamada pelo <select onchange="mudarIdioma(this.value)">.
 * Atualiza o idioma e renderiza novamente a lista (e os detalhes, se um item estiver selecionado).
 * @param {string} lang - O novo idioma.
 */
function mudarIdioma(lang) {
    // 1. Renderiza a lista no novo idioma (o título do item muda)
    renderizarListaDeItens(lang).then(() => {
        // 2. Tenta renderizar os detalhes do item que estava selecionado
        const itemSelecionado = document.querySelector('.item-miniatura.selecionado');
        if (itemSelecionado) {
            exibirDetalhesDoItem(itemSelecionado.dataset.itemId);
        }
    });
}

// Inicia a aplicação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const seletor = document.getElementById('seletor-idioma');
    const langInicial = seletor ? seletor.value : 'pt';
    
    // No carregamento inicial, apenas renderiza a lista de itens
    renderizarListaDeItens(langInicial);
});

// A função mudarIdioma deve ser a única função pública exposta ao HTML.
// Não precisa renomear 'renderizarItens' se ela só renderiza a lista.
// Mantenha o nome 'mudarIdioma' para ser usado no onchange.