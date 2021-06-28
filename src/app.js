var express = require('express')
var dotenv = require('dotenv')
var mongoose = require('mongoose')
var JWT = require('./jwt')
var { formatDistance } = require('date-fns')

var app = express()
var bodyParser = require('body-parser')

var Log = require('./models/Log')
var Setting = require('./models/Setting')

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({ success: true })
})

//{type: 'bet', tool: 'baccarat', mac: '14:7d:da:c6:19:9a'}
app.get('/logs', (req, res) => {
    Log.find().then(data => res.send(data.map(i => {
        switch(i.type) {
            case 'bet':
                return `Bet ${i.data.total_bet} for ${i.data.for} => ${i.data.result} |${i.data.total} |${formatDistance(i.timestamps, Date.now())}`
            case 'login':
                return `Login | Total: ${i.data.total } | ${formatDistance(i.timestamps, Date.now())}`
            case 'limit':
                return `${i.data.type.toUpperCase()} ${i.data.type == 'profit_limit' ? i.data.profit_limit : i.data.loss_limit } | ${formatDistance(i.timestamps, Date.now())}`
        }
        return i.type + " " + formatDistance(i.timestamps, Date.now())
    }).join('\n')))
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
        res.send('KEY NOT FOUND')
    } else {
        Setting.findOne({ tool, key }).then(data => {
            if(data) {
                res.send(JWT.encode({ data: data.value }))
            } else {
                res.send('KEY NOT FOUND')
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


