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


// All Articles
app.route('/articles')
    .get(async (req, res) => {
        Article.find().then((allArticles) => {
            res.send(allArticles);
        }).catch((err)=>{
            res.send("Error");
            console.log(err);
        })
    })
    .post( async (req, res) => {
        const title = req.body.title;
        const content = req.body.content;
    
        const newEntry = new Article({
            title: title,
            content: content,
        });
    
        newEntry.save().then(()=>{
            res.send("Successfully posted new Article");
        }).catch((err)=>{
            res.send("Error");
            console.log(err);
        })
    })
    .delete(async (req, res) => {
        Article.deleteMany().then(()=> {
            res.send("Successfully Deleted all Articles");
        }).catch((err)=>{
            res.send("Error");
            console.log(err);
        })
    });

// Specific Article
app.route('/articles/:articleTitle')
    .get(async (req, res) => {
        const articleTitle = req.params.articleTitle;
        Article.findOne({"title": articleTitle }).then((articleResponse)=> {
            if(articleResponse) {
                res.send(articleResponse);
            } else {
                res.send("Article not found.");
            }
        }).catch((error)=> {
            res.send("Error fetching article");
            console.log(error);
        });
    })
    .put(async (req, res) => {
        const articleTitle = req.params.articleTitle;
        const title = req.body.title;
        const content = req.body.content;
        Article.replaceOne({title: articleTitle}, {title: title, content: content}).then((response) => {
            if(response) {
                console.log(response);
                res.send("Successfully updated article")
            } else {
                res.send("Failed to update article");
            }
        }).catch((error) => {
            res.send("Error updating Article")
            console.log(error);
        })
    })
    .patch(async (req, res) => {
        const articleTitle = req.params.articleTitle;
        Article.updateOne({title: articleTitle}, req.body).then((response) => {
            if(response) {
                console.log(response);
                res.send("Successfully patched article");
            } else {
                res.send("Failed to patch article");
            }
        }).catch((error) => {
            res.send("Error Patching article");
            console.log(error);
        })
    })
    .delete(async (req, res) => {
        const articleTitle = req.params.articleTitle;
        Article.deleteOne({title: articleTitle}).then((response) => {
            if(response) {
                res.send("Successfully deleted this article");
            } else {
                res.send("Failed to delete this article")
            }
        }).catch((error)=> {
            res.send("Error deleting this article");
            console.log(error);
        });
    });


// Listener
const PORT = 3000;
app.listen(PORT, function() {
    console.log(`App listening on port: ${PORT}`);
})