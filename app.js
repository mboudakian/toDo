const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const date = require("./date");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

let items = [];
let workItems = [];

//funciones para el index

app.get("/", function(req, res) {
  let day = date.getDate(); //exportado del modulo date
  res.render("index", {
    kindOfDay: day,
    newListItems: items
  });
});

app.post("/", function(req, res) {
  item = req.body.toDo;
  items.push(item);
  res.redirect("/");
});

//funciones para /work

app.get("/work", function(req, res) {
  res.render("work", {
    newListItems: workItems
  });
});

app.post("/work", function(req, res) {
  workItem = req.body.work;
  workItems.push(workItem);
  res.redirect("/work");
});

app.listen(3000);
