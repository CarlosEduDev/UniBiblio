package com.biblioteca.backend.controller;

import com.biblioteca.backend.model.Livro;
import com.biblioteca.backend.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/livros")
@CrossOrigin(origins = "http://localhost:5173")
public class LivroController {
    @Autowired
    private LivroRepository livroRepository;

    @GetMapping
    public List<Livro> listarLivros(){
        return livroRepository.findAll();
    }

    @PostMapping
    public Livro criarLivro(@RequestBody Livro livro){
        return livroRepository.save(livro);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscarPorId(@PathVariable Long id){
        return livroRepository.findById(id).map(livro -> ResponseEntity.ok().body(livro))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<Livro> atualizarLivro(@PathVariable Long id, @RequestBody Livro livroDado){
        return livroRepository.findById(id).map(livro -> {
            livro.setTitulo(livro.getTitulo());
            livro.setAnoPublicacao(livro.getAnoPublicacao());
            livro.setAutor(livroDado.getAutor());
            livro.setIsbn(livroDado.getIsbn());
            livro.setStatus(livroDado.getStatus());
            Livro atualizado = livroRepository.save(livro);

            return ResponseEntity.ok().body(atualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletarLivro(@PathVariable Long id){
        return livroRepository.findById(id).map(livro -> {
            livroRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
