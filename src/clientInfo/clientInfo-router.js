const express = require('express')
const clientInfoServicce = require('./clientInfo-service')

const clientInfoRouter = express.Router()
const jsonParser = express.json()

clientInfoRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        clientInfoServicce.getAll(knexInstance)
            .then(info => {
                res.json(info)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { /* all client info */ } = req.body
        const newClient = { /* all client info */ }

        clientInfoServicce.insertInfo(
            req.app.get('db'),
            newClient
        )
            .then(info => {
                res
                    .status(201)
                    .json(info)
            })
            .catch(next)
    })