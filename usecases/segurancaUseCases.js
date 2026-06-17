const { pool } = require('../config')
const Usuario = require('../entities/usuario')

const autenticaUsuarioDB = async (body) => {
    try {
        const { email, senha } = body
        const results = await pool.query(`SELECT * FROM usuarios WHERE email = $1 AND senha = $2`,
        [email, senha]);

        if (results.rowCount == 0) {
            throw new Error("Usuario nao existe ou senha invalida.");
        }

        const usuario = results.rows[0];
        return new Usuario(usuario.email, usuario.nome, usuario.telefone, usuario.tipo);
    } catch (err) {
        throw new Error(err.message || "Erro ao autenticar o usuario.");
    }
}

module.exports = {
    autenticaUsuarioDB
}
