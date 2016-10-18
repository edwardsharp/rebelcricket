#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER rebelcricket;
    CREATE DATABASE rebelcricket;
    GRANT ALL PRIVILEGES ON DATABASE rebelcricket TO rebelcricket;
EOSQL