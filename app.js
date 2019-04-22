const express = require('express')
const bodyParser = require('body-parser')
const User = require('./entity/User')
const jwt = require('jsonwebtoken')
const jwtVerifier = require('express-jwt')

const app = express()
const user_const = {email: 'rkritchat@gmail.com', password: 1234}
const secret = 'rkritchat'

let createToken = ()=>{
    let expirationDate = Math.floor(Date.now() / 1000) + 30
    let token = jwt.sign({userID: user_const.email, exp: expirationDate}, secret)
    return token
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

app.get('/home', jwtVerifier({secret: secret}), (req,res) =>{
    res.send('Congratulations, you made it home')
})

app.post('/login', (req,res)=>{
    let user = new User(req.body)
    console.log(user)
    if(user.email == user_const.email && user.pwd == user_const.password){
        res.send(createToken())
    }
    else{
        res.sendStatus(400)
    }
})

app.use((err, req, res, next)=>{
    console.log(err.name)
    if(err){
        console.log(err)
    }
    if(err.name === 'UnauthorizedError'){
        res.status(500).send(err.message)
    }
})

app.listen(3001, ()=>{
    console.log('start..')
})
