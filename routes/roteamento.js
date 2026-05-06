const { Router } = require('express');

const emprestimos = require('./emprestimos');
const bibliotecarios = require('./bibliotecarios');
const clientes = require('./clientes');
const livros = require('./livros');

const roteamento = Router();

roteamento.use('/emprestimos', emprestimos);
roteamento.use('/bibliotecarios', bibliotecarios);
roteamento.use('/clientes', clientes);
roteamento.use('/livros', livros);

module.exports = roteamento;