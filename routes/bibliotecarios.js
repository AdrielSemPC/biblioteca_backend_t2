const { Router } = require('express');

const {
  getBibliotecarios,
  addBibliotecario,
  updateBibliotecario,
  getBibliotecarioPorCodigo,
  deleteBibliotecario
} = require('../controllers/bibliotecarioController');

const bibliotecarios = Router();

bibliotecarios.route('/')
  .get(getBibliotecarios)
  .post(addBibliotecario);

bibliotecarios.route('/:codigo')
  .get(getBibliotecarioPorCodigo)
  .put(updateBibliotecario)
  .delete(deleteBibliotecario);

module.exports = bibliotecarios;