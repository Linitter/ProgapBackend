#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
CREATE USER api_servidores;
ALTER USER api_servidores PASSWORD 'api_password';
SELECT 'CREATE DATABASE gap_project' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gap_project')\gexec
GRANT ALL PRIVILEGES ON DATABASE gap_project TO api_servidores;
EOSQL

