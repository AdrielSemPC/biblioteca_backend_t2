const { pool } = require('../config');
const Bibliotecario = require('../entities/bibliotecario');

const getBibliotecariosDB = async () => {
    try {    
        const { rows } = await pool.query('SELECT * FROM bibliotecarios ORDER BY nome');
        return rows.map((b) => new Bibliotecario(b.id_bibliotecario, b.nome, b.cpf, b.data_nascimento));        
    } catch (err) {
        throw "Erro : " + err;
    }
}

const addBibliotecarioDB = async (body) => {
    try {   
        const { nome, cpf, data_nascimento } = body; 
        const results = await pool.query(`INSERT INTO bibliotecarios (nome, cpf, data_nascimento) 
            VALUES ($1, $2, $3)
            returning id_bibliotecario, nome, cpf, data_nascimento`,
        [nome, cpf, data_nascimento]);
        const b = results.rows[0];
        return new Bibliotecario(b.id_bibliotecario, b.nome, b.cpf, b.data_nascimento); 
    } catch (err) {
        throw "Erro ao inserir o bibliotecário: " + err;
    }    
}

const updateBibliotecarioDB = async (body) => {
    try {   
        const { id_bibliotecario, nome, cpf, data_nascimento } = body; 
        const results = await pool.query(`UPDATE bibliotecarios SET nome = $2, cpf = $3, data_nascimento = $4 
            WHERE id_bibliotecario = $1 
            returning id_bibliotecario, nome, cpf, data_nascimento`,
        [id_bibliotecario, nome, cpf, data_nascimento]);        
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${id_bibliotecario} para ser alterado`;
        }
        const b = results.rows[0];
        return new Bibliotecario(b.id_bibliotecario, b.nome, b.cpf, b.data_nascimento); 
    } catch (err) {
        throw "Erro ao alterar o bibliotecário: " + err;
    }      
}

const deleteBibliotecarioDB = async (codigo) => {
    try {           
        const results = await pool.query(`DELETE FROM bibliotecarios where id_bibliotecario = $1`,
        [codigo]);
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo} para ser removido`;
        } else {
            return "Bibliotecário removido com sucesso";
        }       
    } catch (err) {
        throw "Erro ao remover o bibliotecário: " + err;
    }     
}

const getBibliotecarioPorCodigoDB = async (codigo) => {
    try {           
        const results = await pool.query(`SELECT * FROM bibliotecarios where id_bibliotecario = $1`,
        [codigo]);
        if (results.rowCount == 0){
            throw "Nenhum registro encontrado com o código: " + codigo;
        } else {
            const b = results.rows[0];
            return new Bibliotecario(b.id_bibliotecario, b.nome, b.cpf, b.data_nascimento); 
        }       
    } catch (err) {
        throw "Erro ao recuperar o bibliotecário: " + err;
    }     
}

module.exports = {
    getBibliotecariosDB, 
    addBibliotecarioDB, 
    updateBibliotecarioDB, 
    deleteBibliotecarioDB, 
    getBibliotecarioPorCodigoDB
}