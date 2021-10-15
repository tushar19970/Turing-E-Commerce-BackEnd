const express = require('express')
const knex = require('../database/db')
const router = express.Router()
router.use(express.json())

router.get('/attributeAll', (req, res) => {
    knex.select("*").from("attribute").then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})

router.get("/attribute/:id", (req, res) => {
    knex.select("*").from("attribute").where({"attribute_id": req.params.id}).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})

router.get('/attribute/value/:attribute_id',(req,res)=>{
    let attribute_id=req.params.attribute_id;
    knex.select('attribute_value_id','value').from('attribute_value')
    .where('attribute_id',attribute_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err.message)
    })
})

router.get('/attribute/inProduct/:product_id',(req,res)=>{
    let product_id=req.params.product_id;
    knex.select('*')
    .from('attribute')
    .join('attribute_value',function(){
        this.on('attribute.attribute_id','attribute_value.attribute_id')
    })
    .join('product_attribute',function(){
        this.on('attribute_value.attribute_value_id','product_attribute.attribute_value_id' )
    })
    .where('product_attribute.product_id',product_id)
    .then((data)=>{
        console.log(data);
        res.send(data)
    }).catch((err)=>{
        console.log('something went wrong',err)
        res.send('something went wrong')
    })

})

module.exports = router