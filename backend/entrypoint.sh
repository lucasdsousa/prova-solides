#!/bin/sh
echo "O Docker Compose aguardou o PostgreSQL ficar pronto."

echo "Aplicando migrações do banco de dados..."
python manage.py migrate --noinput

python manage.py runserver 0.0.0.0:8000