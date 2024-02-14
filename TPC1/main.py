import os
import xml.etree.ElementTree as ET
from typing import Dict


def get_desc_text(paragraphs: list[ET.Element], do_p: bool = True):
    desc = ""
    for p in paragraphs:
        if p.itertext() is not None:
            if do_p:
                desc += "<p class='mb-2'>"
            desc += ''.join(p.itertext())
            if do_p:
                desc += "</p>"
    return desc


def gen_street_card(href: str, img_src: str, street_name: str, nr: str):
    return f"""
    <a 
        class="flex flex-col w-full bg-white shadow-sm rounded-xl border p-4 font-[600] text-lg space-y-4 hover:shadow-md hover:-translate-y-1 transition-all"
        href="{href}"
    >
        <img src="{img_src}" class="w-full h-36 rounded-lg object-cover"></img>
        <div class="flex place-content-between items-center space-x-4">                
            <p class="text-wrap">
                {street_name}
            </p>
            <i class="bi bi-signpost-fill text-blue-500 text-xl w-fit min-w-fit">{nr}</i>
        </div>            
    </a>
    """


def gen_home(info_dir: str):
    top = """
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <title>Mapa Ruas Braga</title>
    </head>
    <body class="flex flex-col h-screen justify-between bg-neutral-100" style="font-family: Inter, sans-serif;">
        <header class="w-full bg-white border-b shadow-sm text-blue-600 font-medium text-3xl p-4 flex space-x-3 place-content-center">
            <i class="bi bi-map-fill"></i>
            <h1>Mapa Ruas de Braga</h1>
        </header>

        <main class="px-64 py-8 grid grid-cols-3 gap-3 mb-auto overflow-y-scroll overflow-x-auto">
    """
    bottom = """
        </main>

            <footer class="w-full bg-white border-t shadow-sm text-neutral-800 font-medium text-center p-4">
                <p>&copy; 2024 Diogo Matos. All rights reserved.</p>
            </footer>
        </body>
    </html>
    """

    res = top

    for _, _, filenames in os.walk(info_dir):
        for filename in filenames:
            
            path = os.path.join(info_dir, filename)
            root = ET.parse(path).getroot()

            nr = root.find("meta").find("número").text
            street_name = root.find("meta").find("nome").text
            img_src = "MapaRuas-materialBase/imagem/" + root.find("corpo").find("figura").find("imagem").attrib["path"].split("/")[2]
            file_name = street_name.replace(" ", "")
            href = f"MRB-{nr}-{file_name}.html"

            res += gen_street_card(href, img_src, street_name, nr) + "\n"

    res += bottom

    with open("index.html", "w") as f:
        f.write(res)


def gen_street_page(street_name: str, nr: str, description: str, images: list[str], buildings: list[Dict], url: str):
    if description == "":
        description = "Não disponível"

    for b in buildings:
        if b["enfiteuta"] == "" or b["enfiteuta"] is None:
            b["enfiteuta"] = "Não disponível"
        if b["foro"] == "" or b["foro"] is None:
            b["foro"] = "Não disponível"
        if b["desc"] == "" or b["desc"] is None:
            b["desc"] = "Não disponível"
    
    top = f"""
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <title>{street_name}</title>
    </head>
    <body class="flex flex-col h-screen justify-between bg-neutral-100" style="font-family: Inter, sans-serif;">
        <header class="w-full bg-white border-b shadow-sm text-blue-600 font-medium text-3xl p-4 flex space-x-3 place-content-center">
            <i class="bi bi-map-fill"></i>
            <h1>Mapa Ruas de Braga</h1>
        </header>

        <main class="px-64 py-8 mb-auto overflow-y-scroll overflow-x-auto space-y-8">
            <a
                class="flex bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer transition-all text-5xl rounded-lg w-14 h-14 items-center"
                href="index.html"
                title="Voltar"
            >
                <i class="bi bi-arrow-left-short m-auto w-fit"></i>
            </a>

            <div class="flex text-5xl font-bold space-x-8">
                <i class="bi bi-signpost-fill text-blue-500">{nr}</i>
                <p>{street_name}</p>
            </div>
            <div class="text-justify">
                {description}
            </div>
    """
    bottom = """
        </main>

            <footer class="w-full bg-white border-t shadow-sm text-neutral-800 font-medium text-center p-4">
                <p>&copy; 2024 Diogo Matos. All rights reserved.</p>
            </footer>
        </body>
    </html>
    """

    res = top

    gal = """
            <div class="flex text-4xl font-bold space-x-6">
                <i class="bi bi-image-fill text-blue-500"></i>
                <p>Galeria</p>
            </div>
            <div>
    """

    for img in images:
        gal += f"""
                <img src="{img}" class="w-full rounded-lg"/>
        """
    
    gal += "\t\t</div>"

    res += gal

    bld = """
            <div class="flex text-4xl font-bold space-x-6">
                <i class="bi bi-houses-fill text-blue-500"></i>
                <p>Edifícios</p>
            </div>
            <div>
                <ol class="space-y-6 text-justify">
    """

    for b in buildings:
        bld += f"""
                    <li class="space-y-2 pb-4 border-b border-neutral-300">
                        <p class="flex items-center space-x-2"><i class="bi bi-person-fill text-xl text-blue-500"></i><span>{b["enfiteuta"]}</span></p>
                        <p class="flex items-center space-x-2"><i class="bi bi-coin text-xl text-blue-500"></i><span>{b["foro"]}</span></p>
                        <p class="flex items-center space-x-2"><i class="bi bi-info-circle-fill text-xl text-blue-500"></i><span>{b["desc"]}</span></p>
                    </li>
        """

    bld += "\t\t</ol>\n\t\t</div>"

    res += bld + bottom

    with open(url, "w") as f:
        f.write(res)


def gen_street_pages(info_dir: str):
    for _, _, filenames in os.walk(info_dir):
        for filename in filenames:
            
            path = os.path.join(info_dir, filename)
            root = ET.parse(path).getroot()

            nr = root.find("meta").find("número").text
            street_name = root.find("meta").find("nome").text

            description = get_desc_text(root.find("corpo").findall("para"))

            images = []
            fig_child = root.find("corpo").findall("figura")
            for f in fig_child:
                images.append("MapaRuas-materialBase/imagem/" + f.find("imagem").attrib["path"].split("/")[2])

            buildings = []
            bld_child = root.find("corpo").find("lista-casas").findall("casa") if root.find("corpo").find("lista-casas") is not None else []
            for b in bld_child:
                buildings.append({
                    "enfiteuta": b.find("enfiteuta").text if b.find("enfiteuta") is not None else "Não disponível",
                    "foro": b.find("foro").text if b.find("foro") is not None else "Não disponível",
                    "desc": get_desc_text(b.find("desc").findall("para"), False) if b.find("desc") is not None else "Não disponível"
                })

            file_name = street_name.replace(" ", "")
            url = f"MRB-{nr}-{file_name}.html"

            gen_street_page(street_name, nr, description, images, buildings, url)
    

def main():
    gen_home("MapaRuas-materialBase/texto")
    gen_street_pages("MapaRuas-materialBase/texto")

main()