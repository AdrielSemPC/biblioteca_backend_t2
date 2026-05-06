const { 
    getEmprestimosDB, 
    addEmprestimoDB, 
    updateEmprestimoDB, 
    deleteEmprestimoDB, 
    getEmprestimoPorCodigoDB,
    finalizarEmprestimoDB
} = require('../usecases/emprestimoUseCases');

const getEmprestimos = async (request, response) => {
    await getEmprestimosDB()
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: 'Erro ao consultar os empréstimos: ' + err
        }));
}

const addEmprestimo = async (request, response) => {
    await addEmprestimoDB(request.body)
        .then(data => response.status(200).json({
            status: "success", 
            message: "Empréstimo realizado com sucesso",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

const updateEmprestimo = async (request, response) => {
    await updateEmprestimoDB(request.body)
        .then(data => response.status(200).json({
            status: "success", 
            message: "Empréstimo alterado com sucesso",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
}

const deleteEmprestimo = async (request, response) => {
    await deleteEmprestimoDB(parseInt(request.params.codigo))
        .then(data => response.status(200).json({
            status: "success", 
            message: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));        
}

const getEmprestimoPorCodigo = async (request, response) => {
    await getEmprestimoPorCodigoDB(parseInt(request.params.codigo))
        .then(data => response.status(200).json(data))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));           
}

const finalizarEmprestimo = async (request, response) => {
    const id_da_url = request.params.codigo; 
    await finalizarEmprestimoDB({ id_emprestimo: id_da_url })
        .then(data => response.status(200).json({
            status: "success",
            message: "Empréstimo finalizado com sucesso (Status: FINALIZADO)",
            objeto: data
        }))
        .catch(err => response.status(400).json({
            status: 'error',
            message: err
        }));
};

module.exports = {
    getEmprestimos, 
    addEmprestimo, 
    updateEmprestimo, 
    deleteEmprestimo, 
    getEmprestimoPorCodigo,
    finalizarEmprestimo
}