require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const NODE_ENV = require('./config')
const clientContactRouter = require('./clientContact/clientContact-router')
const emergencyContactRouter = require('./emergencyContact/emergencyContact-router')
const clientInfoRouter = require('./clientInfo/clientInfo-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/client/contact', clientContactRouter)
app.use('/api/client/emergency', emergencyContactRouter)
app.use('/api/client/info', clientInfoRouter)
app.use('/api/client/meals', mealsRouter)

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = {error: {message: 'Unauthorized request'}}
    } else{
        response = {error}
    }
    res.status(500).send(response)
})

module.exports = app