const express = require("express");

let publications = [];

const server = express();

server.use(express.json());


server.post("/posts", (req, res) => {
    const body = req.body;
    if("author" in body && "title" in body && "contents" in body){
        const publi = {
            id: body.id,
            author: body.author,
            title: body.title,
            contents: body.contents
        }
        publications.push(publi)
        res.status(200).json(publi)
    }else{
        res.status(400).json({error: "No se recibieron los parámetros necesarios para crear la publicación"})
    }
  
})


server.get("/posts", (req, res) => {
   const {author, title} = req.query;

   if(!author || !title){
    res.status(400).json({error: "No existe ninguna publicación con dicho título y autor indicado"})
   }else{
    const publi = publications.filter((post) => post.author === author && post.title === title)

    if(publi.length > 0){
        res.status(200).json(publi)
    }else{
        res.status(400).json({error: "No existe ninguna publicación con dicho título y autor indicado"})
    }
   }
});


server.get("/posts/:author", (req, res) => {
    const {author} = req.params;

    const publis = publications.filter((post) => post.author === author);
    if(publis.length > 0){
        res.status(200).json(publis);
    }else{
        res.status(400).json({error: "No existe ninguna publicación del autor indicado"})
    }
})



server.put("/posts/:id", (req, res) =>{
    const {id} = req.params;
    const {title, content} = req.body;
  
    const postIndex = publications.findIndex((post) => post.id == id);
        if(postIndex !== -1){
            publications[postIndex] = {...publications[postIndex], title, content}

            res.status(200).json(publications[postIndex])
        }else{
            res.status(400).json({error: "No se recibió el id correcto necesario para modificar la publicación"})
        }
    
})


server.delete("/posts/:id", (req, res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({error: "No se recibió el id de la publicación a eliminar"})

    const lengthAntes = publications.length;

    const filteredPublications = publications.filter((post) => post.id !== Number(id))
    if(lengthAntes > filteredPublications.length){

        publications = filteredPublications;        
         res.status(200).json({ success: true })
    }else{
        res.status(400).json({error: "No se recibió el id correcto necesario para eliminar la publicación"})
    }
})



//NO MODIFICAR EL CODIGO DE ABAJO. SE USA PARA EXPORTAR EL SERVIDOR Y CORRER LOS TESTS
module.exports = { publications, server };
