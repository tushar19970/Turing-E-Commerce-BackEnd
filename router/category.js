const express = require('express')
const knex = require('../database/db')
const router = express.Router()
router.use(express.json())


router.get('/categoryAll', (req, res) => {
    knex.select('*').from('category').then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})

router.get('/category/:id', (req, res) => {
    knex.select('*').from('category').where({'category_id' : req.params.id}).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})

router.get('/category/inProduct/:product_id',(req,res)=>{
    let product_id=req.params.product_id;
    knex.select('category.category_id','department_id','name').from('category')
    .join('product_category',() => {
        this.on('category.category_id','product_category.category_id')
    }).where('product_category.category_id',product_id)
    .then((data)=>{
        console.log(data);
        res.send(data)
    }).catch((err)=>{
        console.log("something went wrong",err);
        res.send("something went wrong")
    })
})

router.get('/category/inDepartment/:department_id',(req,res)=>{
    let department_id=req.params.department_id;
    knex.select('category_id','name','description','department_id')
    .from('category')
    .where('department_id',department_id)
    .then((data)=>{
        console.log(data);
        res.send(data)
    }).catch((err)=>{
        console.log('something went wrong',err);
        res.send('something went wrong')
    })
})

module.exports = router