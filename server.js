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
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.json({message: "API Listening"});
})

app.post('/api/movies', (require, response) => {
    db.addNewMovie(require.body).then((data) => {
        response.status(201).json(data);
    }).catch(() => {
        response.status(500).json({message: "Fail to add your movie"});
    })
})

app.get("/api/movies", (require, response) => {
    let queryN = {};
    if (require.query.title) {
        queryN = db.getAllMovies(
            //page=1&perPage=5&title=The Avengers
            require.query.page,
            require.query.perPage,
            require.query.title
        )
    } else {
        queryN = db.getAllMovies(require.query.title);
    }

    queryN.then((data) => {
        if (data) {
            response.json(data);
        } else {
            response.json({message: "No movie in the database"});
        }
    }).catch(() => {
        response.status(500).json({message: "error"});
    });
});

app.get("/api/movies/:id", (require, response) => {
    db.getMovieById(require.params.id).then((data) => {
        if (data) {
            response.json(data);
        } else {
            response.json({message: "No movie in the database"});
        }
    }).catch(() => {
        response.status(500).json({message: "Cannot proceed your request."});
    })
})

app.put("api/movies/:id", (require, response) => {
    db.updateMovieById(require.body, require.params.id).then(() => {
        response.json({message: "Success!"});
    }).catch(() => {
        response.status(500).json({message: "Fail sorry."});
    })
})

app.delete("api/movies/:id", (require, response) => {
    db.deleteMovieById(require.params.id).then(() => {
        response.status(201).json({message: "Delete complete"});
    }).catch(() => {
        response.status(500).json({message: "Failed to delete"});
    })
})
// Resource not found (this should be at the end)
app.use((req, res) => {
    res.status(404).send('Resource not found');
});

// Tell the aspp to start listening for requests
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});


