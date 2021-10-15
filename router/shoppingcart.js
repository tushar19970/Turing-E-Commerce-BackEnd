const express = require('express')
const knex = require('../database/db')
const router = express.Router()
const {generateToken, accessToken} = require('../Auth/jwt')


router.get('/shoppingcart/generateUniqueId', (req, res) => {
    knex.select('*').from('shooping_cart').where({'cart_id': req.params.cart_id}).then((data) => {
        if(data.length == 1){
            res.send(data)
        } else {
            res.send('Your cart_id has not unique')
        }
    }).catch((err) => {
        res.send(err.message)
    })
})


router.post('/shoppingcart/add',async(req, res) => {
    knex.select('quantity')
        .from('shopping_cart')
        .where('shopping_cart.cart_id', req.body.cart_id)
        .andWhere('shopping_cart.product_id', req.body.product_id)
        .andWhere('shopping_cart.attributes', req.body.attributes)
        .then((data) => {
            if (data.length == 0) {
                knex('shopping_cart')
                    .insert({
                        'cart_id': req.body.cart_id,
                        'product_id': req.body.product_id,
                        'attributes': req.body.attributes,
                        'quantity': 1,
                        'added_on': new Date()
                    }).then(() => {
                    knex.select(
                        'item_id',
                        'name',
                        'attributes',
                        'shopping_cart.product_id',
                        'price',
                        'quantity',
                        'image'
                    ).from('shopping_cart').join('product', function () {
                        this.on('shopping_cart.product_id', 'product.product_id')
                        }).then(data => {
                            let datas = []
                            for (let i of data) {
                                let subtotal = i.price * i.quantity;
                                i.subtotal = subtotal;
                                console.log(i);
                                datas.push(i);
                            }
                            res.send(data);
                        }).catch(err => console.log(err));
                    }).catch((err) => console.log(err.message))
            }
        }).catch((er) => {
            console.log(er);
    })
})


router.get('/shoppingcart/:cart_id',(req, res) => {
    knex.select('item_id', 'name', 'attributes', 'shopping_cart.product_id','price','quantity','image')
    .from('shopping_cart').join('product', function () {
            this.on('shopping_cart.product_id', 'product.product_id')
        }).where('shopping_cart.cart_id', req.params.cart_id)
        .then((data) => {
            res.send(data)
        }).catch((err) => {
            res.send(err.message)
        })
})


router.put('/shoppingcart/update/:item_id',(req,res)=>{
    const item_id = req.params.item_id
    knex('shopping_cart').where('item_id',item_id).update({'quantity':req.body.quantity}).then((data)=>{
        knex.select('item_id','product.name','shopping_cart.attributes','shopping_cart.product_id',
            'product.price','shopping_cart.quantity','product.image').from('shopping_cart').join('product',function(){
                this.on('shopping_cart.product_id','product.product_id')
        }).where('item_id',item_id).then((data)=>{
            res.send(data)
        })
    })
})


router.delete('/shoppingcart/empty/:cart_id', (req, res) => {
    const cart_id = req.params.cart_id
    knex('shopping_cart').where('cart_id', cart_id).del().then((data) => {
        res.send("Your id has deleted successfully..")
    }).catch((err) => {
        res.send(err.message)
    })
})


router.get('/shoppingcart/totalAmount/:cart_id',(req, res) => {
    knex.select('price', 'quantity').from('shopping_cart').join('product', function () {
        this.on('shopping_cart.product_id', 'product.product_id')
    }).where('shopping_cart.cart_id', req.params.cart_id).then((data) => {
        let dic = {}
        let a = data[0].price * data[0].quantity
        dic.totalAmount = a
        res.send(dic)
    }).catch((err) => [
        res.send({ err: err.message })
    ])
})


router.get('/shoppingcart/savedForLater/:item_id',(req, res) => {
    knex.schema.createTable('later', function(table){
        table.increments('item_id').primary();
        table.string('cart_id');
        table.integer('product_id');
        table.string('attributes');
        table.integer('quantity');
        table.integer('buy_now');
        table.datetime('added_on');
     }).then(() => {
        console.log("later table created successfully....")
     }).catch(() => {
        console.log("later table is already exists!");
    })
    knex.select("*").from('shopping_cart').where('item_id', req.params.item_id).then((data) => {
        knex('later').insert(data[0]).then((data2) => {
            knex.select("*").from('shopping_cart').where('item_id', req.params.item_id).del().then((data3) => {
                res.send({ message: 'data move from shopping cart to save for later' })
            }).catch((err) => {
                res.send({ err: err.message })
            })
        }).catch((err) => {
            res.send({ err: err.message })
        })
    }).catch((err) => {
        res.send({ err: err.message })
    })
})


router.get('/shoppingcart/movetocart/:item_id',(req,res)=>{
    knex.schema.createTable('cart', function(table){
        table.increments('item_id').primary();
        table.string('cart_id');
        table.integer('product_id');
        table.string('attributes');
        table.integer('quantity');
        table.integer('buy_now');
        table.datetime('added_on');
     }).then(() => {
        console.log("cart table created successfully....")
     }).catch(() => {
        console.log("cart table is already exists!");
    })
    knex.select('*').from('later').where('item_id', req.params.item_id).then((data) =>{
        if (data.length>0){
            knex('cart').insert(data[0]).then((result) =>{
                knex.select('*').from('later').where('item_id', req.params.item_id).delete().then((done) =>{
                    res.send({"Good": "data move from later to cart successfully!"})
                })
            }).catch((err) =>{
                console.log(err.message);
            })
        }else{
            res.send({"Error": "this id is not available in shopping_cart"})
        }
    }).catch((err) => {
        console.log(err.message);
    })
})


router.get('/shoppingcart/getSaved/:cart_id',(req, res) => {
    knex.select('item_id','product.name','shopping_cart.attributes','product.price').from('shopping_cart').join('product',function() {
            this.on('shopping_cart.product_id', 'product.product_id')
        }).where('shopping_cart.cart_id', req.params.cart_id).then((data) => {
            res.send(data)
        }).catch((err) => {
            res.send({ err: err.message })
        })
})


router.delete('/shoppingcart/removedProduct/:item_id', (req, res) => {
    knex.select('*').from('shopping_cart').where('item_id', req.params.item_id).del().then((data) => {
        res.send({ message: 'product removed successfully from shopping cart' })
    }).catch((Err) => {
        res.send({ err: err.message })
    })
})


module.exports = router