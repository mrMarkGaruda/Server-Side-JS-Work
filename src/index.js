const express = require("express")
const app = express()
port = 3000

app.get("/", (req, res) => {
    res.send("Hewo")
})

app.listen(port, () => {
    console.log(`Example app listening at http:/localhost:${port}`)
})