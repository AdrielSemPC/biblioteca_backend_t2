const { Router } = require('express');
const { verificaJWT, verificaAdmin } = require('../controllers/segurancaController');

const {
  getLivros,
  addLivro,
  updateLivro,
  getLivroPorCodigo,
  deleteLivro
} = require('../controllers/livroController');

const livros = Router();

livros.route('/')
  .get(verificaJWT, getLivros)
  .post(verificaJWT, verificaAdmin, addLivro);

livros.route('/:codigo')
  .get(verificaJWT, getLivroPorCodigo)
  .put(verificaJWT, verificaAdmin, updateLivro)
  .delete(verificaJWT, verificaAdmin, deleteLivro);

module.exports = livros;