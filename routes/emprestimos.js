const { Router } = require('express');

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
  .get(getEmprestimos)
  .post(addEmprestimo);

emprestimos.route('/:codigo')
  .get(getEmprestimoPorCodigo)
  .put(updateEmprestimo)
  .delete(deleteEmprestimo);

emprestimos.route('/:codigo/finalizar')
  .put(finalizarEmprestimo);

module.exports = emprestimos;