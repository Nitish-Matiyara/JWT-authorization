require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const path = require("path")
const cors = require("cors")
app.use(cors())

app.use(express.json());

let refreshTokens = [];

app.post("/token", (req, res) => {
  console.log("passwrd")
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    console.log("user")
    if (err) return res.status(403).send("Refresh token not valid");
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/login", (req, res) => {
  //Authenticate User (check his info in database, bcrypt)

  const username = req.body.username;
  const user = { name: username };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
  
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "25s" });
}

app.get('/login', (req, res)=>{
  res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(5000, () => {
  console.log("Server started at port 5000");
});
