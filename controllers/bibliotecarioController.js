const { getBibliotecariosDB, addBibliotecarioDB, updateBibliotecarioDB, deleteBibliotecarioDB, getBibliotecarioPorCodigoDB } = require('../usecases/bibliotecarioUseCases')

const getBibliotecarios = async (request, response) => {
    await getBibliotecariosDB()
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: 'Erro ao consultar os bibliotecários: ' + err
        }));
}

const addBibliotecario = async (request, response) => {
    await addBibliotecarioDB(request.body)
        .then(data => response.status(200).json({
            status: "success", message: "Bibliotecário criado",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

const updateBibliotecario = async (request, response) => {
    await updateBibliotecarioDB(request.body, parseInt(request.params.codigo))
        .then(data => response.status(200).json({
            status: "success", message: "Bibliotecário alterado",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

const deleteBibliotecario = async (request, response) => {
    await deleteBibliotecarioDB(parseInt(request.params.codigo))
        .then(data => response.status(200).json({
            status: "success", message: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));        
}

const getBibliotecarioPorCodigo = async (request, response) => {
    await getBibliotecarioPorCodigoDB(parseInt(request.params.codigo))
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));           
}

module.exports = {
    getBibliotecarios, addBibliotecario, updateBibliotecario, deleteBibliotecario, getBibliotecarioPorCodigo
}