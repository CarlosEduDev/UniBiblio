package com.biblioteca.backend.model;


import jakarta.persistence.*;

@Entity
@Table(name = "livrotb")
public class Livro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, length = 100)
    private String autor;

    @Column(nullable = false, unique = true, length = 20)
    private String isbn;

    @Column(name = "ano_publicacao", nullable = false)
    private Integer anoPublicacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusLivro status = StatusLivro.DISPONIVEL;

    public Livro(Long id, String titulo, String autor, String isbn, Integer anoPublicacao, StatusLivro status) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
        this.anoPublicacao = anoPublicacao;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getAutor() {
        return autor;
    }

    public String getIsbn() {
        return isbn;
    }

    public Integer getAnoPublicacao() {
        return anoPublicacao;
    }

    public StatusLivro getStatus() {
        return status;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public void setAnoPublicacao(Integer anoPublicacao) {
        this.anoPublicacao = anoPublicacao;
    }

    public void setStatus(StatusLivro status) {
        this.status = status;
    }
}
