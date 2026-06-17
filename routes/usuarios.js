const { Router } = require('express');
const { verificaJWT, verificaAdmin } = require('../controllers/segurancaController');

const {
  getUsuarios,
  addUsuario,
  updateUsuario,
  getUsuarioPorEmail,
  deleteUsuario
} = require('../controllers/usuarioController');

const usuarios = Router();

usuarios.route('/')
  .get(verificaJWT, verificaAdmin, getUsuarios)
  .post(addUsuario);

usuarios.route('/:email')
  .get(verificaJWT, getUsuarioPorEmail)
  .put(verificaJWT, updateUsuario)
  .delete(verificaJWT, deleteUsuario);

module.exports = usuarios;
