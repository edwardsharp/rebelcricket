#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER rebelcricket WITH PASSWORD 'zYB27Bzwu54yNVgWe';
    CREATE DATABASE rebelcricket_production;
    GRANT ALL PRIVILEGES ON DATABASE rebelcricket_production TO rebelcricket;
EOSQL