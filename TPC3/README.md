# TPC3 - Filmes Americanos

> 📅 2024-02-26

> 👤 Diogo Gomes Matos, A100741

## Enunciado

Para este trabalho prático, foi fornecido pelo docente um ficheiro `.json` com informações acerca de diversos filmes americanos. O objetivo foi criar um servidor Node.js (JavaScript) que, através de pedidos à API do `json-server` (que se alimenta do ficheiro fornecido), apresenta um pequeno website que permite navegar pelas informações. O ficheiro fornecido teve de ser normalizado através de um script em Python de modo a corrigir erros de formatação e colocar o ficheiro num formato utilizável pelo `json-server`.

O website contém uma página inicial com uma lista de todos os filmes existentes no ficheiro, ordenados por ordem alfabética de título. Cada filme apresenta um sumário das suas informações. Cada filme compõe um botão que quando clicado leva para a página do filme, onde é apresentada toda a informação. Clicar num dos géneros ou atores presentes na informação de cada filme leva para uma página com a lista de filmes desse género ou a lista de filmes com esse ator, respetivamente. Adicionalmente, existe uma página de géneros, que apresenta todos os géneros de filme existentes com nomes clicáveis, e uma página de atores, que apresenta todos os atores participantes nos filmes com nomes clicáveis.
