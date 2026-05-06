const { Router } = require('express');

const {
  getClientes,
  addCliente,
  updateCliente,
  getClientePorCodigo,
  deleteCliente
} = require('../controllers/clienteController');

const clientes = Router();

clientes.route('/')
  .get(getClientes)
  .post(addCliente);

clientes.route('/:codigo')
  .get(getClientePorCodigo)
  .put(updateCliente)
  .delete(deleteCliente);

module.exports = clientes;