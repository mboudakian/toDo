const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/toDoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const itemsSchema = {
  name: String
};

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Bienvenido a tu lista de tareas!"
});

const item2 = new Item({
  name: "Apreta el boton + para agregar una nueva tarea!"
});

const item3 = new Item({
  name: "<-- Tilda para borrar una tarea!"
});

const defaultItems = [item1, item2, item3];

//funciones para el index

app.get("/", function(req, res) {
  Item.find({}, function(err, itemsEncontrados) {
    //traera los items encontrados
    if (itemsEncontrados.length === 0) {
      //si no hay items default encontrados los crea con el insertMany
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Insertados");
        }
      });
      res.redirect("/"); //redirecciona para poder visualizarlos
    } else {
      res.render("index", {
        //en caso que haya ya items los renderea
        listTitle: "Hoy",
        newListItems: itemsEncontrados
      });
    }
  });
});

app.get("/:customName", function(req, res) {
  const customName =
    req.params.customName.charAt(0).toUpperCase() +
    req.params.customName.slice(1); //para no usar Lodash pongo en mayuscula la primera letra y no duplico listas por no poner mayuscula

  List.findOne({ name: customName }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        //crear una nueva lista
        const list = new List({
          name: customName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customName);
      } else {
        //mostrar lista existente
        res.render("index", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    } else {
      console.log(err);
    }
  });
});

app.post("/", function(req, res) {
  const itemName = req.body.toDo;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Hoy") {
    //chequeo si la lista es principal o custom
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res) {
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Hoy") {
    //si es la lista principal va a buscar por id y borrar
    Item.findByIdAndRemove(checkedItem, function(err) {
      if (!err) {
        console.log("Se borro!!");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItem } } },
      function(err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.listen(process.env.PORT || 3000);
