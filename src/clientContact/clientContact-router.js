const express = require('express')
const xss = require('xss')
const path = require('path')
const clientContactService = require('./clientContact-service')

const clientContactRouter = express.Router()
const jsonParser = express.json()

const serializeContact = client => ({
    id: client.id,
    name: xss(client.name),
    phone: client.phone,
    email: client.email,
    deliveryAddress: xss(client.deliveyAddress),
    city: xss(client.city),
    zipcode: client.zipcode,
    dob: client.dob,
    deliveryinstructions: xss(client.deliveryInstructions),
    bestContact: client.bestContact,
    paymentMethod: client.paymentMethod
})

clientContactRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        clientContactService.getAll(knexInstance)
            .then(contact => {
                res.json(serializeContact(contact))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        let { 
            name,
            phone, 
            email, 
            deliveryAddress, 
            city, 
            zipcode, 
            dob, 
            deliveryInstructions, 
            bestContact, 
            paymentMethod 
        } = req.body;
        let newClient = {
            name,
            phone, 
            email, 
            deliveryAddress, 
            city, 
            zipcode, 
            dob, 
            deliveryInstructions, 
            bestContact, 
            paymentMethod
        };

        for (const [key, value] of Object.entries(newClient)) {
            if (value === null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                })
            }
        }

        clientContactService.insertClient(
            req.app.get('db'),
            newClient
        )
        .then(client => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${client.id}`))
                .json(serializeContact(client))
        })
        .catch(next)
    })

clientContactRouter
    .route('/:client_id')
    .all((req, res, next) => {
        clientContactService.getById(
            req.app.get('db'),
            req.params.client_id
        )
            .then(client => {
                if (!client) {
                    return res.status(404).json({
                        error: { message: `Client does'nt exist` }
                    })
                }
                res.client = client
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeContact(res.client))
    })
    .delete((req, res, next) => {
        clientContactService.deleteClient(
            req.app.get('db'),
            req.params.client_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        let { 
            name,
            phone, 
            email, 
            deliveryAddress, 
            city, 
            zipcode, 
            dob, 
            deliveryInstructions, 
            bestContact, 
            paymentMethod 
        } = req.body;
        let updateClient = {
            name,
            phone, 
            email, 
            deliveryAddress, 
            city, 
            zipcode, 
            dob, 
            deliveryInstructions, 
            bestContact, 
            paymentMethod
        }; 

        clientContactService.updateClient(
            req.app.get('db'),
            req.params.client_id,
            updateClient
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

    module.exports = clientContactRouter