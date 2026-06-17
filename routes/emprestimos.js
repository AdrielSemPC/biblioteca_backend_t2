const { Router } = require('express');
const { verificaJWT, verificaAdmin } = require('../controllers/segurancaController');

const {
  getEmprestimos,
  addEmprestimo,
  updateEmprestimo,
  getEmprestimoPorCodigo,
  deleteEmprestimo,
  finalizarEmprestimo
} = require('../controllers/emprestimoController');

const emprestimos = Router();

emprestimos.route('/')
  .get(verificaJWT, getEmprestimos)
  .post(verificaJWT, verificaAdmin, addEmprestimo);

emprestimos.route('/:codigo')
  .get(verificaJWT, getEmprestimoPorCodigo)
  .put(verificaJWT, verificaAdmin, updateEmprestimo)
  .delete(verificaJWT, verificaAdmin, deleteEmprestimo);

emprestimos.route('/:codigo/finalizar')
  .put(verificaJWT, verificaAdmin, finalizarEmprestimo);

module.exports = emprestimos;