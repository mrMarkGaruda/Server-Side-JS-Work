const express = require("express")
const app = express()
port = 3000

// MIDDLEWARE
app.use((req, res, next) => {
    const now = Date.now()
    req.requestTime = now
    next()
   })
   // data sent to the user
   app.get("/", (req, res) => {
    res.send(req.requestTime.toString())
   })

app.get("/", (req, res) => {
    res.send("Hewo")
})

app.listen(port, () => {
    console.log(`Example app listening at http:/localhost:${port}`)
})