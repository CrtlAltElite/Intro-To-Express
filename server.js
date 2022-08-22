// CommonJS import
const express = require('express')
const dotenv = require('dotenv')
// don't use ES6 modules
// import express from 'express'


const items = [
    {
        id: 1,
        name:"red nikes",
        price:89.99,
        desc : "cool shoes",
        category: "shoes"
    },
    {
        id: 2,
        name:"blue adidas",
        price:79.99,
        desc : "cool blue shoes",
        category: "shoes"
    },
    {
        id: 3,
        name:"Marvel T-Shirt",
        price: 11.99,
        desc : "Avengers untie!",
        category: "shirts"
    },
    {
        id: 4,
        name:"Death to Pikas Tee",
        price:1.99,
        desc : "CAEs class Tee",
        category: "shirts"
    },
    {
        id: 5,
        name:"Coding Temple Trucker Hat",
        price:11.99,
        desc : "cool hat",
        category: "hats"
    },
    {
        id: 6,
        name:"Make American Great Hat",
        price:20.99,
        desc : "Amerrica are great!",
        category: "hats"
    },
]


const people = [
    {
        name:"jody",
        password:"iamjody",
        email:"jody@gmail.com",
        cart : [1,2,3,3]
    },
    {
        name:"alex",
        password:"iamalex",
        email:"alex@gmail.com",
        cart : [5,4]
    },
    {
        name:"katina",
        password:"iamkatina",
        email:"katina@gmail.com",
        cart : [1,4,6]
    },
]

const app = express()
dotenv.config()

app.use(express.json())

//custom token login required middleware
const loginRequired = function(req, res, next){
    console.log('My Middleware is running')
    if (!req.headers.authorization){
        return res.sendStatus(401)
    } 
    token = req.headers.authorization.slice(7)
    user = people.filter(p=>p.token ==token)
    if (user.length <= 0){
        return res.sendStatus(401)
    }
    next()
}

app.use(['/people', '/item'],loginRequired)


app.get("/",(req, res)=>{
    res.send('Welcome to Express')
})

app.get("/item", (req, res)=>{
    res.send(items)
})

app.get("/item/:id", (req, res)=>{
    res.send(items.filter(i=>i.id == req.params.id))
})

// all items in category
app.get("/item/category/:category",(req,res)=>{
    res.send(items.filter(i=>i.category == req.params.category))
})

// get all the items in the cart of the name that is passed in
app.get("/cart/:name",(req,res)=>{
    const person = people.filter(p=>p.name== req.params.name)[0]
    const cart = person.cart.map(id=>items.filter(i=>i.id == id)[0])
    res.send(cart)

})

app.get("/people", (req, res)=>{
    res.send(people)
})

app.get("/people/:name",(req,res)=>{
    res.send(people.filter(p=>p.name.toLowerCase()==req.params.name.toLowerCase()))
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server running at http://localhost:${process.env.PORT} ...`)
})

app.post("/login",(req, res)=>{
    const email = req.body.email
    const password = req.body.password
    user = people.filter(p=>p.email==email)[0]
    if (!user){
        res.sendStatus(401)
    }else{
        const token = `${Math.random().toString(36).slice(2)}`
        user.token = token
        res.send(user.token)
    }
})
