var http = require("http")
var url = require("url")
var axios = require("axios")

function genCityBlock(city) {
    return `
    <a 
        class="flex flex-col w-96 bg-white shadow-sm rounded-xl border p-4 font-[600] text-lg space-y-4 hover:shadow-md hover:-translate-y-1 transition-all"
        href="${'cidades/' + city.id}"
    >
        <div class="flex items-center space-x-4">                
            <i class="bi bi-geo-fill text-orange-500 text-xl w-fit min-w-fit"></i>
            <p class="text-wrap">
                ${city.nome}
            </p>
        </div>            
    </a>
    `
}

function genCitiesPage(cities) {
    return `
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
            <title>Mapa Virtual</title>
        </head>
        <body class="flex flex-col h-screen justify-between bg-neutral-100" style="font-family: Inter, sans-serif;">
            <header class="w-full bg-white border-b shadow-sm text-orange-600 font-medium text-3xl p-4 flex space-x-3 place-content-center">
                <i class="bi bi-map-fill"></i>
                <h1>Mapa Virtual</h1>
            </header>

            <main class="px-64 py-8 grid grid-cols-3 gap-3 mb-auto mx-auto overflow-y-scroll overflow-x-auto">
                ${cities.map(c => genCityBlock(c)).join('\n')}
            </main>

            <footer class="w-full bg-white border-t shadow-sm text-neutral-800 font-medium text-center p-4">
                <p>&copy; 2024 Diogo Matos. All rights reserved.</p>
            </footer>
        </body>
    </html>
    `
}

function genCityPage(city) {
    return `
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
            <title>${city.nome}</title>
        </head>
        <body class="flex flex-col h-screen justify-between bg-neutral-100" style="font-family: Inter, sans-serif;">
            <header class="w-full bg-white border-b shadow-sm text-orange-600 font-medium text-3xl p-4 flex space-x-3 place-content-center">
                <i class="bi bi-map-fill"></i>
                <h1>Mapa Virtual</h1>
            </header>

            <main class="flex flex-col px-[35rem] py-8 mb-auto overflow-y-scroll overflow-x-auto space-y-8">
                <div class="flex place-content-between mx-auto w-full items-center">
                    <a                    
                        class="flex w-16 h-16 rounded-xl bg-orange-100 text-orange-500 text-3xl items-center text-center hover:bg-orange-500 hover:text-white transition-all"
                        href="/cidades"    
                    >
                        <p class="mx-auto">
                            <-
                        </p>
                    </a>
                    <span class="flex space-x-4 items-center mx-auto">
                        <i class="bi bi-geo-fill text-orange-500 text-5xl"></i> 
                        <p class="text-6xl font-bold">${city.nome}</p>
                    </span>
                </div>                
                <div class="grid grid-cols-2 gap-4 w-full mx-auto">
                    <div class="flex flex-col bg-white text-center shadow-sm rounded-xl border p-4 text-lg space-y-4 space-x-4">
                        <span class="flex items-center space-x-2 mx-auto text-xl">
                            <i class="bi bi-person-standing text-orange-500"></i> 
                            <p class="font-medium">População</p>
                        </span>                    
                        <p class="font-bold text-2xl mx-auto">${city.população}</p>
                    </div>
                    <div class="flex flex-col bg-white text-center shadow-sm rounded-xl border p-4 text-lg space-y-4 space-x-4">
                        <span class="flex items-center space-x-2 mx-auto text-xl">
                            <i class="bi bi-geo-alt-fill text-orange-500"></i>
                            <p class="font-medium">Distrito</p>
                        </span>                    
                        <p class="font-bold text-2xl mx-auto">${city.distrito}</p>
                    </div>
                    <div class="col-span-2 flex flex-col bg-white text-center shadow-sm rounded-xl border p-4 text-lg space-y-4">
                        <span class="flex items-center space-x-2 mx-auto text-xl">
                            <i class="bi bi-info-circle-fill text-orange-500"></i>
                            <p class="font-medium">Descrição</p>
                        </span>                    
                        <p class="mx-auto text-justify">${city.descrição}</p>
                    </div>
                </div>
            </main>

            <footer class="w-full bg-white border-t shadow-sm text-neutral-800 font-medium text-center p-4">
                <p>&copy; 2024 Diogo Matos. All rights reserved.</p>
            </footer>
        </body>
    </html>
    `
}

http.createServer((request, response) => {
    var q = url.parse(request.url, true)
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})

    if (q.pathname == "/cidades") {
        axios.get("http://localhost:3000/cidades?_sort=nome")
            .then((resp) => {
                var data = resp.data
                response.write(genCitiesPage(data))
                response.end()
            })
            .catch((err) => {
                console.log("Erro: " + err)
                response.write("<p>" + err + "</p>")
            })
    }
    else if (q.pathname.startsWith("/cidades/")) {
        axios.get("http://localhost:3000/cidades?id=" + q.pathname.split("/")[2])
            .then((resp) => {
                var data = resp.data
                response.write(genCityPage(data[0]))
                response.end()
            })
    }
    else {
        response.write("Operação não suportada.")
        response.end()
    }
}).listen(1234)
