require("dotenv").config()
const express = require("express")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const app = express()
app.use(cors())


app.use(express.json())

const posts = [ {
   username: "Nitish",
   title: "Post-1"
},
{
    username: "Vishal",
    title: "Post-2"
 },
 {
    username: "Rahul",
    title: "Post-3"
 }
]

app.get('/posts', authenticateToken, (req,res)=>{
 res.json(posts.filter(post => post.username === req.user.name))
})





function authenticateToken(req, res, next){
   const authHeader = req.headers["authorization"]
   const token = authHeader && authHeader.split(" ")[1]
   console.log(req.headers)
if(token == null) return res.status(401).send('Invalid token')

jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
   if(err) return res.status(403).send('No access, token no longer valid')
   req.user = user
   next()
})
}
app.listen(6000, ()=>{
    console.log("Server started at port 6000")
})

