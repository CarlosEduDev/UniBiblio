# 📚 Sistema de Gerenciamento de Biblioteca

Este é um sistema completo e moderno para gerenciamento de uma biblioteca acadêmica, desenvolvido como um projeto fullstack. A aplicação permite o cadastro de usuários, controle do acervo de livros, além do fluxo automatizado de empréstimos e devoluções com regras de integridade referencial rígidas no banco de dados.

O projeto foi totalmente conteinerizado utilizando **Docker**, permitindo que todo o ecossistema (Banco de Dados, Back-end e Front-end) seja inicializado de forma centralizada através de um único comando.

---

## 🛠️ Tecnologias Utilizadas

### **Front-end**
* **React** com **TypeScript**
* **Vite** (Build tool rápida e moderna)
* **Axios** (Integração e consumo da API HTTP)

### **Back-end**
* **Java 21**
* **Spring Boot 3.3.x**
* **Spring Data JPA** (Persistência e mapeamento ORM)

### **Banco de Dados & Infraestrutura**
* **PostgreSQL 15** (Banco de dados relacional)
* **pgAdmin 4** (Ambiente gráfico para gerenciamento do banco)
* **Docker & Docker Compose** (Orquestração de ambientes)

---

## 📊 Arquitetura e Regras de Negócio do Sistema

* **Dashboard Centralizado:** Exibe indicadores em tempo real extraídos diretamente do banco de dados (Total de usuários, total de livros no acervo, livros disponíveis e livros atualmente sob empréstimo).
* **Integridade Cadastral (Segurança de Histórico):** Usuários e Livros que possuem transações ou históricos de empréstimos vinculados no passado **não podem ser deletados**. O sistema bloqueia a exclusão via *Constraint Error* do banco de dados para blindar e auditar o histórico, permitindo apenas a atualização segura dos dados cadastrais através do formulário dinâmico.
* **Fluxo de Empréstimos Automatizado:** Ao realizar um empréstimo, o status do livro é alterado automaticamente para `EMPRESTADO`. Ao realizar a baixa (devolução), o livro retorna imediatamente ao status `DISPONIVEL` para novas locações.

---

## 🔄 Arquitetura do CRUD & Regras de Integridade

O CRUD (Create, Read, Update, Delete) deste sistema foi desenhado seguindo padrões rígidos de governança de dados e integridade referencial:

*   **Create (Mapeamento de Entidades):** O cadastro de livros e usuários valida os dados e os persiste via Spring Data JPA. Os livros novos nascem automaticamente com o status `DISPONIVEL`.
*   **Read (Consultas Otimizadas):** A listagem de dados consome endpoints REST de forma assíncrona com o React `useEffect`. O Dashboard centraliza múltiplas requisições paralelas utilizando `Promise.all` para calcular indicadores em tempo real sem sobrecarregar o banco.
*   **Update (Formulários Dinâmicos Inteligentes):** Em vez de abrir novas páginas para edição, a interface utiliza um estado dinâmico. Ao clicar em "Editar", o formulário de cadastro se transforma em um formulário de alteração, enviando uma requisição `PUT` para o back-end. O histórico de empréstimos também faz uso extensivo do `UPDATE` para gerenciar as transações de controle de estoque de livros (alternando entre `EMPRESTADO` e `DISPONIVEL`).
*   **A Abordagem do Delete (Proteção de Histórico):** Como este é um sistema administrativo de biblioteca, a exclusão física (`DELETE`) de registros com histórico foi omitida por questões de segurança. Se um livro ou usuário possuir um registro de empréstimo ativo ou passado, o banco de dados bloqueia a deleção via *Foreign Key Constraint*. Isso impede o surgimento de "dados órfãos" e garante que o histórico de movimentações da biblioteca nunca seja corrompido ou apagado por acidente.

## 🚀 Como Executar o Projeto com Apenas 1 Comando

Graças à conteinerização do ecossistema, você não precisa ter o Java, Node ou PostgreSQL instalados localmente na sua máquina física. Apenas o **Docker** e o **Docker Compose** são necessários.

### **Passo a Passo:**

1. Certifique-se de que o Docker esteja rodando em segundo plano na sua máquina.
2. Abra o terminal na raiz principal deste projeto (onde o arquivo `docker-compose.yml` está localizado).
3. Execute o comando abaixo para compilar o código e subir todos os serviços:

```bash
docker compose up --build
