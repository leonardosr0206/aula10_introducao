import React from 'react';
import './api_pagina_estoque.css'; // Certifique-se de que o caminho para o CSS esteja correto

const ApiPaginaEstoque = () => {
  return (
    <div>
      <div className="menuSuperior">
        <button className="menuSuperiorButton">
          <img width="70px" src="caminho/para/a/imagem/logo_coascre.png" alt="Logo" />
          <h1>SGR</h1>
        </button>
      </div>

      <div className="paineis">
        <div className="painelEsquerdo">
          <div className="CardGeral">
            <div className="atualizar">
              <button className="button">
                <i className="fa-solid fa-download"></i>
                <p> Atualizar cadastro</p>
              </button>
            </div>
          </div>

          <div className="Conteudo">
            <div className="CardGeral">
              <input placeholder="Nome do produto" />
            </div>
          </div>

          <div className="Conteudo">
            <div className="CardGeral">
              <input placeholder="Preço por KG:" />
            </div>
          </div>
        </div>

        <div className="produtos">
          <i className="fa-solid fa-file"></i>
          <p>Produtos Cadastrados:</p>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Produtos</th>
              <th scope="col"></th>
              <th scope="col">Preço KG</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Laranja</td>
              <td>R$21,00</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Mandioca</td>
              <td>R$0,65</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Maracuja</td>
              <td>R$2,89</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="Voltar">
        <button className="voltar">
          <p> Voltar</p>
        </button>
      </div>
    </div>
  );
};

export default ApiPaginaEstoque;
