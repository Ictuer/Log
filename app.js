var express = require('express')

var app = express()

app.get('/', (req, res) => {
    res.json({ now: Date.now() })
})


app.listen(2302, () => console.log('.'))

