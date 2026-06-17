package com.biblioteca.backend.controller;

import com.biblioteca.backend.model.Emprestimo;
import com.biblioteca.backend.model.Livro;
import com.biblioteca.backend.model.StatusLivro;
import com.biblioteca.backend.repository.EmprestimoRepository;
import com.biblioteca.backend.repository.LivroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/emprestimos")
@CrossOrigin(origins = "http://localhost:5173")
public class EmprestimoController {
    @Autowired
    private EmprestimoRepository emprestimoRepository;

    @Autowired
    private LivroRepository livroRepository;

    @GetMapping
    public List<Emprestimo> listarEmprestimo(){
        return emprestimoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Object> realizarEmprestimo(@RequestBody Emprestimo emprestimo){
        Livro livro = livroRepository.findById(emprestimo.getLivro().getId()).orElse(null);

        if(livro == null || livro.getStatus() == StatusLivro.EMPRESTADO){
            return ResponseEntity.badRequest().body("Livro não disponível para empréstimo.");
        }

        emprestimo.setDataEmprestimo(LocalDateTime.now());
        emprestimo.setDataDevolucaoPrevista(LocalDateTime.now().plusDays(14));

        livro.setStatus(StatusLivro.EMPRESTADO);
        livroRepository.save(livro);

        Emprestimo novoEmprestimo = emprestimoRepository.save(emprestimo);
        return ResponseEntity.ok(novoEmprestimo);
    }

    @PutMapping("/{id}/devolucao")
    public ResponseEntity<String> registrarDevolucao(@PathVariable Long id){
        return emprestimoRepository.findById(id).map(emprestimo -> {
            emprestimo.setDataDevolucaoReal(LocalDateTime.now());

            Livro livro = emprestimo.getLivro();
            livro.setStatus(StatusLivro.DISPONIVEL);
            livroRepository.save(livro);

            emprestimoRepository.save(emprestimo);
            return ResponseEntity.ok().body("Devolução registrada com sucesso!");
        }).orElse(ResponseEntity.notFound().build());
    }
}
