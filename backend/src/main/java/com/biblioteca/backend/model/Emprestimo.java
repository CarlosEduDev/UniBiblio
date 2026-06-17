package com.biblioteca.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emprestimotb")

public class Emprestimo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "livro_id", nullable = false)
    private Livro livro;

    @Column(name = "data_emprestimo", nullable = false)
    private LocalDateTime dataEmprestimo;

    @Column(name = "data_devolucao_prevista", nullable = false)
    private LocalDateTime dataDevolucaoPrevista;

    @Column(name = "data_devolucao_real", nullable = false)
    private LocalDateTime dataDevolucaoReal;

    public Emprestimo(Long id, Usuario usuario, Livro livro, LocalDateTime dataEmprestimo, LocalDateTime dataDevolucaoPrevista, LocalDateTime dataDevolucaoReal) {
        this.id = id;
        this.usuario = usuario;
        this.livro = livro;
        this.dataEmprestimo = dataEmprestimo;
        this.dataDevolucaoPrevista = dataDevolucaoPrevista;
        this.dataDevolucaoReal = dataDevolucaoReal;
    }

    public Long getId() {
        return id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public Livro getLivro() {
        return livro;
    }

    public LocalDateTime getDataEmprestimo() {
        return dataEmprestimo;
    }

    public LocalDateTime getDataDevolucaoPrevista() {
        return dataDevolucaoPrevista;
    }

    public LocalDateTime getDataDevolucaoReal() {
        return dataDevolucaoReal;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public void setLivro(Livro livro) {
        this.livro = livro;
    }

    public void setDataEmprestimo(LocalDateTime dataEmprestimo) {
        this.dataEmprestimo = dataEmprestimo;
    }

    public void setDataDevolucaoPrevista(LocalDateTime dataDevolucaoPrevista) {
        this.dataDevolucaoPrevista = dataDevolucaoPrevista;
    }

    public void setDataDevolucaoReal(LocalDateTime dataDevolucaoReal) {
        this.dataDevolucaoReal = dataDevolucaoReal;
    }
}
