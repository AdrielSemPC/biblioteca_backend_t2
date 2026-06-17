const { Router } = require('express');
const { verificaJWT, verificaAdmin } = require('../controllers/segurancaController');

const {
  getClientes,
  addCliente,
  updateCliente,
  getClientePorCodigo,
  deleteCliente
} = require('../controllers/clienteController');

const clientes = Router();

clientes.route('/')
  .get(verificaJWT, getClientes)
  .post(verificaJWT, verificaAdmin, addCliente);

clientes.route('/:codigo')
  .get(verificaJWT, getClientePorCodigo)
  .put(verificaJWT, verificaAdmin, updateCliente)
  .delete(verificaJWT, verificaAdmin, deleteCliente);

module.exports = clientes;