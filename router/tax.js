const express = require('express')
const knex = require('../database/db')
const router = express.Router()
router.use(express.json())

router.get('/taxAll', (req, res) => {
    knex.select("*").from("tax").then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})

router.get('/tax/:id',(req, res) => {
    knex.select('*').from('tax').where({"tax_id": req.params.id}).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})



module.exports = router