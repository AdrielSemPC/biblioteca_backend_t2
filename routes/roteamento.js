const { Router } = require('express');
const { login } = require('../controllers/segurancaController');

const emprestimos = require('./emprestimos');
const bibliotecarios = require('./bibliotecarios');
const clientes = require('./clientes');
const livros = require('./livros');
const usuarios = require('./usuarios');

const roteamento = Router();

roteamento.use('/emprestimos', emprestimos);
roteamento.use('/bibliotecarios', bibliotecarios);
roteamento.use('/clientes', clientes);
roteamento.use('/livros', livros);
roteamento.use('/usuarios', usuarios);
roteamento.route('/login')
    .post(login);

module.exports = roteamento;