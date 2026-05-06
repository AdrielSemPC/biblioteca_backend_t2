const { pool } = require('../config');
const Emprestimo = require('../entities/emprestimo');

// usecases/emprestimoUseCases.js

const getEmprestimosDB = async () => {
    try {    
        const { rows } = await pool.query(`
            SELECT e.*, 
                   c.nome as cliente_nome, 
                   l.titulo as livro_titulo, 
                   b.nome as bibliotecario_nome
            FROM emprestimos e
            JOIN clientes c ON e.id_cliente = c.id_cliente
            JOIN livros l ON e.id_livro = l.id_livro
            JOIN bibliotecarios b ON e.id_bibliotecario = b.id_bibliotecario
            ORDER BY e.data_inicio DESC
        `);
        
        return rows.map((e) => ({
            ...e,
            cliente_nome: e.cliente_nome,
            livro_titulo: e.livro_titulo,
            bibliotecario_nome: e.bibliotecario_nome
        }));        
    } catch (err) {
        throw "Erro ao recuperar empréstimos: " + err;
    }
}

const addEmprestimoDB = async (body) => {
    try {   
        const { id_cliente, id_livro, id_bibliotecario } = body; 

        const clienteRes = await pool.query('SELECT multa, cpf FROM clientes WHERE id_cliente = $1', [id_cliente]);
        if (clienteRes.rowCount === 0) throw "Cliente não encontrado";
        
        const cliente = clienteRes.rows[0];
        const biblioRes = await pool.query('SELECT id_bibliotecario FROM bibliotecarios WHERE cpf = $1', [cliente.cpf]);
        const ehBibliotecario = biblioRes.rowCount > 0;

        if (cliente.multa > 0 && !ehBibliotecario) {
            throw "Cliente possui multa pendente e não pode realizar novos empréstimos";
        }

        if (!ehBibliotecario) {
            const qtdLivros = await pool.query(
                'SELECT count(*) FROM emprestimos WHERE id_cliente = $1 AND status = $2', 
                [id_cliente, 'ATIVO']
            );
            if (parseInt(qtdLivros.rows[0].count) >= 3) {
                throw "Cliente já atingiu o limite máximo de 3 livros alugados";
            }
        }

        const livroCheck = await pool.query(
            'SELECT id_emprestimo FROM emprestimos WHERE id_livro = $1 AND status = $2', 
            [id_livro, 'ATIVO']
        );
        if (livroCheck.rowCount > 0) {
            throw "Este livro já está emprestado e não está disponível no momento";
        }

        const data_inicio = new Date();
        const data_fim = new Date();
        data_fim.setDate(data_inicio.getDate() + 7);

        const results = await pool.query(`
            INSERT INTO emprestimos (id_cliente, id_livro, id_bibliotecario, data_inicio, data_fim, status) 
            VALUES ($1, $2, $3, $4, $5, $6)
            returning id_emprestimo, id_cliente, id_livro, id_bibliotecario, data_inicio, data_fim, data_devolucao, status`,
        [id_cliente, id_livro, id_bibliotecario, data_inicio, data_fim, 'ATIVO']);
        
        const e = results.rows[0];
        return new Emprestimo(e.id_emprestimo, e.id_cliente, e.id_livro, e.id_bibliotecario, e.data_inicio, e.data_fim, e.data_devolucao, e.status); 

    } catch (err) {
        throw err;
    }    
}

