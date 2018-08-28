#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER rebelcricket WITH PASSWORD "$POSTGRES_PASSWORD";
    CREATE DATABASE rebelcricket_production;
    GRANT ALL PRIVILEGES ON DATABASE rebelcricket_production TO rebelcricket;
    CREATE USER kan WITH PASSWORD 'board';
    CREATE DATABASE kanboard;
    GRANT ALL PRIVILEGES ON DATABASE kanboard TO kan;
EOSQL