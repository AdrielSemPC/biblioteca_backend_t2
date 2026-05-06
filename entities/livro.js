class Livro {
    constructor(id_livro, titulo, edicao, ano, isbn) {
        this.id_livro = id_livro;
        this.titulo = titulo;
        this.edicao = edicao;
        this.ano = ano;
        this.isbn = isbn;
    }
}
module.exports = Livro;