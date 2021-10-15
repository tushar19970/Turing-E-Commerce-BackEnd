const express = require('express')
const knex = require('../database/db')
const router = express.Router()
router.use(express.json())

router.get('/home', (req, res) => {
    res.send("We have reached at our home page..")
})

router.get('/departmentAll', (req, res) => {
    knex.select("*").from('department').then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})

router.get('/department/:id', (req, res) => {
    knex.select("*").from('department').where({"department_id": req.params.id}).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})

module.exports = router