#!/bin/sh
echo "O Docker Compose aguardou o PostgreSQL ficar pronto."

# Aplica as migrações do banco de dados
echo "Aplicando migrações do banco de dados..."
python manage.py migrate --noinput

# Inicia o servidor
python manage.py runserver 0.0.0.0:8000