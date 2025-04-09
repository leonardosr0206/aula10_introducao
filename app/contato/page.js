


    'use client'

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './pagina_estoque.css';
import { handleClientScriptLoad } from 'next/script';

const Estoque = () => {
  const [A1, alteraA1] = useState(false);
  const [nomeProduto, alteraNomeProduto] = useState('');
  const [precoProduto, alteraPrecoProduto] = useState('');
  const [quantidadeProduto, alteraQuantidadeProduto] = useState('');
  const [produtos, setProdutos] = useState([
    { nome: 'Laranja', preco: 'R$21,00', quantidade: '100 KG' },
    { nome: 'Mandioca', preco: 'R$0,65', quantidade: '200 KG' },
    { nome: 'Maracuja', preco: 'R$2,89', quantidade: '50 KG' },
  ]);

  const handleClick = () => {
    alteraA1(!A1);
  };

  const handleSalvar = () => {
    const novoProduto = {
      nome: nomeProduto,
      preco: precoProduto,
      quantidade: quantidadeProduto,
    };
    setProdutos([...produtos, novoProduto]);

    // Limpar os campos após salvar
    alteraNomeProduto('');
    alteraPrecoProduto('');
    alteraQuantidadeProduto('');
    alteraA1(false); // Fecha o formulário após salvar
  };

  return (
    <div>
      <div className="menuSuperior">
        <img className="logo" src="logo.png" />
      </div>

      <div className="paineis">
        <div className="painelEsquerdo">
          <div className="CardGeral">
            <div className="atualizar">
              <button className="button" onClick={handleClick}>
                <i className="fa-solid fa-download"></i>
                <p>Cadastrar novo produto</p>
              </button>
            </div>
          </div>

          {A1 && (
            <>
              <div className="Conteudo">
                <div className="CardGeral">
                  <input
                    type="text"
                    placeholder="Nome do produto"
                    value={nomeProduto}
                    onChange={(e) => alteraNomeProduto(e.target.value)}
                  />
                </div>
              </div>

              <div className="Conteudo">
                <div className="CardGeral">
                  <input
                    type="text"
                    placeholder="Preço por KG"
                    value={precoProduto}
                    onChange={(e) => alteraPrecoProduto(e.target.value)}
                  />
                </div>
              </div>

              <div className="Conteudo">
                <div className="CardGeral">
                  <input
                    type="text"
                    placeholder="Quantidade"
                    value={quantidadeProduto}
                    onChange={(e) => alteraQuantidadeProduto(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="CardGeral">
                  <button className="button" onClick={handleSalvar}>
                    Salvar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Container para a tabela e o título */}
        <div className="produtosCadastradosContainer">
          <div className="produtosCadastradosTitulo">
            <i className="fa-solid fa-file"></i>
            <p>Produtos Cadastrados:</p>
          </div>

          <div className="tabela-scroll">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Produtos</th>
                  <th scope="col">Preço KG</th>
                  <th scope="col">Quantidade Disponível</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{produto.nome}</td>
                    <td>{produto.preco}</td>
                    <td>{produto.quantidade}</td>
                    <td>
                      <button className="button-edit">
                        <i className="fa-solid fa-pencil"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="Voltar">
        <a href="http://localhost:3000/">
          <button className="voltar">
            <p>Voltar</p>
          </button>
        </a>
      </div>
    </div>
  );
};

export default Estoque;

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons


    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';  // Importando o ícone de edição


<button className="button-edit">
                        <FontAwesomeIcon icon={faPencilAlt} /> {/* Ícone de lápis */}
                      </button>


/* Adicionar ao css*/
.tabela-scroll {
  max-height: 400px; /* Tamanho máximo da tabela */
  overflow-y: auto;  /* Permite rolar verticalmente */
}




--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


   'use client'

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './pagina_estoque.css';

// npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';   // Importando o ícone de edição
import { faPencilAlt, faTrashAlt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';  // Importando o ícone de edição

const Estoque = () => {
  const [A1, alteraA1] = useState(false);
  const [IDProduto, alteraIDProduto] = useState('');
  const [precoProduto, alteraPrecoProduto] = useState('');
  const [quantidadeProduto, alteraQuantidadeProduto] = useState('');
  const [produtos, setProdutos] = useState([
    { nome: 'Laranja', preco: 'R$21,00', quantidade: '100 KG' },
    { nome: 'Mandioca', preco: 'R$0,65', quantidade: '200 KG' },
    { nome: 'Maracuja', preco: 'R$2,89', quantidade: '50 KG' },
  ]);

  const buscaTodos = async () => {
    const response = await fetch('/api/produtos');
    const data = await response.json();
    setProdutos(data); // Atualiza o estado com os produtos
  };

  useEffect(() => {
    buscaTodos()
  }, [])

  const handleClick = () => {
    alteraA1(!A1);
  };

  const handleSalvar = async () => {
    const novoProduto = {
      IDProduto: IDProduto,
      quantidade: quantidadeProduto,
    };

    const response = await fetch('/api/estoque', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoProduto),
    });

    const data = await response.json();

    setProdutos([...produtos, {novoProduto, id: data.id }]);

    // volta os campos após clicar em salvar
    alteraNomeProduto('');
    alteraPrecoProduto('');
    alteraQuantidadeProduto('');
    alteraA1(false); // Fecha o formulário depois de salvar
  };

  return (
    <div>
      <div className="menuSuperior">
        <img className="logo" src="logo.png" />
      </div>

      <div className="paineis">
        <div className="painelEsquerdo">
          <div className="CardGeral">
            <div className="atualizar">
              <button className="button" onClick={handleClick}>
                <i className="fa-solid fa-download"></i>
                <p>Cadastrar novo produto</p>
              </button>
            </div>
          </div>

          {A1 && (
            <>
              <div className="Conteudo">
                <div className="CardGeral">
                  <input
                    type="text"
                    placeholder="id do produto"
                    value={IDProduto}
                    onChange={(e) => alteraIDProduto(e.target.value)}
                  />
                </div>
              </div>

              <div className="Conteudo">
                <div className="CardGeral">
                  <input
                    type="text"
                    placeholder="Quantidade"
                    value={quantidadeProduto}
                    onChange={(e) => alteraQuantidadeProduto(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="CardGeral">
                  <button className="button" onClick={handleSalvar}>
                    Salvar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Container para as tabelas */}
        <div className="produtosCadastradosContainer">
          <div className="produtosCadastradosTitulo">
            <i className="fa-solid fa-file"></i>
            <p className="lupa">Produtos Cadastrados:</p>
            <p><FontAwesomeIcon icon={faMagnifyingGlass} /></p>
            <input />
            <button className="pesquisa"> Pesquisar </button>
          </div>

          {/* Primeira tabela (com ícones) */}
          <div className="tabela-scroll">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Produtos</th>
                  <th scope="col">Preço</th>
                  <th scope="col">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{produto.nome}</td>
                    <td>{produto.preco}</td>
                    <td>{produto.quantidade}</td>
                    <td>
                      <button className="button-edit">
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button className="button-edit">
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Segunda tabela (sem ícones) */}
          <div className="tabela-scroll">
            <p>Registro</p> {/* Nome da tabela */}
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Quantidade</th>
                  <th scope="col">Registro</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((produto, index) => (
                  <tr key={index}>
                    <td>{produto.nome}</td>
                    <td>{produto.quantidade}</td>
                    <td>{index + 1}</td> {/* Exibe o número de registro */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="Voltar">
        <a href="http://localhost:3000/">
          <button className="voltar">
            <p>Voltar</p>
          </button>
        </a>
      </div>
    </div>
  );
};

export default Estoque;












/* Atualize o seu arquivo CSS para incluir o seguinte código */
.produtosCadastradosContainer {
  display: flex;
  justify-content: space-between; /* Espaço entre as tabelas */
  gap: 20px; /* Distância entre as tabelas */
}

.tabela-scroll {
  flex: 1; /* Cada tabela ocupa metade do espaço disponível */
  overflow-x: auto; /* Permite rolar a tabela horizontalmente, se necessário */
}





--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import conexao from "@/app/lib/conexao";

export async function GET() {
    const query = `SELECT * FROM produtos;`; // Corrigindo a sintaxe
    const [results] = await conexao.execute(query);

    return new Response(
        JSON.stringify(results),
        {
            status: 200,
            headers: { "Content-Type": "application/json" }
        }
    );
}






export async function POST(request) {
    const body = await request.json();

    const query = `
        INSERT INTO estoque (id_produto, quantidade)
        VALUES (?, ?)
    `;
    const [results] = await conexao.execute(
        query,
        [body.IDProduto, body.quantidade]
    );

    return new Response(
        JSON.stringify({ id: results.insertId, mensagem: 'Produto inserido com sucesso!' }),
        { status: 201, headers: { "Content-Type": "application/json" } }
    );
}



--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


const handleSalvar = async () => {
    const novoProduto = {
        IDProduto: IDProduto,
        quantidade: quantidadeProduto,
    };

    const response = await fetch('/api/estoque', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoProduto),
    });

    const data = await response.json();

    // Assumindo que o produto foi inserido corretamente, agora vamos atualizar a lista de produtos.
    // Aqui você pode obter o produto pelo IDProduto se necessário.
    setProdutos((prevProdutos) => [
        ...prevProdutos,
        {
            nome: IDProduto, // Pode buscar o nome do produto por ID aqui, se necessário
            preco: 'Não definido', // Você pode buscar o preço aqui também
            quantidade: quantidadeProduto,
            id: data.id, // ID retornado pelo banco
        },
    ]);

    // Limpar os campos após o cadastro
    alteraIDProduto('');
    alteraQuantidadeProduto('');
    alteraA1(false); // Fecha o formulário após salvar
};







const [searchTerm, setSearchTerm] = useState('');

const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
};

const filteredProducts = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
);









<input 
    type="text" 
    value={searchTerm} 
    onChange={handleSearchChange} 
    placeholder="Buscar produto" 
/>
<button className="pesquisa">Pesquisar</button>

{/* Primeira tabela com ícones */}
<div className="tabela-scroll">
    <table className="table table-striped">
        <thead>
            <tr>
                <th scope="col"></th>
                <th scope="col">Produtos</th>
                <th scope="col">Preço</th>
                <th scope="col">Quantidade</th>
            </tr>
        </thead>
        <tbody>
            {filteredProducts.map((produto, index) => (
                <tr key={produto.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{produto.nome}</td>
                    <td>{produto.preco}</td>
                    <td>{produto.quantidade}</td>
                    <td>
                        <button className="button-edit">
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                        <button className="button-edit">
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>


