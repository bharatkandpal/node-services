const express = require("express")
const app = express()

app.use(express.json())

const mongoose = require("mongoose")

require("./Book")
const Book = mongoose.model("Book")

const mongoAtlasUrl = "mongodb+srv://<user>:<password>@democluster.w6coe.mongodb.net/booksService"

//connect database
mongoose.connect(mongoAtlasUrl)
    .then(() => console.log("connected to mongo cloud"))
    .catch(err => console.log(err))


//mongodb+srv://adminbk:kandpal@democluster.w6coe.mongodb.net/booksService?retryWrites=true&w=majority
app.get('/', (req, res) => {
    res.send("main EndPoint --Books Service")
})


//create books 
app.post('/book', (req, res) => {
    let newBook = {
        title: req.body.title,
        author: req.body.author,
        numberPages: req.body.numberPages,
        publisher: req.body.publisher,
    }

    let book = new Book(newBook)

    book.save()
        .then(() => console.log("new Book Created"))
        .catch((err) => { if (err) res.send(err) })
    res.send("New Book Created")
})


app.get('/books', (req, res) => {
    Book.find()
        .then(books => res.json(books))
        .catch(err => console.log(err))

})

app.get('/book/:id', (req, res) => {
    Book.findOneAndRemove(req.params.id)
        .then(book => {
            if (book)
                res.json(book)
            else
                res.sendStatus(404)
        })
        .catch(err => console.log(err))
})

app.delete('/book/:id', (req, res) => {
    Book.findByIdAndRemove(req.params.id)
        .then(book => res.send("Successfully deleted : " + book.title + ", written by: " + book.author))
        .catch(err => res.sendStatus(404))
})

//start application
app.listen(3000, () => {
    console.log("Started Books Service")
})