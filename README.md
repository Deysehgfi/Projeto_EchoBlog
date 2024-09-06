### 1. **Visão Geral do Projeto**

O módulo de postagens do blog visa fornecer uma API para gerenciar o conteúdo de postagens, permitindo a criação, leitura, atualização e exclusão (CRUD) de postagens. Cada postagem deve ser capaz de incluir um título, conteúdo textual, data de publicação, autor e uma imagem associada. Esse módulo deve ser flexível o suficiente para permitir futuras expansões, como a adição de comentários, categorias e tags.

---

### 2. **Requisitos Funcionais**

### 2.1. **Postagens**

- **RF01 - Criar Postagem** ✅
    - O sistema deve permitir a criação de uma nova postagem com as seguintes informações:
        - `titulo` (obrigatório): Título da postagem.
        - `conteudo` (obrigatório): Texto ou corpo da postagem.
        - `dataPublicacao` (automático): Data e hora da criação da postagem.
        - `autor` (obrigatório): Nome ou identificador do autor da postagem.
        - `imagem` (opcional): URL ou caminho para a imagem associada à postagem.
    - **Endpoint:** `POST /postagens`
    - **Validação:** Os dados de entrada devem ser validados utilizando um esquema de validação adequado (por exemplo, utilizando a biblioteca Zod).
- **RF02 - Listar Postagens** ✅
    - O sistema deve permitir a listagem de todas as postagens, com suporte à paginação.
        - A listagem deve incluir:
            - `totalPostagens`: Total de postagens cadastradas.
            - `totalPaginas`: Número total de páginas.
            - `paginaAtual`: Página atual sendo visualizada.
            - `itemsPorPagina`: Número de postagens por página.
            - `proximaPagina`: URL para acessar a próxima página, se aplicável.
            - `postagens`: Lista de postagens da página atual.
    - **Endpoint:** `GET /postagens`
    - **Parâmetros:**
        - `page` (opcional): Número da página. Valor padrão: `1`.
        - `limit` (opcional): Número de itens por página. Valor padrão: `10`.
- **RF03 - Buscar Postagem por ID** ✅
    - O sistema deve permitir a busca de uma postagem específica pelo seu ID.
        - **Validação:** O ID deve ser validado utilizando um esquema de validação.
        - Se a postagem não for encontrada, o sistema deve retornar uma resposta de `404`.
    - **Endpoint:** `GET /postagens/:id`
- **RF04 - Atualizar Postagem** ✅
    - O sistema deve permitir a atualização de uma postagem específica pelo seu ID.
        - Campos que podem ser atualizados:
            - `titulo`
            - `conteudo`
            - `imagem`
        - **Validação:** O ID e os dados de entrada devem ser validados utilizando esquemas de validação apropriados.
        - Se a postagem não for encontrada, o sistema deve retornar uma resposta de `404`.
    - **Endpoint:** `PUT /postagens/:id`
- **RF05 - Excluir Postagem** ✅
    - O sistema deve permitir a exclusão de uma postagem específica pelo seu ID.
        - **Validação:** O ID deve ser validado utilizando um esquema de validação.
        - Se a postagem não for encontrada, o sistema deve retornar uma resposta de `404`.
    - **Endpoint:** `DELETE /postagens/:id`
- **RF06 - Upload de Imagem para Postagem**
    - O sistema deve permitir o upload de uma imagem associada a uma postagem.
        - O upload da imagem deve ser feito no momento da criação ou atualização da postagem.
        - A imagem deve ser armazenada em um diretório específico no projeto.
    - **Endpoint:** `POST /postagens/:id/imagem`
    - **Validação:** A imagem deve ser validada quanto ao tamanho máximo permitido e tipo de arquivo (por exemplo, JPEG, PNG).
