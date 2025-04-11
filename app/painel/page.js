
//npm install sweetalert2


// ✅ Arquivo /api/produtos/route.js



import conexao from "@/app/lib/conexao";

// GET - lista todos os produtos com seus dados e último registro de estoque
export async function GET() {
  const query = `
    SELECT 
      p.id,
      p.nome, 
      p.preco, 
      IFNULL(SUM(e.quantidade), 0) as quantidade,
      MAX(e.data) as dataCadastro
    FROM produtos p
    LEFT JOIN estoque e ON e.id_produto = p.id
    GROUP BY p.id;
  `;

  const [results] = await conexao.execute(query);

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

// POST - insere ou atualiza produto e registra alteração de estoque
export async function POST(request) {
  const body = await request.json();
  const { nome, preco, quantidade } = body;

  try {
    // Verifica se o produto já existe
    const [produtoExistente] = await conexao.execute(
      `SELECT id FROM produtos WHERE nome = ?`,
      [nome]
    );

    let idProduto;

    if (produtoExistente.length > 0) {
      // Atualiza preço se mudou
      idProduto = produtoExistente[0].id;
      await conexao.execute(
        `UPDATE produtos SET preco = ? WHERE id = ?`,
        [preco, idProduto]
      );
    } else {
      // Insere novo produto
      const [insertProduto] = await conexao.execute(
        `INSERT INTO produtos (nome, preco) VALUES (?, ?)`,
        [nome, preco]
      );
      idProduto = insertProduto.insertId;
    }

    // Registra a movimentação no estoque (pode ser entrada ou saída)
    await conexao.execute(
      `INSERT INTO estoque (id_produto, quantidade, data) VALUES (?, ?, NOW())`,
      [idProduto, quantidade]
    );

    return new Response(JSON.stringify({ success: true, id: idProduto }), {
      status: 200
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Erro ao salvar produto" }), {
      status: 500
    });
  }
}



//✅ 1. BACKEND: Deletar Produto (/api/produtos/route.js)

export async function DELETE(request) {
  const body = await request.json();
  const { id } = body;

  try {
    // Remove registros do estoque antes (por integridade referencial)
    await conexao.execute(`DELETE FROM estoque WHERE id_produto = ?`, [id]);

    // Remove produto
    await conexao.execute(`DELETE FROM produtos WHERE id = ?`, [id]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Erro ao deletar produto" }), { status: 500 });
  }
}




//✅ Arquivo /api/registro/route.js


import conexao from "@/app/lib/conexao";

// GET - retorna todos os registros de movimentação com data
export async function GET() {
  const query = `
    SELECT 
      p.nome, 
      e.quantidade, 
      e.data
    FROM estoque e
    JOIN produtos p ON e.id_produto = p.id
    ORDER BY e.data DESC
  `;

  const [results] = await conexao.execute(query);

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}




//✅ page.js completo novo:

'use client';

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './pagina_estoque.css';
import Swal from 'sweetalert2';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Estoque = () => {
  const [A1, alteraA1] = useState(false);
  const [idEditando, setIdEditando] = useState(null); // 🔄
  const [nomeProduto, alteraNomeProduto] = useState('');
  const [precoProduto, alteraPrecoProduto] = useState('');
  const [quantidadeProduto, alteraQuantidadeProduto] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [pesquisa, setPesquisa] = useState('');

  const buscaProdutos = async () => {
    const url = pesquisa
      ? `/api/produtos?search=${encodeURIComponent(pesquisa)}`
      : `/api/produtos`;

    const response = await fetch(url);
    const data = await response.json();
    setProdutos(data);
  };

  const buscaRegistros = async () => {
    const response = await fetch('/api/registro');
    const data = await response.json();
    setRegistros(data);
  };

  useEffect(() => {
    buscaProdutos();
    buscaRegistros();
  }, []);

  const limparCampos = () => {
    alteraNomeProduto('');
    alteraPrecoProduto('');
    alteraQuantidadeProduto('');
    setIdEditando(null);
    alteraA1(false);
  };

  const handleClick = () => {
    alteraA1(!A1);
    limparCampos();
  };

  const handleSalvar = async () => {
    if (!nomeProduto || !precoProduto || !quantidadeProduto) {
      Swal.fire("Erro", "Preencha todos os campos", "warning");
      return;
    }

    if (parseFloat(precoProduto) < 0 || parseInt(quantidadeProduto) === 0) {
      Swal.fire("Erro", "Preço deve ser positivo e quantidade diferente de 0", "error");
      return;
    }

    const produto = {
      nome: nomeProduto,
      preco: parseFloat(precoProduto),
      quantidade: parseInt(quantidadeProduto),
    };

    await fetch('/api/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produto),
    });

    Swal.fire("Sucesso", "Produto salvo com sucesso!", "success");

    await buscaProdutos();
    await buscaRegistros();
    limparCampos();
  };

  const handlePesquisar = async () => {
    await buscaProdutos();
  };

  const handleEditar = (produto) => {
    setIdEditando(produto.id);
    alteraNomeProduto(produto.nome);
    alteraPrecoProduto(produto.preco);
    alteraQuantidadeProduto(produto.quantidade);
    alteraA1(true);
  };

  const handleDeletar = async (id) => {
    const confirma = await Swal.fire({
      title: "Tem certeza?",
      text: "Essa ação não poderá ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Cancelar"
    });

    if (confirma.isConfirmed) {
      await fetch('/api/produtos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      Swal.fire("Deletado!", "Produto removido.", "success");
      await buscaProdutos();
      await buscaRegistros();
    }
  };

  const formataData = (valor) => {
    let data = valor.split("T")[0];
    let hora = valor.split("T")[1];

    data = data.split("-").reverse().join("/");
    hora = hora.split(":");
    return `${data} às ${hora[0]}:${hora[1]}`;
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
                <p>{idEditando ? "Editar Produto" : "Atualizar Cadastrados"}</p>
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
                    type="number"
                    placeholder="Preço"
                    value={precoProduto}
                    onChange={(e) => alteraPrecoProduto(e.target.value)}
                  />
                </div>
              </div>

              <div className="Conteudo">
                <div className="CardGeral">
                  <input
                    type="number"
                    placeholder="Quantidade"
                    value={quantidadeProduto}
                    onChange={(e) => alteraQuantidadeProduto(e.target.value)}
                  />
                </div>
              </div>

              <div className="CardGeral">
                <button className="button" onClick={handleSalvar}>
                  {idEditando ? "Salvar Alterações" : "Salvar"}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="produtosCadastradosContainer">
          <div className="produtosCadastradosTitulo">
            <i className="fa-solid fa-file"></i>
            <p className="lupa"> Cadastrados:</p>
            <p><FontAwesomeIcon icon={faMagnifyingGlass} /></p>
            <input
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              placeholder="Buscar por nome"
            />
            <button className="pesquisa" onClick={handlePesquisar}>
              Pesquisar
            </button>
          </div>

          <div className="tabelas-lado-a-lado">
            <div className="tabela-scroll">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.map((produto, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{produto.nome}</td>
                      <td>R${parseFloat(produto.preco).toFixed(2)}</td>
                      <td>{produto.quantidade} KG</td>
                      <td>
                        <button className="button-edit" onClick={() => handleEditar(produto)}>
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                        <button className="button-edit" onClick={() => handleDeletar(produto.id)}>
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="tabela-scroll">
              <div className="produtosCadastradosTitulo">
                <p>Registro:</p>
              </div>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Quantidade</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {registros.map((reg, index) => (
                    <tr key={index}>
                      <td>{reg.nome}</td>
                      <td>{reg.quantidade}</td>
                      <td>{formataData(reg.data)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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








--------------------------------------------------------------------------------------------------------------------




const express = require('express');
const router = express.Router();
const pool = require('./db'); // Conexão com o banco

// GET: Todos os produtos com quantidade total
router.get('/produtos', (req, res) => {
  const query = `
    SELECT p.id, p.nome, p.preco, IFNULL(SUM(e.quantidade), 0) AS quantidade,
           MAX(e.data) AS dataCadastro
    FROM produtos p
    LEFT JOIN estoque e ON p.id = e.id_produto
    GROUP BY p.id;
  `;
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao obter produtos:', err);
      res.status(500).send('Erro no servidor');
    } else {
      res.json(results);
    }
  });
});

// POST: Criar novo produto com estoque inicial
router.post('/estoque', (req, res) => {
  const { nome, preco, quantidade } = req.body;

  const insertProduto = 'INSERT INTO produtos (nome, preco) VALUES (?, ?)';
  pool.query(insertProduto, [nome, preco], (err, result) => {
    if (err) {
      console.error('Erro ao inserir produto:', err);
      return res.status(500).send('Erro ao inserir produto');
    }

    const id_produto = result.insertId;
    const insertEstoque = 'INSERT INTO estoque (id_produto, quantidade, data) VALUES (?, ?, NOW())';
    pool.query(insertEstoque, [id_produto, quantidade], (err2) => {
      if (err2) {
        console.error('Erro ao inserir estoque:', err2);
        return res.status(500).send('Erro ao inserir estoque');
      }

      res.status(201).json({ id: id_produto });
    });
  });
});

// PUT: Adiciona nova movimentação de estoque (positivo ou negativo)
router.put('/estoque', (req, res) => {
  const { id_produto, quantidade } = req.body;

  const insertEstoque = 'INSERT INTO estoque (id_produto, quantidade, data) VALUES (?, ?, NOW())';
  pool.query(insertEstoque, [id_produto, quantidade], (err) => {
    if (err) {
      console.error('Erro ao atualizar estoque:', err);
      res.status(500).send('Erro ao atualizar estoque');
    } else {
      res.send({ success: true, message: 'Movimentação registrada com sucesso' });
    }
  });
});

// PUT: Atualizar nome do produto
router.put('/produtos', (req, res) => {
  const { id, nome } = req.body;
  const query = 'UPDATE produtos SET nome = ? WHERE id = ?';
  pool.query(query, [nome, id], (err) => {
    if (err) {
      console.error('Erro ao atualizar nome:', err);
      res.status(500).send('Erro ao atualizar nome');
    } else {
      res.json({ success: true });
    }
  });
});

module.exports = router;





Consultas SQL:

Inserção de Produto:

sql
Copiar
Editar
INSERT INTO produtos (nome, preco) VALUES (?, ?);
Leitura de Produtos com Estoque:

sql
Copiar
Editar
SELECT p.id, p.nome, p.preco, IFNULL(SUM(e.quantidade), 0) AS quantidade
FROM produtos p
LEFT JOIN estoque e ON p.id = e.id_produto
GROUP BY p.id;
Inserção de Registro de Estoque:

sql
Copiar
Editar
INSERT INTO estoque (id_produto, quantidade, data) VALUES (?, ?, NOW());
Atualização de Quantidade de Estoque:

sql
Copiar
Editar
UPDATE estoque SET quantidade = ?, data = NOW() WHERE id_produto = ? ORDER BY data DESC LIMIT 1;
Exemplo de Implementação de Rota com Express:

javascript
Copiar
Editar
const express = require('express');
const router = express.Router();
const pool = require('./db'); // Arquivo que configura a conexão com o banco

// Rota para obter todos os produtos com estoque
router.get('/produtos', (req, res) => {
  const query = `
    SELECT p.id, p.nome, p.preco, IFNULL(SUM(e.quantidade), 0) AS quantidade
    FROM produtos p
    LEFT JOIN estoque e ON p.id = e.id_produto
    GROUP BY p.id;
  `;
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao obter produtos:', err);
      res.status(500).send('Erro no servidor');
    } else {
      res.json(results);
    }
  });
});

// Rota para adicionar entrada de estoque
router.post('/estoque', (req, res) => {
  const { id_produto, quantidade } = req.body;
  const query = 'INSERT INTO estoque (id_produto, quantidade, data) VALUES (?, ?, NOW())';
  pool.query(query, [id_produto, quantidade], (err, results) => {
    if (err) {
      console.error('Erro ao adicionar estoque:', err);
      res.status(500).send('Erro no servidor');
    } else {
      res.status(201).send('Estoque adicionado com sucesso');
    }
  });
});

// Rota para atualizar quantidade de estoque
router.put('/estoque', (req, res) => {
  const { id_produto, quantidade } = req.body;
  const query = 'UPDATE estoque SET quantidade = ?, data = NOW() WHERE id_produto = ? ORDER BY data DESC LIMIT 1';
  pool.query(query, [quantidade, id_produto], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar estoque:', err);
      res.status(500).send('Erro no servidor');
    } else {
      res.send('Estoque atualizado com sucesso');
    }
  });
});

module.exports = router;





/backend
│
├── db.js                 ← Conexão com o banco de dados
├── routes.js             ← Arquivo que você acabou de colar
└── index.js              ← Ponto de entrada do servidor













  
