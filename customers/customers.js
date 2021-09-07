const { urlencoded } = require("body-parser")
const express = require("express")
const app = express()
const mongoose = require("mongoose")

app.use(express.json())


const mongoAtlasUrl = "mongodb+srv://<user>:<password>@customerservice.uwpjk.mongodb.net/customersService"

mongoose.connect(mongoAtlasUrl)
    .then(() => console.log("connected to mongo cloud"))
    .catch(err => console.log(err))

require("./Customer")

const Customer = mongoose.model("Customer")

app.get('/', (req, res) => {
    res.send("main endPoint --Customers Service")
})


app.post('/customer', (req, res) => {
    let newCustomer = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
    }

    let customer = new Customer(newCustomer)
    customer.save()
        .then(() => res.send("new Customer added"))
        .catch(err => console.log(err))
})


app.get('/customers', (req, res) => {
    Customer.find()
        .then(customers => res.json(customers))
        .catch(err => { throw err })
})

app.get('/customer/:id', (req, res) => {
    Customer.findById(req.params.id)
        .then(customer => {
            if (customer)
                res.send(customer)
            else
                res.send("customer not found")

        })
        .catch(err => { throw err })
})

app.delete('/customer/:id', (req, res) => {
    Customer.findByIdAndRemove(req.params.id)
        .then(customer => {
            if (customer)
                res.send("deleted: " + customer.name)
            else
                res.send("customer not found")
        })
        .catch(err => { throw err })
})

app.listen(4444, () => {
    console.log("started Customers Service")
})