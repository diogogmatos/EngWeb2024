# TPC4 - Compositores Musicais

> 📅 2024-03-08

> 👤 Diogo Gomes Matos, A100741

## Enunciado

Para este trabalho prático, foi fornecido pelo docente um ficheiro `.json` com informações acerca de diversos compositores musicais de diferentes períodos históricos. O objetivo foi criar um servidor Node.js (JavaScript) que, através de pedidos à API do `json-server` (que se alimenta do ficheiro fornecido), apresenta um pequeno website que, para além de permitir navegar pelas informações, permite também Adicionar, Remover e Editar informações da base de dados, implementando assim as operações CRUD (Create, Read, Update, Delete).

O website contém uma página inicial com uma lista de todos os compositores musicais registados, ordenados por ordem alfabética (Read). Para além disso inclui também dois botões que permitem adicionar e remover compositores, levando cada um deles para páginas dedicadas a esse efeito (Create, Delete). Clicar num compositor leva o utilizador para a página do mesmo, onde todas as suas informações estão disponíveis, assim como um botão "Editar" que leva o utilizador para uma subpágina que permite editar as informações desse compositor (Update). Adicionalmente, existe uma página que apresenta todos os períodos históricos existentes, onde clicar num deles apresenta todos os compositores desse período em específico.
