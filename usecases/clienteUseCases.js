const { pool } = require('../config');
const Cliente = require('../entities/cliente');

const getClientesDB = async () => {
    try {    
        const { rows } = await pool.query('SELECT * FROM clientes ORDER BY nome');
        return rows.map((c) => new Cliente(c.id_cliente, c.nome, c.cpf, c.data_nascimento, c.multa));        
    } catch (err) {
        throw "Erro : " + err;
    }
}

const addClienteDB = async (body) => {
    try {   
        const { nome, cpf, data_nascimento, multa } = body; 
        const results = await pool.query(`INSERT INTO clientes (nome, cpf, data_nascimento, multa) 
            VALUES ($1, $2, $3, $4)
            returning id_cliente, nome, cpf, data_nascimento, multa`,
        [nome, cpf, data_nascimento, multa]);
        const c = results.rows[0];
        return new Cliente(c.id_cliente, c.nome, c.cpf, c.data_nascimento, c.multa); 
    } catch (err) {
        throw "Erro ao inserir o cliente: " + err;
    }    
}

const updateClienteDB = async (body) => {
    try {   
        const { id_cliente, nome, cpf, data_nascimento, multa } = body; 
        const results = await pool.query(`UPDATE clientes set nome = $2, cpf = $3, data_nascimento = $4, multa = $5 
            where id_cliente = $1 
            returning id_cliente, nome, cpf, data_nascimento, multa`,
        [id_cliente, nome, cpf, data_nascimento, multa]);        
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${id_cliente} para ser alterado`;
        }
        const c = results.rows[0];
        return new Cliente(c.id_cliente, c.nome, c.cpf, c.data_nascimento, c.multa); 
    } catch (err) {
        throw "Erro ao alterar o cliente: " + err;
    }      
}

const deleteClienteDB = async (codigo) => {
    try {           
        const results = await pool.query(`DELETE FROM clientes where id_cliente = $1`,
        [codigo]);
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo} para ser removido`;
        } else {
            return "Cliente removido com sucesso";
        }       
    } catch (err) {
        throw "Erro ao remover o cliente: " + err;
    }     
}

const getClientePorCodigoDB = async (codigo) => {
    try {           
        const results = await pool.query(`SELECT * FROM clientes where id_cliente = $1`,
        [codigo]);
        if (results.rowCount == 0){
            throw "Nenhum registro encontrado com o código: " + codigo;
        } else {
            const c = results.rows[0];
            return new Cliente(c.id_cliente, c.nome, c.cpf, c.data_nascimento, c.multa); 
        }       
    } catch (err) {
        throw "Erro ao recuperar o cliente: " + err;
    }     
}

module.exports = {
    getClientesDB, addClienteDB, updateClienteDB, deleteClienteDB, getClientePorCodigoDB
}