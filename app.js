var express = require('express')
var dotenv = require('dotenv')
var mongoose = require('mongoose')
var JWT = require('./jwt')

var app = express()
var bodyParser = require('body-parser')

var Log = require('./models/Log')
var Setting = require('./models/Setting')

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({ now: Date.now() })
})

app.get('/logs', (req, res) => {
    Log.find().then(data => res.json(data))
})

app.post('/log', (req, res) => {
    var data = JWT.decode(req.body.data)
    if(data) {
        Log.create(data)
            .then(() => res.json({success: true}))
            .catch(() => res.json({ success: false }))
    } else {
        Log.create({
            type: 'attack',
            data: req.body
        })
            .then(() => res.json({success: false}))
            .catch(() => res.json({success: false}))
    }
})

app.post('/', (req, res) => {
    res.json(req.body)
})

app.get('/setting', (req, res) => {
    var { tool, key } = req.query
    if(!key) {
        res.status(404).send('Not found')
    } else {
        Setting.findOne({ tool, key }).then(data => {
            if(data) {
                res.send(JWT.encode({ data: data.value }))
            } else {
                res.status(404).send('Not found')
            }
        })
    }
})



dotenv.config()
var PORT = process.env.PORT || 2302

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    })


