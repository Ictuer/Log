var { Schema, model } = require('mongoose')

var LogSchema = Schema({
    root: String,
    tool: String,
    ip: String,
    mac: String,
    type: String,
    timestamps: Date,
    data: Schema.Types.Mixed
}, { timestamps: true })

module.exports = model('log', LogSchema)
