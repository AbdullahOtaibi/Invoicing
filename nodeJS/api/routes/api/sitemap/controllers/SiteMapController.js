const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const verifyToken = require('../../utils/auth');
const fs = require('fs');
var builder = require('xmlbuilder');
var dirPath = __dirname + "../../../../client/build/sitemap.xml";
const config = require('config')
const moment = require('moment')


router.get('/generate', verifyToken, async (req, res) => {
    let totalUrls = 0;
    var xml = builder.create('urlset', {'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9'})
    .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
   

  
    
    
    let mainCategories = await ProductCategory.find({parent: null});
    for(var catIndex in mainCategories){
        totalUrls++;
        let category = mainCategories[catIndex];
        //console.log('category id:' + category._id);
        let url = 'https://waredly.com/category/'+category.urlKey;
        xml.ele('url').ele('loc', url).up()
        .ele('lastmod', moment().format('YYYY-MM-DD')).end();
        totalUrls++;
         url = 'https://waredly.com/ar/category/'+category.urlKey;
        xml.ele('url').ele('loc', url).up()
        .ele('lastmod', moment().format('YYYY-MM-DD')).end();


        let subCategories = await ProductCategory.find({parent:  category._id, published: true});
        for(var subCatIndex in subCategories){
            totalUrls++;
            let category = subCategories[subCatIndex];
            //console.log('category id:' + category._id);
            let url = 'https://waredly.com/category-products/'+category.urlKey;
            totalUrls++;
            xml.ele('url').ele('loc', url).up()
            .ele('lastmod', moment().format('YYYY-MM-DD')).end();

            url = 'https://waredly.com/ar/category-products/'+category.urlKey;
            xml.ele('url').ele('loc', url).up()
            .ele('lastmod', moment().format('YYYY-MM-DD')).end();

    
        }

        let products = await Product.find({published: true});
        for(var productIndex in products){
            let product = products[productIndex];
            //console.log('product id:' + product._id);
            let url = 'https://waredly.com/product/'+product._id;
            totalUrls++;
            xml.ele('url').ele('loc', url).up()
            .ele('lastmod', moment().format('YYYY-MM-DD')).end();

             url = 'https://waredly.com/ar/product/'+product._id;
             totalUrls++;
            xml.ele('url').ele('loc', url).up()
            .ele('lastmod', moment().format('YYYY-MM-DD')).end();
    
        }

    }

   


    var xmldoc = xml.toString({ pretty: true });

    
    fs.writeFile(process.env.CLIENT_ROOT + 'sitemap.xml', xmldoc, function(err) {

        if(err) { return console.log(err); } 
    
           console.log("The file was saved to " + process.env.CLIENT_ROOT + 'sitemap.xml');
           
         //  res.render('index');
         res.json({totalUrls: totalUrls});
     });

   // console.log(xmldoc);
   
});


module.exports = router;
