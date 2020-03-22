//IMPORTING MODULES
const express = require('express');
const app = express();
const dotenv = require("dotenv");
// const mongoose = require('mongoose');
const fetch = require("node-fetch");
// const jwt = require("jsonwebtoken");

//CONFIG
dotenv.config();
//BYta mot body parser?
app.use(express.urlencoded({ extended: false }));
// Set EJS as templating engine
app.set('view engine', 'ejs');
// Set css middleware
app.use("/", express.static("assets"));

//VARIABLES
//Token
let globalToken = "";
//Server name
const api_adress = "http://localhost:3000";
//Port number
const port = 3001;



//VOICE!!!!!!!!!!!!!!!!!!!!!?
// cont btn = document.query






//Index GET
app.get("/", (req, res) => {
    res.render("index.ejs");
});

//register GET
app.get("/register", (req, res) => {
    res.render("register.ejs");
});
//register POST
app.post("/register", async (req, res) => {
    try {
        await fetch(`${api_adress}/api/user/register`, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            }).then(function (response) {
                return response.json();
            })
            .then(function (result) {
                res.redirect('./login');
            })
    } catch(err) {
          console.log(err);
          res.status(400).send(err);
    }
});


//Login GET
app.get("/login", (req, res) => {
    res.render("login.ejs");
});
//login POST
app.post("/login", async (req, res) => {
    try {
        await fetch(`${api_adress}/api/user/login`, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
              email: req.body.email,
              password: req.body.password
            })
            }).then(function (response) {
                return response.json();
            })
            .then(function (result) {
                globalToken = result.msg;
                res.redirect('./token');
            })
    } catch(err) {
          console.log(err);
          res.status(400).send(err);
    }
});

//logout GET
app.get("/logout", (req, res) => {
    globalToken = "";
    res.redirect('./login')
});




//TEST ROUTE(testing moddleware)
app.get("/token", async (req, res) => {
    const token = globalToken;

    try {
        await fetch(`${api_adress}/token-server`, {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
              token: token
            })
            }).then(function (response) {
                return response.json();
            })
            .then(function (result) {
                if (result.msg == "Access denied") {
                    res.render("error.ejs", {msg: "Access denied"});
                } else if (result.msg == "Invalid token") {
                    res.render("error.ejs", {msg: "Wrong email or password!"});
                } else {
                    //Sätt användar idt till en global variabel?
                    res.render("token.ejs");
                }
            })
    } catch(err) {
          res.render("error.ejs", {msg: "Ops! Something went wrong. Try again."});
    }

});









//middleware
app.use(express.json());


app.listen(port, () => console.log(`the server is running on port ${port}`));
