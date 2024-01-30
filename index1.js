const express = require("express");
const app = express();
const path = require("path");
const database = require("./database");
const relations = require("./relations");
const jwt = require("jsonwebtoken");
relations();
database.sync();
// const users = require("./models/user1");
// const nodemone = require("nodemon");
// const product = require ('./models/product')
const sqlize = require("sequelize");

const { formidable } = require("formidable");
const fs = require("fs");
const User = require("./models/user1");
// const user = require("./models/user1");
const movi = require("./models/movies");
// const movies = require("./models/movies");

function success() {
  console.log("Hi server is running...");
}
app.set("view engine", "ejs");
app.use(express.urlencoded());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, './assets')))

app.get("/", async function(req, res) {
  // let movies = await movi.findAll()
  // res.render('', {movies : movies});
  res.redirect('/index')
});
app.get("/detail/:id", async function(req, res) {
  let movies = await movi.findByPk(req.params.id);
  res.render("detail", { movies });
});


app.get("/action", async function(req, res) {
  let movies = await movi.findAll({ where: { catagory: 'Action' }});
  res.render("action", { movies : movies });
});

app.get("/category/:type", async function(req, res) {
  let movies = await movi.findAll({
    where: {
      catagory: req.params.type,
    },
  });
  console.log(movies);
  res.render("animation", { movies });
  res.render("action", { movies });
  res.render("music", { movies });
});

app.get("/login", function(req, res) {
  res.render("login", { error: false });
});

app.get("/logout", function(req, res) {
  res.setHeader("Set-Cookie", "movietoken=deleted; ");
  res.redirect("/login");
});
app.get('/logout', function(req, res){
  res.setHeader('Set-Cookie', 'mellaid=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT')
  return res.redirect('/homepage')
});
app.post("/login", async function(req, res) {
  let { username, password } = req.body;
  let user = await User.findOne({
    where: {
      username: username,
    },
  });
  if (user) {
    if (password == user.password) {
      let token = jwt.sign(user.id, "movie-secret");
      res.setHeader("Set-Cookie", "movietoken=" + token);
      return res.redirect("/dashboard");
    }
  }
  res.render("login", { error: true });
  // res.redirect("upload");
});

app.get('/homepage', function(req, res){
  let user = req.loggedInUser
  if(req.loggedIn){
      return res.render('index', {
          loggedIn: true,
          firstName: user ? user.firstName : ''
      })
  } else {
      return res.render('index' , {
          loggedIn: false
      })
  }

})

app.get("/index", async function(req, res) {
  let movies = await movi.findAll();
  res.render("index", { movies: movies, loggedIn: !!req.user });
});
app.get("/search", async function(req, res) {
  const query = req.query.q
  
  let movies = await movi.findAll({
    where: {
      title: {
        [sqlize.Op.like]: '%' + query + '%'
      }
    }
  });
  res.render("search", { query , movies: movies, loggedIn: !!req.user });
});
app.get("/about", function(req, res) {
  res.render("about");
});
app.get("/signup", function(req, res) {
  res.render("signup");
});
app.post("/signup", async function(req, res) {
  //  const {firstName, lastName, email, userName, password} = req.body
  await User.create({
    firstName: req.body.Firstname,
    lastName: req.body.Lastname,
    email: req.body.email,
    userName: req.body.Username,
    password: req.body.password,
  });
  res.redirect("/login");
});

app.use("/images", express.static(path.join(__dirname, "/images")));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// app.get("/animation", function(req, res) {
//   res.render("animation");
// });
app.get("/music", async function(req, res) {
  let movies = await movi.findAll({ where: { catagory: 'Music' }});
  res.render("music", { movies: movies });
});
app.get("/animation" , async function(req ,res){
  let movies = await movi.findAll({ where: { catagory: 'Animation' }})
  res.render("animation" ,{ movies : movies })
})
app.use(async function(req, res, next) {
  if (!req.headers.cookie) return res.redirect("/login");
  let cookie = req.headers["cookie"].split("=").pop();
  console.log(cookie)
  try {
    let id = jwt.verify(cookie, "movie-secret");
    let user = await User.findByPk(id, { include: movi });
    console.log(user)
    if (!user) return res.redirect("/login");
    req.user = user;
  } catch(e){}
  next();
});

app.get("/dashboard", function(req, res) {
  // res.render("dashboard");
  res.redirect('/my-uploads')
});

app.get("/upload", function(req, res) {
  res.render("upload");
});

app.post("/upload", function(req, res) {
  let form = formidable({ uploadDir: "./uploads" });
  console.log("geeee");
  form.parse(req, async function(err, fields, files) {
    console.log(err, fields, files);
    let title = fields.title[0];
    let description = fields.description[0];
    let category = fields.category[0];

    let image = files?.cover[0];
    let video = files?.video[0];

    let imageExt = image.mimetype.split("/").pop();
    let videoExt = video.mimetype.split("/").pop();
    fs.rename(image.filepath, image.filepath + "." + imageExt, function() {});
    fs.rename(video.filepath, video.filepath + "." + videoExt, function() {});

    await movi.create({
      title,
      description,
      image: "/uploads/" + image.newFilename + "." + imageExt,
      video: "/uploads/" + video.newFilename + "." + videoExt,
      userid: req.user.id,
      catagory: category,
    });

    res.redirect("/dashboard");
  });
});

app.get("/my-uploads", async function(req, res) {
  res.render("my-uploads", { movies: req.user.movis });
});

app.listen(5300, function() {
  console.log("Server is running in port 5000...");
});
