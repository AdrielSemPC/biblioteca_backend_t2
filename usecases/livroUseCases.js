const { pool } = require('../config');
const Livro = require('../entities/livro');

const getLivrosDB = async () => {
    try {    
        const { rows } = await pool.query('SELECT * FROM livros ORDER BY titulo');
        return rows.map((l) => new Livro(l.id_livro, l.titulo, l.edicao, l.ano, l.isbn));        
    } catch (err) {
        throw "Erro : " + err;
    }
}

const addLivroDB = async (body) => {
    try {   
        const { titulo, edicao, ano, isbn } = body; 
        const results = await pool.query(`INSERT INTO livros (titulo, edicao, ano, isbn) 
            VALUES ($1, $2, $3, $4)
            returning id_livro, titulo, edicao, ano, isbn`,
        [titulo, edicao, ano, isbn]);
        const l = results.rows[0];
        return new Livro(l.id_livro, l.titulo, l.edicao, l.ano, l.isbn); 
    } catch (err) {
        throw "Erro ao inserir o livro: " + err;
    }    
}

const updateLivroDB = async (body, codigo) => {
    try {   
        const { titulo, edicao, ano, isbn } = body; 
        const results = await pool.query(`UPDATE livros set titulo = $2, edicao = $3, ano = $4, isbn = $5 
            where id_livro = $1 
            returning id_livro, titulo, edicao, ano, isbn`,
        [codigo, titulo, edicao, ano, isbn]);        
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo} para ser alterado`;
        }
        const l = results.rows[0];
        return new Livro(l.id_livro, l.titulo, l.edicao, l.ano, l.isbn); 
    } catch (err) {
        throw "Erro ao alterar o livro: " + err;
    }      
}

const deleteLivroDB = async (codigo) => {
    try {           
        const results = await pool.query(`DELETE FROM livros where id_livro = $1`,
        [codigo]);
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo} para ser removido`;
        } else {
            return "Livro removido com sucesso";
        }       
    } catch (err) {
        throw "Erro ao remover o livro: " + err;
    }     
}

const getLivroPorCodigoDB = async (codigo) => {
    try {           
        const results = await pool.query(`SELECT * FROM livros where id_livro = $1`,
        [codigo]);
        if (results.rowCount == 0){
            throw "Nenhum registro encontrado com o código: " + codigo;
        } else {
            const l = results.rows[0];
            return new Livro(l.id_livro, l.titulo, l.edicao, l.ano, l.isbn); 
        }       
    } catch (err) {
        throw "Erro ao recuperar o livro: " + err;
    }     
}

module.exports = {
    getLivrosDB, addLivroDB, updateLivroDB, deleteLivroDB, getLivroPorCodigoDB
}