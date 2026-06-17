const { Router } = require('express');
const { verificaJWT, verificaAdmin } = require('../controllers/segurancaController');

const {
  getBibliotecarios,
  addBibliotecario,
  updateBibliotecario,
  getBibliotecarioPorCodigo,
  deleteBibliotecario
} = require('../controllers/bibliotecarioController');

const bibliotecarios = Router();

bibliotecarios.route('/')
  .get(verificaJWT, getBibliotecarios)
  .post(verificaJWT, verificaAdmin, addBibliotecario);

bibliotecarios.route('/:codigo')
  .get(verificaJWT, getBibliotecarioPorCodigo)
  .put(verificaJWT, verificaAdmin, updateBibliotecario)
  .delete(verificaJWT, verificaAdmin, deleteBibliotecario);

module.exports = bibliotecarios;