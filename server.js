const express = require("express");
const server = express();
const db = require("./db");

// const ideas = [
//   {
//     img: "https://cdn-icons-png.flaticon.com/512/2729/2729007.png",
//     title: "Cursos de Programação",
//     category: "Estudo",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recrum nisi alias ipsum, fugiat sed",
//     url: "https://rocketseat.com.br",
//   },
//   {
//     img: "https://cdn-icons-png.flaticon.com/512/2729/2729005.png",
//     title: "Exercícios",
//     category: "Saúde",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recrum nisi alias ipsum, fugiat sed",
//     url: "https://rocketseat.com.br",
//   },
//   {
//     img: "https://cdn-icons-png.flaticon.com/512/2729/2729027.png",
//     title: "Meditação",
//     category: "Mentalidade",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recrum nisi alias ipsum, fugiat sed",
//     url: "https://rocketseat.com.br",
//   },
//   {
//     img: "https://cdn-icons-png.flaticon.com/512/2729/2729032.png",
//     title: "Karaokê",
//     category: "Diversão em Família",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recrum nisi alias ipsum, fugiat sed",
//     url: "https://rocketseat.com.br",
//   },
//   {
//     img: "https://cdn-icons-png.flaticon.com/512/2729/2729038.png",
//     title: "Pintura",
//     category: "Criatividade",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recrum nisi alias ipsum, fugiat sed",
//     url: "https://rocketseat.com.br",
//   },
//   {
//     img: "https://cdn-icons-png.flaticon.com/512/2729/2729048.png",
//     title: "Recortes",
//     category: "Criatividade",
//     description:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Recrum nisi alias ipsum, fugiat sed",
//     url: "https://rocketseat.com.br",
//   },
// ];

server.use(express.static("public"));

server.use(express.urlencoded({ extended: true }));

const nunjucks = require("nunjucks");
nunjucks.configure("views", {
  express: server,
  noCache: true,
});

server.get("/", function (req, res) {
  db.all(`SELECT * FROM ideas`, function (err, rows) {
    if (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }

    const reversedIdeas = [...rows].reverse();

    let lastIdeas = [];
    for (let idea of reversedIdeas) {
      if (lastIdeas.length < 2) {
        lastIdeas.push(idea);
      }
    }

    return res.render("index.html", { ideas: lastIdeas });
  });
});

server.get("/ideias", function (req, res) {
  db.all(`SELECT * FROM ideas`, function (err, rows) {
    if (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }

    const reversedIdeas = [...rows].reverse();

    return res.render("ideias.html", { ideas: reversedIdeas });
  });
});

server.post("/", function (req, res) {
  const query = `
    INSERT INTO ideas(
      image,
      title, 
      category, 
      description, 
      link
    ) VALUES (?, ?, ?, ?, ?);
  `;

  const values = [
    req.body.image,
    req.body.title,
    req.body.category,
    req.body.description,
    req.body.link,
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }

    return res.redirect("/ideias")
  });
});

server.listen(3000);
