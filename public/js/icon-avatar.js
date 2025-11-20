async function exibirImagemDinamica() {
  // Pega todos os contêineres que vão exibir uma imagem
  const containers = document.querySelectorAll('[data-id]');

  for (const container of containers) {
    const idDaImagem = container.getAttribute('data-id');
    const tamanhoDaImagem = container.getAttribute('data-size') || '150'; // Valor padrão de 150px se não for definido

    if (!idDaImagem) {
      console.error('ID da imagem não encontrado no atributo data-id.');
      continue; // Pula para o próximo contêiner
    }
    
    const urlDoJson = '../data/icon-avatar.json';
    const urlBaseDasImagens = '/pom-pom-gallery/assets/icon/avatar/';

    try {
      const resposta = await fetch(urlDoJson);
      const dadosDasImagens = await resposta.json();
      
      const imagemEncontrada = dadosDasImagens.find(imagem => imagem.id === idDaImagem);

      if (imagemEncontrada) {
        container.innerHTML = ''; // Limpa o contêiner
        
        const novaImagem = document.createElement('img');
        novaImagem.src = urlBaseDasImagens + imagemEncontrada.filename;
        novaImagem.alt = imagemEncontrada.alt;

        // Define o tamanho da imagem lendo o atributo 'data-size'
        novaImagem.style.width = `${tamanhoDaImagem}px`;
        novaImagem.style.height = 'auto'; // Mantém a proporção
        
        container.appendChild(novaImagem);
      } else {
        console.error(`Imagem com o ID ${idDaImagem} não foi encontrada no JSON.`);
      }

    } catch (error) {
      console.error('Erro ao carregar ou exibir a imagem:', error);
    }
  }
}

exibirImagemDinamica();