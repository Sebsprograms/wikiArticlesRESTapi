const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

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
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
});

const Article = mongoose.model("article", articleSchema);


// Routes
app.get('/articles', async (req, res) => {
    const allArticles = await Article.find();
    if(allArticles) {
        res.send(allArticles);
    } else {
        res.send({"error": 404});
    }
});

app.post('/articles', async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    const newEntry = new Article({
        title: title,
        content: content,
    });

    newEntry.save().then(()=>{
        res.send("Success");
    }).catch((err)=>{
        res.send("Error");
        console.log(err);
    })

})


// Listener
const PORT = 3000;
app.listen(PORT, function() {
    console.log(`App listening on port: ${PORT}`);
})