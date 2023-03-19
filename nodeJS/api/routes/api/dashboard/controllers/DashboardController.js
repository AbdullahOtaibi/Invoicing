const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Order = require('../../orders/models/Order');


//GET "/v1/dashboard/info"
router.get('/info', verifyToken, async (req, res) => {
    //for testing
    req.user = { role: "Company" };
    // req.user.role = "Administrator";
    //req.user.vendorId = "62c41f9b18a37d90620948f4";
    req.user.vendorId = "6267e6337e1bf665df0b874e";

    var thirtyDays = 60 * 60 * 24 * 30;

    let result = {
        orders: 0,
        users: 0,
        quotations: 0,
        products: 0,
        allClients: 0,
        newClients: 0,
        newOrders: 0

    }


    if (!req.user) {
        res.json({ message: 'unauthorized access' });
    }
    if (req.user.role != "Administrator" && (req.user.role != "Company")) {
        res.json({ success: false, message: "Unauthorized" });
    }


    let aggregatePipeline = [];
    let productsMatcher = {};
    let ordersMatcher = {};
    let newOrdersMatcher = { dateAdded: { $gte: Date.now() - thirtyDays } };
    let quotationsMatcher = {};
    let usersMatcher = {};
    let newUsersMatcher = { registerDate: { $gte: Date.now() - thirtyDays } };

    let productsPipeline = {  };

    if (req.user.role !== "Administrator" && req.user.vendorId != null) {
       // productsMatcher = { vendor: mongoose.Types.ObjectId(req.user.vendorId) }
        ordersMatcher = { vendor: mongoose.Types.ObjectId(req.user.vendorId) }
        newOrdersMatcher = {
            dateAdded: { $gte: Date.now() - thirtyDays },
            vendor: mongoose.Types.ObjectId(req.user.vendorId)
        }
        productsPipeline = { $match: productsMatcher };
        //quotationsMatcher = { vendor: mongoose.Types.ObjectId(req.user.vendorId)};
        //ordersPipeline.$match = {
        //     "items.vendor": { $all: [req.user.vendorId] }
        // }
    }
   

    let ordersPipeline = {
        $unionWith:
        {
            coll: "OrderItems",
            pipeline: [
                {
                    $match: ordersMatcher

                },
                {
                    $group: { _id: "$order" }
                },
                {
                    $count: "orders"
                }
            ]
        }
    };

    let newOrdersPipeline = {
        $unionWith:
        {
            coll: "OrderItems",
            pipeline: [
                {
                    $match: newOrdersMatcher

                },
                {
                    $group: { _id: "$order" }
                },
                {
                    $count: "newOrders"
                }
            ]
        }
    };


    let quotationsPipeline = {

        $unionWith:
        {
            coll: "Quotations",
            pipeline: [
                {
                    $match: {
                        "deleted": { "$eq": false }
                    }
                },

                {
                    $count: "quotations"
                }
            ]
        }

    };

    let usersPipeline = {
        $unionWith:
        {
            coll: "Users",
            pipeline: [
                {
                    $match: usersMatcher
                },

                {
                    $count: "users"
                }
            ]
        }
    };

    let newUsersPipeline = {
        $unionWith:
        {
            coll: "Users",
            pipeline: [
                {
                    $match: newUsersMatcher
                },

                {
                    $count: "newUsers"
                }
            ]
        }
    };


   


    aggregatePipeline.push(productsPipeline);
    aggregatePipeline.push({
        $count: "products"
    });
    aggregatePipeline.push(ordersPipeline);
    aggregatePipeline.push(quotationsPipeline);
    aggregatePipeline.push(usersPipeline);
    aggregatePipeline.push(newUsersPipeline);
    aggregatePipeline.push(newOrdersPipeline);
   
    

    console.log(aggregatePipeline);

    let aggregateResult = await Product.aggregate(aggregatePipeline);




    // {
    //     $match: {
    //         "published": { "$eq": true }
    //     }
    // },
    // {
    //     $count: "products"
    // },
    // {
    //     $unionWith:
    //     {
    //         coll: "Users",
    //         pipeline: [
    //             {
    //                 $match: {}
    //             },

    //             {
    //                 $count: "users"
    //             }
    //         ]
    //     }
    // },

    // {
    //     $unionWith:
    //     {
    //         coll: "Orders",
    //         pipeline: [
    //             {
    //                 $match: {
    //                     "deleted": { "$eq": false }
    //                 }
    //             },
    //             {
    //                 $count: "orders"
    //             }
    //         ]
    //     }
    // }






    // let orders = await Order.find({ deleted: false }).populate("client", "-password").populate("status").populate({
    //     path: 'items',
    //     populate: {
    //         path: 'product',
    //         model: 'Product',

    //     }
    // });



    // if (req.user.role != "Administrator" && req.user.vendorId) {
    //     orders = orders.filter(order => order.items.some(item => item.product.vendor == req.user.vendorId));
    // }
    // result.orders = orders.length;

    // if (req.user.role == "Administrator") {
    //     //TODO: deleted false
    //     let products = await Product.find({mainProduct:  {$eq : null}});
    //     result.products = products.length;
    // }else if(req.user.role == "Company"){
    //     let products = await Product.find( { vendor: req.user.vendorId, mainProduct:  {$eq : null} });
    //     result.products = products.length;
    // }


    // if (req.user.role == "Administrator") {
    //     let users = await User.find({roles:  {$ne : []}});
    //     result.users = users.length;
    // }else if(req.user.role == "Company"){
    //     let users = await User.find({ vendor: req.user.vendorId });
    //     result.users = users.length;
    // }

    // let quotations = await Quotation.find({ deleted: false }).populate("status").populate({
    //     path: 'items',
    //     populate: {
    //         path: 'product',
    //         model: 'Product',

    //     }
    // });


    // if (req.user.role == "Company" && req.user.vendorId) {
    //     quotations = quotations.filter(quote => quote.items.some(item => item.product.vendor == req.user.vendorId));
    // }
    // result.quotations = quotations.length;

    // var clientsQuery = User.find({roles: []});
    // var allClientsCount = await clientsQuery.countDocuments();
    // result.allClients = allClientsCount;

    // var thirtyDays = 60 * 60 * 24 * 30;
    // var newClientsQuery = User.find({roles: [], registerDate: {$gte: Date.now() - thirtyDays} });
    // var newClientsCount = await newClientsQuery.countDocuments();
    // result.newClients = newClientsCount;


    // var ordersQuery = Order.find({});
    // var allOrdersCount = await ordersQuery.countDocuments();
    // result.orders = allOrdersCount;

    // var newOrdersQuery = Order.find({dateAdded: {$gte: Date.now() - thirtyDays} });
    // var newOrdersCount = await newOrdersQuery.countDocuments();
    // result.newOrders = newOrdersCount;



    res.json(aggregateResult);







});


module.exports = router;