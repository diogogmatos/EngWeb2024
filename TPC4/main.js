var http = require("http");
var url = require("url");
var axios = require("axios");

const build = (title, content) => {
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
            <title>Compositores Musicais | ${title}</title>
        </head>
        <body class="flex flex-col h-screen justify-between bg-neutral-100" style="font-family: Inter, sans-serif;">
            <header class="w-full border-b bg-white shadow-sm p-4 flex flex-col space-y-6 place-content-center items-center">
                <span class="flex space-x-3 text-orange-800/80 font-medium text-3xl">
                    <i class="bi bi-music-note-list"></i>
                    <h1>Compositores Musicais</h1>
                </span>            
                <span class="flex space-x-8 text-lg font-medium">
                    <a href="/compositores" class="transition-all text-neutral-400 hover:text-neutral-900 ${
                      title === "Compositores" &&
                      "text-neutral-900 after:absolute after:ml-12 after:mt-3 after:flex after:h-1 after:w-12 after:rounded-t after:bg-orange-800/80"
                    }">
                        COMPOSITORES
                    </a>
                    <a href="/periodos" class="transition-all text-neutral-400 hover:text-neutral-900 ${
                      title === "Períodos" &&
                      "text-neutral-900 after:absolute after:ml-[22px] after:mt-3 after:flex after:h-1 after:w-12 after:rounded-t after:bg-orange-800/80"
                    }">
                        PERÍODOS
                    </a>
                </span>
            </header>  

            <main class="py-8 px-32 mb-auto mx-auto overflow-y-scroll overflow-x-auto space-y-8">
                ${
                  title === "Compositores"
                    ? `
                <div class="flex space-x-4 place-content-center">
                    <a href="/adicionar" class="w-64 rounded-xl flex space-x-2 items-center place-content-center bg-orange-800/80 text-white p-4 font-medium shadow-sm hover:shadow-md transition-all">
                        <i class="bi bi-person-plus-fill"></i>
                        <p>Adicionar Compositor</p>
                    </a>
                    <a href="/eliminar" class="w-64 rounded-xl flex space-x-2 items-center place-content-center bg-orange-800/80 text-white p-4 font-medium shadow-sm hover:shadow-md transition-all">
                        <i class="bi bi-person-dash-fill"></i>
                        <p>Eliminar Compositor</p>
                    </a>
                </div>
                `
                    : ""
                }
                ${
                  title === "Compositores" || title === "Períodos"
                    ? `
                <div class="grid grid-cols-4 gap-4">
                    ${content}
                </div>
                `
                    : `
                <div>
                    ${content}
                </div>
                `
                }                
            </main>

            <footer class="w-full bg-white border-t shadow-sm font-medium text-center p-4">
                <p>&copy; 2024 Diogo Matos. All rights reserved.</p>
            </footer>
        </body>
    </html>
    `;
};

function genLink(name) {
  return name.replaceAll(" ", "_");
}

function getNameFromLink(link) {
  return link.replaceAll("_", " ");
}

function genCompositorBlock(compositor) {
  return compositor && compositor.nome && compositor.periodo
    ? `
    <a href="/compositores/${compositor.id}" class="bg-white w-full px-6 p-4 rounded-xl border flex flex-col place-content-center shadow-sm hover:shadow-md hover:-translate-y-1 hover:cursor-pointer transition-all">
        <span class="flex space-x-2 items-center text-xl font-medium mx-auto">
            <i class="bi bi-person-fill"></i>
            <p class="text-center">${compositor.nome}</p>
        </span>
        <span class="flex space-x-2 items-center text-neutral-400 mx-auto">
            <i class="bi bi-music-note"></i>
            <p>${compositor.periodo}</p>
        </span>
    </a>
    `
    : "";
}

function genPeriodoBlock(periodo) {
  return `
    <a href="/periodos/${genLink(
      periodo
    )}" class="bg-white w-full px-6 p-4 rounded-xl border flex flex-col place-content-center shadow-sm hover:shadow-md hover:-translate-y-1 hover:cursor-pointer transition-all">
        <span class="flex space-x-2 items-center text-xl mx-auto font-medium">
            <i class="bi bi-music-note"></i>
            <p>${periodo}</p>
        </span>                
    </a>
    `;
}

function genCompositoresPage(compositores) {
  return `
    ${build("Compositores", compositores.map(genCompositorBlock).join("\n"))}
    `;
}

function genPeriodosPage(periodos) {
  return `
    ${build("Períodos", periodos.map(genPeriodoBlock).join("\n"))}
    `;
}

function genPeriodoPage(compositores) {
  return `
    ${build("Períodos", compositores.map(genCompositorBlock).join("\n"))}
    `;
}

function genAddCompositorPage() {
  return `
    ${build(
      "Adicionar Compositor",
      `
    <form action="/adicionar" method="post" class="flex flex-col space-y-4">
        <input type="text" name="nome" placeholder="Nome do Compositor" class="w-96 p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-800/80 focus:border-transparent transition-all">
        <input type="text" name="periodo" placeholder="Período do Compositor" class="w-96 p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-800/80 focus:border-transparent transition-all">
        <input type="text" name="dataNasc" placeholder="Data de Nascimento" class="w-96 p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-800/80 focus:border-transparent transition-all">
        <input type="text" name="dataObito" placeholder="Data de Óbito" class="w-96 p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-800/80 focus:border-transparent transition-all">
        <textarea name="bio" placeholder="Biografia" class="w-96 p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-800/80 focus:border-transparent transition-all"></textarea>
        <button type="submit" class="w-96 p-3 rounded-xl border bg-orange-800/80 text-white font-medium shadow-sm hover:shadow-md transition-all"><i class="bi bi-person-plus-fill"></i> Adicionar Compositor</button>
    </form>
    `
    )}`;
}

function genDeleteCompositorPage() {
    return `
    ${build(
    "Eliminar Compositor",
    `
    <form action="/eliminar" method="post" class="flex flex-col space-y-4">
        <input type="text" name="id" placeholder="ID do Compositor" class="w-96 p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-800/80 focus:border-transparent transition-all">
        <button type="submit" class="w-96 p-3 rounded-xl border bg-orange-800/80 text-white font-medium shadow-sm hover:shadow-md transition-all"><i class="bi bi-person-dash-fill"></i> Eliminar Compositor</button>
    </form>
    `
    )}`;
}

function genCompositorPage(compositor) {
  return `
    ${build(
      compositor.nome,
      `
    <div class="space-y-4 w-[45rem]">
        <a href="/compositores/${
          compositor.id
        }/editar" class="absolute bg-orange-800/80 rounded-xl p-4 text-white text-center w-[8rem] right-[30rem] font-medium shadow-sm hover:shadow-md"><i class="bi bi-pencil-fill"></i> Editar</a>
        <h1 class="text-4xl font-bold"><i class="bi bi-person-fill"></i> ${
          compositor.nome
        }</h1>
        <div class="text-neutral-400 font-medium" ><i class="bi bi-music-note"></i> ${
          compositor.periodo
        }</div>
        <div class="text-neutral-400 font-medium" ><i class="bi bi-heart-fill"></i> ${
          compositor.dataNasc ? compositor.dataNasc : "?"
        } até ${compositor.dataObito ? compositor.dataObito : "?"}</div>
        <h2 class="text-3xl font-bold"><i class="bi bi-justify-left"></i> Biografia</h2>
        <p class="text-justify">
            ${compositor.bio ? compositor.bio : "Sem biografia disponível."}
        </p>        
    </div>
    `
    )}`;
}

function genEditCompositorPage(compositor) {
  return `
    ${build(
      "Editar Compositor",
      `
    <form action="compositores/${compositor.id}/editar" method="post" class="flex flex-col space-y-4">
        <input type="text" name="nome" value="${compositor.nome}" class="w-96 p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-800/80 focus:border-transparent transition-all">
        <input type="text" name="periodo" value="${compositor.periodo}" class="w-96 p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-800/80 focus:border-transparent transition-all">
        <input type="text" name="dataNasc" value="${compositor.dataNasc}" class="w-96 p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-800/80 focus:border-transparent transition-all">
        <input type="text" name="dataObito" value="${compositor.dataObito}" class="w-96 p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-800/80 focus:border-transparent transition-all">
        <textarea name="bio" class="w-96 p-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-800/80 focus:border-transparent transition-all">${compositor.bio}</textarea>
        <button type="submit" class="w-96 p-3 rounded-xl border bg-orange-800/80 text-white font-medium shadow-sm hover:shadow-md transition-all"><i class="bi bi-pencil-fill"></i> Editar Compositor</button>
    </form>
    `
    )}
    `;
}

http
  .createServer((request, response) => {
    var q = url.parse(request.url, true);
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });

    if (q.pathname === "/compositores") {
      axios
        .get("http://localhost:3000/compositores?_sort=nome")
        .then((resp) => {
          var data = resp.data;
          response.write(genCompositoresPage(data));
          response.end();
        })
        .catch((err) => {
          console.log("Erro: " + err);
          response.write("<p>" + err + "</p>");
        });
    } else if (
      q.pathname.includes("/compositores/") &&
      q.pathname.includes("/editar") &&
      request.method === "GET"
    ) {
      axios
        .get(
          "http://localhost:3000/compositores?id=" + q.pathname.split("/")[2]
        )
        .then((resp) => {
          var data = resp.data;
          response.write(genEditCompositorPage(data[0]));
          response.end();
        })
        .catch((err) => {
          console.log("Erro: " + err);
          response.write("<p>" + err + "</p>");
        });
    } else if (
      q.pathname.includes("/compositores/") &&
      q.pathname.includes("/editar") &&
      request.method === "POST"
    ) {
      let id = q.pathname.split("/")[2];

      let body = "";
      request.on("data", (chunk) => {
        body += chunk.toString();
      });

      request.on("end", () => {
        const formData = {};
        body.split("&").forEach((keyValue) => {
          const [key, value] = keyValue.split("=");
          formData[decodeURIComponent(key)] = decodeURIComponent(value);
        });

        const newComposer = {
          id: id,
          nome: formData.nome.replaceAll("+", " "),
          periodo: formData.periodo.replaceAll("+", " "),
          dataNasc: formData.dataNasc,
          dataObito: formData.dataObito,
          bio: formData.bio.replaceAll("+", " "),
        };

        axios
          .patch("http://localhost:3000/compositores/" + id, newComposer)
          .then((res) => {
            console.log("Compositor editado com sucesso:", res.data);
            response.write(
              `<script>window.location.href = '/compositores/${id}';</script>`
            );
            response.end();
          })
          .catch((error) => {
            console.error("Error ao editar compositor:", error);
            response.write("Ocorreu um erro ao editar o compositor.");
            response.end();
          });
      });
    } else if (q.pathname.startsWith("/compositores/")) {
      axios
        .get(
          "http://localhost:3000/compositores?id=" + q.pathname.split("/")[2]
        )
        .then((resp) => {
          var data = resp.data;
          response.write(genCompositorPage(data[0]));
          response.end();
        })
        .catch((err) => {
          console.log("Erro: " + err);
          response.write("<p>" + err + "</p>");
        });
    } else if (q.pathname === "/periodos") {
      axios
        .get("http://localhost:3000/compositores?_sort=periodo")
        .then((resp) => {
          response.write(
            genPeriodosPage(
              [...new Set(resp.data.map((c) => c.periodo))].filter(
                (p) => p != undefined
              )
            )
          );
          response.end();
        })
        .catch((err) => {
          console.log("Erro: " + err);
          response.write("<p>" + err + "</p>");
        });
    } else if (q.pathname.startsWith("/periodos/")) {
      axios
        .get("http://localhost:3000/compositores?_sort=nome")
        .then((resp) => {
          var data = resp.data;
          response.write(
            genPeriodoPage(
              data.filter(
                (c) =>
                  c.periodo &&
                  c.periodo === getNameFromLink(q.pathname.split("/")[2])
              )
            )
          );
          response.end();
        })
        .catch((err) => {
          console.log("Erro: " + err);
          response.write("<p>" + err + "</p>");
        });
    } else if (q.pathname === "/adicionar" && request.method === "GET") {
      response.write(genAddCompositorPage());
      response.end();
    } else if (q.pathname === "/adicionar" && request.method === "POST") {
      let body = "";
      request.on("data", (chunk) => {
        body += chunk.toString();
      });

      request.on("end", () => {
        const formData = {};
        body.split("&").forEach((keyValue) => {
          const [key, value] = keyValue.split("=");
          formData[decodeURIComponent(key)] = decodeURIComponent(value);
        });

        const newComposer = {
          nome: formData.nome.replaceAll("+", " "),
          periodo: formData.periodo.replaceAll("+", " "),
          dataNasc: formData.dataNasc,
          dataObito: formData.dataObito,
          bio: formData.bio.replaceAll("+", " "),
        };

        axios
          .post("http://localhost:3000/compositores", newComposer)
          .then((res) => {
            console.log("Compositor adicionado com sucesso:", res.data);
            response.write(
              "<script>window.location.href = '/compositores';</script>"
            );
            response.end();
          })
          .catch((error) => {
            console.error("Error ao adicionar compositor:", error);
            response.write("Ocorreu um erro ao adicionar o compositor.");
            response.end();
          });
      });
    } else if (q.pathname === "/eliminar" && request.method === "GET") {
        response.write(genDeleteCompositorPage());
        response.end();
    } else if (q.pathname === "/eliminar" && request.method === "POST") {
        let body = "";
        request.on("data", (chunk) => {
          body += chunk.toString();
        });

        request.on("end", () => {
          const formData = {};
          body.split("&").forEach((keyValue) => {
            const [key, value] = keyValue.split("=");
            formData[decodeURIComponent(key)] = decodeURIComponent(value);
          });

          axios
            .delete("http://localhost:3000/compositores/" + formData.id)
            .then((res) => {
              console.log("Compositor eliminado com sucesso:", res.data);
              response.write(
                "<script>window.location.href = '/compositores';</script>"
              );
              response.end();
            })
            .catch((error) => {
              console.error("Error ao eliminar compositor:", error);
              response.write("Ocorreu um erro ao eliminar o compositor.");
              response.end();
            });
        });
    } else {
      response.write("Operação não suportada.");
      response.end();
    }
  })
  .listen(1234);
