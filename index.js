const express = require("express");
const cors = require('cors')
const app = express();

app.options('*', cors()) // include before other routes
app.use(cors())

app.use(express.json());

app.all('*',function (_,res,next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get("/users", (_, res) => {
    res.send(users);
})

const users = [ {
    username: "test",
    password: "test",
    checkedIn: false
} ];

app.post("/postuser", (req, res) => {
    const user = req.body.user;

    users.push({ username: user.username, password: user.password });

    console.log(users)

    res.json({ loggedIn: true, status: "fuck" })
})

app.post("/checkin", (req, res) => {
    const user = req.body.user;
    for(let i = 0; i < users.length; i++) {
        if(user.username == users[i].username) {
            users[i].checkedIn = true;
            res.json({ loggedIn: users[i].checkedIn })
            return;
        }
    }
    res.json({ error: "user not found" })
})

app.post("/checkout", (req, res) => {
    const user = req.body.user;
    for(let i = 0; i < users.length; i++) {
        if(user.username == users[i].username) {
            users[i].checkedIn = false;
            res.json({ loggedIn: users[i].checkedIn })
            return;
        }
    }
    res.json({ error: "user not found" })
})

app.listen(5000, () => {
    console.log("server started on port 4000");
})