var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
    axios
    .get("http://localhost:3000/compositores?_sort=nome")
    .then((resp) => {
      var data = resp.data;
      res.render('compositores', { title: 'Compositores', compositores: data });
      res.end();
    })
    .catch((err) => {
      console.log("Erro: " + err);
      res.write("<p>" + err + "</p>");
    });
});

router.get('/adicionar', function(req, res, next) {
    res.render('adicionar_compositor', { title: 'Adicionar Compositor' });
});

router.post('/adicionar', function(req, res, next) {
    const newComposer = {
        _id: "C" + Math.floor(Math.random() * 2000),
        nome: req.body.nome.replaceAll("+", " "),
        periodo: req.body.periodo.replaceAll("+", " "),
        dataNasc: req.body.dataNasc,
        dataObito: req.body.dataObito,
        bio: req.body.bio.replaceAll("+", " ")
    };

    axios
    .post("http://localhost:3000/compositores", newComposer)
    .then((resp) => {
        console.log("Compositor adicionado com sucesso:", resp.data);
        res.write(
        "<script>window.location.href = '/compositores';</script>"
        );
        res.end();
    })
    .catch((error) => {
        console.error("Error ao adicionar compositor:", error);
        res.write("Ocorreu um erro ao adicionar o compositor.");
        res.end();
    });
});

router.get('/eliminar/:id', function(req, res, next) {
    axios
    .delete("http://localhost:3000/compositores/" + req.params.id)
    .then((resp) => {
        console.log("Compositor eliminado com sucesso:", resp.data);
        res.write(
        "<script>window.location.href = '/compositores/';</script>"
        );
        res.end();
    })
    .catch((error) => {
        console.error("Error ao eliminar compositor:", error);
        res.write("Ocorreu um erro ao eliminar o compositor.");
        res.end();
    });
});

router.get('/:id', function(req, res, next) {
    axios
    .get(
        "http://localhost:3000/compositores?id=" + req.params.id
    )
    .then((resp) => {
        var data = resp.data;
        res.render('compositor', { title: data[0].nome, compositor: data[0] });
        res.end();
    })
    .catch((err) => {
        console.log("Erro: " + err);
        res.write("<p>" + err + "</p>");
    });
});

router.get('/:id/editar', function(req, res, next) {
    axios
    .get(
        "http://localhost:3000/compositores?id=" + req.params.id
    )
    .then((resp) => {
        var data = resp.data;
        res.render('editar_compositor', { title: "Editar Compositor", compositor: data[0]});
        res.end();
    })
    .catch((err) => {
        console.log("Erro: " + err);
        res.write("<p>" + err + "</p>");
    });
})

router.post('/:id/editar', function(req, res, next) {
    const newComposer = {
        _id: req.params.id,
        nome: req.body.nome.replaceAll("+", " "),
        periodo: req.body.periodo.replaceAll("+", " "),
        dataNasc: req.body.dataNasc,
        dataObito: req.body.dataObito,
        bio: req.body.bio.replaceAll("+", " "),
    };

    axios
        .patch("http://localhost:3000/compositores/" + req.params.id, newComposer)
        .then((resp) => {
        console.log("Compositor editado com sucesso:", resp.data);
        res.write(
            `<script>window.location.href = '/compositores/${req.params.id}';</script>`
        );
        res.end();
        })
        .catch((error) => {
        console.error("Error ao editar compositor:", error);
        res.write("Ocorreu um erro ao editar o compositor.");
        res.end();
        });
});

module.exports = router;
