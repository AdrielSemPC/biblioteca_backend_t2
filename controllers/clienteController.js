const { getClientesDB, addClienteDB, updateClienteDB, deleteClienteDB, getClientePorCodigoDB } = require('../usecases/clienteUseCases')

const getClientes = async (request, response) => {
    await getClientesDB()
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: 'Erro ao consultar os clientes: ' + err
        }));
}

const addCliente = async (request, response) => {
    await addClienteDB(request.body)
        .then(data => response.status(200).json({
            status: "success", message: "Cliente criado",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

const updateCliente = async (request, response) => {
    await updateClienteDB(request.body, parseInt(request.params.codigo))
        .then(data => response.status(200).json({
            status: "success", message: "Cliente alterado",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

const deleteCliente = async (request, response) => {
    await deleteClienteDB(parseInt(request.params.codigo))
        .then(data => response.status(200).json({
            status: "success", message: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));        
}

const getClientePorCodigo = async (request, response) => {
    await getClientePorCodigoDB(parseInt(request.params.codigo))
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));           
}

module.exports = {
    getClientes, addCliente, updateCliente, deleteCliente, getClientePorCodigo
}