#!/bin/bash
set -e

#ALTER USER rebelcricket WITH SUPERUSER;
# CREATE USER rebelcricket WITH PASSWORD '$POSTGRES_PASSWORD';
# CREATE DATABASE rebelcricket OWNER rebelcricket;
# GRANT ALL PRIVILEGES ON DATABASE rebelcricket TO rebelcricket;

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    \connect rebelcricket;
    CREATE TABLE "public"."items" (
      "Company" text,
      "Item Number" text,
      "Description" text,
      "Features" text,
      "Piece" text,
      "Dozen" text,
      "Case" text,
      "Style Code" text,
      "Size Name" text,
      "Size Category" text,
      "Size Code" text,
      "Color Name" text,
      "Hex Code" text,
      "Color Code" text,
      "Weight" text,
      "Domain" text,
      "ProdDetail Image" text,
      "ProdGallery Image" text,
      "Retail Price" text,
      "Style Number" text,
      "GTIN Number" text,
      "Max Inventory" text,
      "Closeout" text,
      "Mill Name" text,
      "Pack Qty" text,
      "Case Qty" text,
      "Launch Date" text,
      "Coming Soon" text,
      "Front of Image Name" text,
      "Back of Image Name" text,
      "Side of Image Name" text,
      "PMS Code" text,
      "Size Sort Order" text
    );
    CREATE TABLE "public"."styles" (
      "Company" text,
      "Style Code" text,
      "Description" text,
      "Features" text,
      "Domain" text,
      "ProdDetail Image" text,
      "ProdThumbnail Image" text,
      "ProdCompare Image" text,
      "ProdSearch Image" text,
      "Mill-Category" text,
      "Mill Code" text,
      "Category Code" text,
      "Item Count" text,
      "Mill Name" text,
      "Category Name" text,
      "Popularity" text
    );

    ALTER TABLE public.items OWNER TO rebelcricket;
    ALTER TABLE public.styles OWNER TO rebelcricket;
EOSQL
