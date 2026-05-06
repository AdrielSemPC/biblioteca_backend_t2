class Cliente {
    constructor(id_cliente, nome, cpf, data_nascimento, multa) {
        this.id_cliente = id_cliente;
        this.nome = nome;
        this.cpf = cpf;
        this.data_nascimento = data_nascimento;
        this.multa = multa;
    }
}

module.exports = Cliente;