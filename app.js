const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// Database
const uri = process.env.MONGODB_URI;
const database = "wikiDB";
mongoose.connect(`${uri}/${database}`);

const articleSchema = mongoose.Schema({
    title: String,
    content: String,
});

const Article = mongoose.model("article", articleSchema);


// Routes
app.get('/', async (req, res) => {
    const allArticles = await Article.find();
    console.log(allArticles);
});


// Listener
const PORT = 3000;
app.listen(PORT, function() {
    console.log(`App listening on port: ${PORT}`);
})