const jwt = require('jsonwebtoken');
require("dotenv-safe").config();

const {
    getUsuariosDB,
    addUsuarioDB,
    updateUsuarioDB,
    deleteUsuarioDB,
    getUsuarioPorEmailDB,
    getUsuarioLogadoDB,
    updateUsuarioLogadoDB,
    deleteUsuarioLogadoDB
} = require('../usecases/usuarioUseCases')

const trataErroUsuario = (response, err) => {
    const message = String(err?.message || err);
    const usuarioNaoEncontrado = message.includes('Nenhum registro encontrado');

    return response.status(usuarioNaoEncontrado ? 404 : 400).json({
        status: 'error',
        message: usuarioNaoEncontrado ? 'Usuario nao encontrado.' : message
    });
}

const getUsuarios = async (request, response) => {
    await getUsuariosDB()
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: 'Erro ao consultar os usuarios: ' + err
        }));
}

const addUsuario = async (request, response) => {
    await addUsuarioDB(request.body)
        .then(data => response.status(201).json({
            status: "success", message: "Usuario criado",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

const updateUsuario = async (request, response) => {
    const usuarioLogado = request.usuario;
    if (!usuarioLogado) {
        return response.status(403).json({
            status: 'error',
            message: 'Acesso negado. Usuario nao autenticado.'
        });
    }

    const isAdmin = usuarioLogado.tipo === 'A';
    const editandoOutro = usuarioLogado.email !== request.params.email;

    if (!isAdmin && editandoOutro) {
        return response.status(403).json({
            status: 'error',
            message: 'Acesso negado. Voce so pode alterar seu proprio cadastro.'
        });
    }

    // Protecao: admin nao pode alterar o proprio tipo
    if (isAdmin && !editandoOutro) {
        // remove tipo de body para evitar mudanca do proprio privilegio
        if (request.body && Object.prototype.hasOwnProperty.call(request.body, 'tipo')) {
            delete request.body.tipo;
        }
    }

    await updateUsuarioDB(request.body, request.params.email)
        .then(data => {
            // If user updated their own data, return new token. If admin updated other user, no token.
            if (!editandoOutro) {
                const token = jwt.sign({ usuario: data }, process.env.SECRET, {
                    expiresIn: 300
                });

                response.status(200).json({
                    status: "success",
                    message: "Usuario alterado",
                    objeto: data,
                    auth: true,
                    token
                });
            } else {
                response.status(200).json({
                    status: "success",
                    message: "Usuario alterado",
                    objeto: data
                });
            }
        })
        .catch(err => trataErroUsuario(response, err));
}

const deleteUsuario = async (request, response) => {
    const usuarioLogado = request.usuario;
    const podeExcluir = usuarioLogado && (usuarioLogado.tipo === 'A' || usuarioLogado.email === request.params.email);
    if (!podeExcluir) {
        return response.status(403).json({
            status: 'error',
            message: 'Acesso negado. Voce so pode excluir seu proprio cadastro ou ser administrador.'
        });
    }

    await deleteUsuarioDB(request.params.email)
        .then(data => response.status(200).json({
            status: "success", message: data
        }))
        .catch(err => trataErroUsuario(response, err));        
}

const getUsuarioPorEmail = async (request, response) => {
    const usuarioLogado = request.usuario;
    const podeConsultar = usuarioLogado && (usuarioLogado.tipo === 'A' || usuarioLogado.email === request.params.email);
    if (!podeConsultar) {
        return response.status(403).json({
            status: 'error',
            message: 'Acesso negado. Voce so pode consultar seu proprio cadastro ou ser administrador.'
        });
    }

    await getUsuarioPorEmailDB(request.params.email)
        .then(data => response.status(200).json(data))
        .catch(err => trataErroUsuario(response, err));           
}

const addUsuarioPublico = async (request, response) => {
    await addUsuarioDB(request.body, 'U')
        .then(data => response.status(201).json({
            status: "success",
            message: "Usuario criado com sucesso",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

const getMeuUsuario = async (request, response) => {
    await getUsuarioLogadoDB(request.usuario.email)
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

const updateMeuUsuario = async (request, response) => {
    await updateUsuarioLogadoDB(request.body, request.usuario.email)
        .then(data => {
            const token = jwt.sign({ usuario: data }, process.env.SECRET, {
                expiresIn: 300
            });
            response.status(200).json({
                status: "success",
                message: "Usuario alterado com sucesso",
                objeto: data,
                auth: true,
                token
            });
        })
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

const deleteMeuUsuario = async (request, response) => {
    await deleteUsuarioLogadoDB(request.usuario.email)
        .then(data => response.status(200).json({
            status: "success",
            message: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

module.exports = {
    getUsuarios,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuarioPorEmail,
    addUsuarioPublico,
    getMeuUsuario,
    updateMeuUsuario,
    deleteMeuUsuario
}
