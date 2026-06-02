function trocarTela(tela) {
    document.getElementById('cadastro').style.display = 'none';
    document.getElementById('listar').style.display = 'none';

    if(tela === 'cadastro') {
        document.getElementById('cadastro').style.display = 'flex';
        return;
    }
    document.getElementById('listar').style.display = 'flex';
    listarProdutos();
}

function fazerCadastro(event) {
    event.preventDefault();

    const dados = {
        nome: document.getElementById('nome').value,
        categoria: document.getElementById('categoria').value,
        descricao: document.getElementById('descricao').value,
        preco: document.getElementById('preco').value
    };

    fetch('/enviar-produto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(resposta => alert("Salvo com sucesso!"))
    .then(() => trocarTela('listar'));
}

function listarProdutos() {
    fetch('/produtos') 
    .then(resposta => resposta.json())
    .then(produtos => {
        const divListar = document.getElementById('listar');
        
        divListar.innerHTML = '<h2>Produtos Cadastrados</h2>'; 
        
        if (produtos.length === 0) {
            divListar.innerHTML += '<p class="sem_prod">Nenhum produto cadastrado ainda.</p>';
            return;
        }

        produtos.forEach(produto => {
            const card = document.createElement('div');
            
            card.className = 'card_produto'; 
            
            card.innerHTML = `
                <p class="tipo">Produto</p>
                <p class="atributo">${produto.nome}</p>
                <p class="tipo">Categoria</p>
                <p class="atributo">${produto.categoria}</p>
                <p class="tipo">Descrição</p>
                <p class="atributo">${produto.descricao}</p>
                <p class="tipo">Preço<p>
                <p class="atr_preco">R$ ${produto.preco}</p>
                <button class="botao_excluir" type="button" onclick="excluirProduto(${produto.id})">Excluir</button>
            `;
        
            divListar.appendChild(card);
        });
    })
    .catch(erro => console.error("Erro ao carregar produtos:", erro));
}

function excluirProduto(id) {
    if(confirm("Tem certeza que deseja excluir?")) {
        fetch(`/produtos/${id}`, { method: 'DELETE' })
        .then(() => {
            alert("Produto excluído!");
            listarProdutos();
        });
    }
}