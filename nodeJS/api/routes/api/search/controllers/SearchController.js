const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const Product = require('../../products/models/Product');
const Company = require('../../companies/models/Company');
const ProductCategory = require('../../products/models/ProductCategory');




router.get('/:searchText', (req, res) => {
    Product.find({$or:[{"alias": { $regex: '.*' + req.params.searchText + '.*', $options: '-i'  }},
     {"name.english": { $regex: '.*' + req.params.searchText + '.*', $options: '-i'  }},
     {"name.arabic": { $regex: '.*' + req.params.searchText + '.*', $options: '-i'  }},
     {"description.english": { $regex: '.*' + req.params.searchText + '.*', $options: '-i'  }},
     {"description.arabic": { $regex: '.*' + req.params.searchText + '.*', $options: '-i'  }} ], published:true, approved:true})
        .sort({ id: 1 })
        .limit(10)
        .then(products => {
            //res.json(products);

            Company.find({$or:[{"name.english": { $regex: '.*' + req.params.searchText + '.*', $options: '-i'  }} ]})
        .sort({ id: 1 })
        .limit(5)
        .then(companies => {
           // res.json(companies);


           ProductCategory.find({$or:[{"name.english": { $regex: '.*' + req.params.searchText + '.*', $options: '-i'  }} ]})
           .sort({ id: 1 })
           .limit(5)
           .then(categories => {
               res.json({products: products, companies: companies, categories: categories});
   
           });
   


        });


        });




});





module.exports = router;