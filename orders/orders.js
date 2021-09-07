const express = require("express")
const mongoose = require("mongoose")
const axios = require("axios")
const app = express()
app.use(express.json())

const MongoAtlasUrl = "mongodb+srv://<user>:<password>@ordersservice.rondv.mongodb.net/ordersService"

mongoose.connect(MongoAtlasUrl)
    .then(() => console.log("connected to mongo cloud"))
    .catch((err) => console.log(err))

require("./Order")

const Order = mongoose.model("Order")


//create a new order
app.post('/order', (req, res) => {
    let newOrder = {
        BookID: req.body.BookID,
        CustomerID: req.body.CustomerID,
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate,
    }

    let order = new Order(newOrder)
    order.save()
        .then(() => res.send("order placed successfully"))
        .catch((err) => { throw err })
})

//get order list
app.get('/orders', (req, res) => {
    Order.find()
        .then(orders => res.json(orders))
        .catch(err => { throw err })
})

app.get('/order/:id', (req, res) => {
    Order.findById(req.params.id)
        .then(order => {
            if (order) {
                //get customer name from customer service
                axios.get('http://localhost:4444/customer/' + order.CustomerID)
                    .then(response => {
                        //let orderObject = { customerName: response.name, bookTitle: "" }
                        console.log(response.data.name)
                        //get book title from books service
                        axios.get('http://localhost:3000/book/' + order.BookID)
                            .then(bookResponse => {
                                console.log(bookResponse.data.title)
                            })
                            .catch(err=>{throw err})
                    })
                    .catch(err=>{throw err})
            }
            else
                res.send("invalid order ID")
        })
        .catch(err => { throw err })
})

app.listen(5555, () => {
    console.log("Orders Services started")
})