const updateEmprestimoDB = async (body) => {
    try {   
        const { id_emprestimo, id_cliente, id_livro, id_bibliotecario, data_inicio, data_fim, data_devolucao, status } = body; 
        const results = await pool.query(`UPDATE emprestimos set id_cliente = $2, id_livro = $3, id_bibliotecario = $4, data_inicio = $5, data_fim = $6, data_devolucao = $7, status = $8 
            where id_emprestimo = $1 
            returning id_emprestimo, id_cliente, id_livro, id_bibliotecario, data_inicio, data_fim, data_devolucao, status`,
        [id_emprestimo, id_cliente, id_livro, id_bibliotecario, data_inicio, data_fim, data_devolucao, status]);        
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${id_emprestimo} para ser alterado`;
        }
        const e = results.rows[0];
        return new Emprestimo(e.id_emprestimo, e.id_cliente, e.id_livro, e.id_bibliotecario, e.data_inicio, e.data_fim, e.data_devolucao, e.status); 
    } catch (err) {
        throw "Erro ao alterar o empréstimo: " + err;
    }      
}

const finalizarEmprestimoDB = async (body) => {
    const client = await pool.connect();
    try { 
        const { id_emprestimo } = body;

        await client.query('BEGIN');

        const busca = await client.query(
            `SELECT id_cliente, data_fim, status FROM emprestimos WHERE id_emprestimo = $1`,
            [id_emprestimo]
        );

        if (busca.rowCount === 0) {
            throw `Empréstimo ${id_emprestimo} não encontrado.`;
        }

        const emprestimoAtual = busca.rows[0];
        
        if (emprestimoAtual.status === 'FINALIZADO') {
            throw "Este empréstimo já foi finalizado anteriormente.";
        }

        const dataFimPrevista = new Date(emprestimoAtual.data_fim);
        const dataAtual = new Date(); // Variável para CURRENT_DATE

        dataFimPrevista.setHours(0, 0, 0, 0);
        dataAtual.setHours(0, 0, 0, 0);

        let valorMultaCalculado = 0;

        if (dataAtual > dataFimPrevista) {
            const diferencaEmMilissegundos = dataAtual - dataFimPrevista;
            const diasDiferenca = Math.floor(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

            valorMultaCalculado = diasDiferenca * 5;
        }

        const results = await client.query(
            `UPDATE emprestimos 
             SET status = 'FINALIZADO', data_devolucao = $2 
             WHERE id_emprestimo = $1 
             RETURNING id_emprestimo, id_cliente, id_livro, id_bibliotecario, data_inicio, data_fim, data_devolucao, status`,
            [id_emprestimo, dataAtual]
        );       

        if (valorMultaCalculado > 0) {
            await client.query(
                `UPDATE clientes SET multa = multa + $1 WHERE id_cliente = $2`,
                [valorMultaCalculado, emprestimoAtual.id_cliente]
            );
        }

        await client.query('COMMIT');

        const e = results.rows[0];
        return {
            objeto: new Emprestimo(
                e.id_emprestimo, e.id_cliente, e.id_livro, e.id_bibliotecario, 
                e.data_inicio, e.data_fim, e.data_devolucao, e.status
            ),
            multa: valorMultaCalculado
        }; 

    } catch (err) {
        await client.query('ROLLBACK');
        throw "Erro ao finalizar o empréstimo: " + err;
    } finally {
        client.release();
    }
}

const deleteEmprestimoDB = async (codigo) => {
    try {           
        const results = await pool.query(`DELETE FROM emprestimos where id_emprestimo = $1`,
        [codigo]);
        if (results.rowCount == 0){
            throw `Nenhum registro encontrado com o código ${codigo} para ser removido`;
        } else {
            return "Empréstimo removido com sucesso";
        }       
    } catch (err) {
        throw "Erro ao remover o empréstimo: " + err;
    }     
}

const getEmprestimoPorCodigoDB = async (codigo) => {
    try {           
        const results = await pool.query(`SELECT * FROM emprestimos where id_emprestimo = $1`,
        [codigo]);
        if (results.rowCount == 0){
            throw "Nenhum registro encontrado com o código: " + codigo;
        } else {
            const e = results.rows[0];
            return new Emprestimo(e.id_emprestimo, e.id_cliente, e.id_livro, e.id_bibliotecario, e.data_inicio, e.data_fim, e.data_devolucao, e.status); 
        }       
    } catch (err) {
        throw "Erro ao recuperar o empréstimo: " + err;
    }     
}

module.exports = {
    getEmprestimosDB, addEmprestimoDB, updateEmprestimoDB, deleteEmprestimoDB, getEmprestimoPorCodigoDB, finalizarEmprestimoDB
}