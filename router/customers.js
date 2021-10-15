const {generatToken, accessToken} = require("../Auth/jwt")
const knex = require('../database/db')
const express = require('express')
const router = express.Router()
router.use(express.json())

/// update a customer
router.put('/customers/:customer_id', accessToken, (req, res) => {
    knex('customer').where({'customer_id':req.params.customer_id})
    .update(req.body).then((data) => {
        res.send("Your data has updated successfully..")
    }).catch((err) => {
        res.send(err.message)
    })
})

/// get data customer/id
router.get('/customer/:customer_id', accessToken, (req, res) => {
    knex.select('*').from('customer').where({'customer_id': req.params.customer_id}).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})

//// register a customer
router.post('/customers', (req, res) => {
    knex('customer').insert(req.body).then((data) => {
        res.send("Data has inserted successfully in customers table. ")
    }).catch((err) => {
        res.send(err.message)
    })
})


/// login  a customer //
router.post('/customer/login', (req, res) => { 
    knex.select("*").from('customer').where('email',req.body.email).then((data) => {
        if (data < 1) {
            res.send('You cant login this page\nBecause you did not signup yet..')
        } else {
            const token = generatToken(req.body.email)
            res.cookie('key', token) 
            res.send("Your login has completed successfully..")
            console.log("Login successfully...");
        }
    })
})



////// update the address from customer
router.put('/customer/address/:customer_id', accessToken, (req, res) => {
    knex('customer').where({'customer_id':req.params.customer_id})
    .update(req.body).then((data) => {
        res.send("Your data has updated successfully..")
    }).catch((err) => {
        res.send(err.message)
    })
})

//// update the credit card from customer 
router.put('/customer/credit_card/:customer_id', accessToken, (req, res) => {
    knex('customer').where({'customer_id':req.params.customer_id})
    .update(req.body).then((data) => {
        res.send("Your credit card has updated successfully..")
    }).catch((err) => {
        res.send(err.message)
    })
})


module.exports = router