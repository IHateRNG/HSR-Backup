// O nome da sua função pode ser diferente, mas a lógica é a mesma
async function exibirTodasAsImagens() {
  const urlDoJson = '../data/icon-avatar.json'; // Ajuste o caminho para o seu JSON
  const urlBaseDasImagens = '/pom-pom-gallery/assets/icon/avatar/'; // Ajuste o caminho para a pasta das imagens

  try {
    // 1. Carrega o arquivo JSON
    const resposta = await fetch(urlDoJson);
    const dadosDasImagens = await resposta.json();
    
    // 2. Seleciona o contêiner no HTML
    const galeria = document.getElementById('galeria-de-imagens');
    
    // 3. Limpa o contêiner antes de adicionar as novas imagens (se necessário)
    galeria.innerHTML = '';
    
    // 4. Percorre cada item no JSON e cria a tag <img>
    dadosDasImagens.forEach(imagem => {
      const novaImagem = document.createElement('img');
      novaImagem.src = urlBaseDasImagens + imagem.filename;
      novaImagem.alt = imagem.alt;
      
      // Opcional: Adicionar uma classe para estilizar
      novaImagem.classList.add('imagem-galeria');

      // 5. Adiciona a imagem ao contêiner da galeria
      galeria.appendChild(novaImagem);
    });

  } catch (error) {
    console.error('Erro ao carregar ou exibir as imagens:', error);
  }
}

// Chama a função para iniciar o processo
exibirTodasAsImagens();