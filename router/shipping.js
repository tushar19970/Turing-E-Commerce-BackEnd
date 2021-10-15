const express = require('express')
const knex = require('../database/db')
const router = express.Router()
router.use(express.json())

router.get('/shipping/regions', (req, res) => {
    knex.select('*').from('shipping').then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})

router.get('/shipping/regions/:shipping_region_id', (req, res) => {
    let shipping_region_id = req.params.shipping_region_id
    knex.select('*').from('shipping').where('shipping_region_id', shipping_region_id).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})

module.exports = router