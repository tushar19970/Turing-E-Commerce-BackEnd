const express = require('express')
const { accessToken, generatToken } = require('../Auth/jwt')
const knex = require('../database/db')
const router = express.Router()
router.use(express.json())


router.get('/productAll', (req, res) => {
    knex.select("*").from("product").then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})


router.get("/product/search", (req, res) => {
    const search = req.query.search;
    knex.select('product_id', 'name', 'description', 'price', 'discounted_price', 'thumbnail').from('product')
        .where('name', 'like', '%' + search + '%')
        .orWhere('description', 'like', '%' + search + '%')
        .orWhere('product_id', 'like', '%' + search + '%')
        .then((data) => {
            res.send(data);
        }).catch((err) => {
            res.send(err.message);
        })
});


router.get('/product/:id', (req, res) => {
    knex.select("*").from("product").where({'product_id':req.params.id}).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})


router.get('/product/inCategory/:category_id',(req,res)=>{
    let category_id = req.params.category_id
    knex.select('product.product_id',
    'name','description','price','discounted_price','thumbnail').from('product')
    .join('product_category', function() {
        this.on('product.product_id','product_category.product_id')
    }).where('product.product_id',category_id).then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err.message)
    })
})


router.get('/product/inDepartment/:department_id',(req,res)=>{
    let department_id = req.params.department_id
    knex.select('product.product_id'
    ,'product.name'
    ,'product.description'
    ,'product.price'
    ,'product.discounted_price'
    ,'product.thumbnail'
    )
    .from('product')
    .join('product_category',function(){
        this.on('product.product_id','product_category.category_id')
    })
    .join('category',function(){
        this.on('product_category.category_id','category.category_id')
    })
    .join('department',function(){
        this.on('category.department_id','department.department_id')
    })
    .where('department.department_id',department_id)
    .then((data)=>{
        res.send(data)
    }).catch((err)=>{
        res.send(err.message)
    })
})



router.get('/product/:product_id/details', (req, res) => {
    let product_id = req.params.product_id
    knex.select('name', 'description', 'price', 'discounted_price', 'image', 'image_2').from('product')
    .where('product_id', product_id).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})


product.get("/products/:product_id/locations", (req, res) =>{
    let product_id = req.params.product_id;
    knex.select(
        'category.category_id',
        'category.name as category_name',
        'category.department_id',
        'department.name as department_name').from('product')
    .join('product_category', function(){
        this.on('product.product_id', 'product_category.product_id')
    })
    .join('category', function(){
        this.on('product_category.category_id', 'category.category_id')
    })
    .join('department', function(){
        this.on('category.department_id', 'department.department_id')
    })
    .where('product.product_id', product_id)
    .then((data) =>{
        res.send(data);
    }).catch((err) =>{
        console.log(err.message);
    })
})


product.post('/products/:product_id/review',accessToken,(req,res)=>{
    const product_id=req.params.product_id;
    knex.select("*").from('customer').where('customer_id',req.data.customer_id).then((data)=>{
        knex('review').insert({
            review: req.body.review,
            rating: req.body.rating,
            product_id: product_id,
            created_on: new Date,
            customer_id: data[0].customer_id
        }).then((data)=>{
            res.send({message:"review and rating"})
        }).catch((err)=>{
            res.send(err.message)
        })
    })
})


router.get('/product/:product_id/reviews', (req, res) => {
    let product_id = req.params.product_id
    knex.select('*').from('review').where('product_id', product_id).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send(err.message)
    })
})


module.exports = router