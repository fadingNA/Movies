/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Nonthachai Plodthong Student ID: 152487211 Date: 16/Jan/2023
 *  Cyclic Link: https://exuberant-trench-coat-wasp.cyclic.app
 *
 ********************************************************************************/


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 5555;
const cors = require('cors');
require("dotenv").config();
require("dotenv").config({path: "./config/connect.env"});
const MoviesDB = require("./modules/moviesDB");
const {response} = require("express");
const db = new MoviesDB();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API Listening' });
});

app.post("/api/movies", (req, res) => {
    res.status(201).json(db.addNewMovie(req.body))
})

app.get("/api/movies", function (req, res) {
    let queryPromise = null;

    if (req.query.title) {
        queryPromise = db.getAllMovies(
            req.query.page,
            req.query.perPage,
            req.query.title
        );
    } else {
        queryPromise = db.getAllMovies(req.query.page, req.query.perPage);
    }

    queryPromise
        .then((data) => {
            if (data) res.json(data);
            else res.json({ errorMessage: "No Movies" });
        })
        .catch((err) => {
            res.status(500).json({ errorMessage: err });
        });
});

app.get("/api/movies/:id", (req, res) => {
    db.getMovieById(req.params.id).then((data) => {
        res.status(201).json(data);
    })
        .catch((err) => {
            res.status(500).json({
                message: 'Something went wrong, please try again ${err}'
            });
        });
});

app.put("/api/movies/:id", (req, res) => {
    db
        .updateMovieById(req.body, req.params.id)
        .then((data) => {
            res.status(204).json({message: data});
        })
        .catch((err) => {
            res.status(500).json({ message: 'Something went wrong, please try again ${err}' });
        });
});

app.delete("/api/movies/:id", (req, res) => {
    db
        .deleteMovieById(req.params.id)
        .then((data) => {
            res.status(201).json( {message: data });
        })
        .catch((err) => {
            res.status(500).json({
                message: 'Something went wrong, please try again ${err}'
            });
        });
});

app.use((req, res) => {
    res.status(204).send("Resource not found");
});

// Tell the aspp to start listening for requests
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});


