# Prova de Recrutamento (Sólides) - Cadastro de Pessoas e Cálculo de Peso Ideal

Esta é uma aplicação Fullstack completa, containerizada com Docker, que implementa um CRUD (Cadastrar, Buscar, Alterar, Excluir) de Pessoas, seguindo uma arquitetura de microsserviços (backend e frontend desacoplados). O frontend foi feito em Angular e o backend é uma API REST construída em Django Rest Framework que se comunica com um banco de dados PostgreSQL.

# Procedimento para executar o projeto
## Construa os containers:
Este comando irá construir as imagens do backend e frontend e iniciar os três containers (db, backend, frontend) em modo "detached" (em segundo plano). `docker-compose up -d --build`

# URL do Cliente Angular
http://localhost:4200

# URL da API Django
http://localhost:8000

#
Desenvolvido por Lucas Santana
