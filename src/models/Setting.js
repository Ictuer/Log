var { Schema, model } = require('mongoose')

var SettingSchema = Schema({
    tool: String,
    key: String,
    value: Schema.Types.Mixed
}, { timestamps: true })

module.exports = model('setting', SettingSchema)
