const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())

const depart = require('./router/department')
app.use('/', depart)

const categ = require('./router/category')
app.use('/', categ)

const attri = require('./router/attribute')
app.use('/', attri)

const custom = require('./router/customers')
app.use('/', custom)

const prod = require('./router/products')
app.use('/', prod)

const ord = require('./router/order')
app.use('/', ord)

const shopp = require('./router/shoppingcart')
app.use('/', shopp)

const ship = require('./router/shipping')
app.use('/', ship)

const tax = require('./router/tax')
app.use('/', tax)

const port = process.env.DB_PORT || 5000

app.listen(port, () => {
    console.log(`We have connected on this port no. ${port}`);
})