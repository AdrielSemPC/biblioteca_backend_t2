const { getLivrosDB, addLivroDB, updateLivroDB, deleteLivroDB, getLivroPorCodigoDB } = require('../usecases/livroUseCases')

const getLivros = async (request, response) => {
    await getLivrosDB()
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: 'Erro ao consultar os livros: ' + err
        }));
}

const addLivro = async (request, response) => {
    await addLivroDB(request.body)
        .then(data => response.status(200).json({
            status: "success", message: "Livro criado",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

const updateLivro = async (request, response) => {
    await updateLivroDB(request.body, parseInt(request.params.codigo))
        .then(data => response.status(200).json({
            status: "success", message: "Livro alterado",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

const deleteLivro = async (request, response) => {
    await deleteLivroDB(parseInt(request.params.codigo))
        .then(data => response.status(200).json({
            status: "success", message: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));        
}

const getLivroPorCodigo = async (request, response) => {
    await getLivroPorCodigoDB(parseInt(request.params.codigo))
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));           
}

module.exports = {
    getLivros, addLivro, updateLivro, deleteLivro, getLivroPorCodigo
}