class Emprestimo {
    constructor(id_emprestimo, id_cliente, id_livro, id_bibliotecario, data_inicio, data_fim, data_devolucao, status) {
        this.id_emprestimo = id_emprestimo;
        this.id_cliente = id_cliente;
        this.id_livro = id_livro;
        this.id_bibliotecario = id_bibliotecario;
        this.data_inicio = data_inicio;
        this.data_fim = data_fim;
        this.data_devolucao = data_devolucao;
        this.status = status;
    }
}

module.exports = Emprestimo;