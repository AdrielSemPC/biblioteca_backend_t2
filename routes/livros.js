const { Router } = require('express');

const {
  getLivros,
  addLivro,
  updateLivro,
  getLivroPorCodigo,
  deleteLivro
} = require('../controllers/livroController');

const livros = Router();

livros.route('/')
  .get(getLivros)
  .post(addLivro);

livros.route('/:codigo')
  .get(getLivroPorCodigo)
  .put(updateLivro)
  .delete(deleteLivro);

module.exports = livros;