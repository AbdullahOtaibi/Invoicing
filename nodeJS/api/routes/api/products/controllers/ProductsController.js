const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');
const checkUser = require('../../utils/checkUser');


const Product = require('../models/Product');

const getSellingPrice = (product) => {
    let price = {amount:0, currencyCode:'USD'}
    let amount = 0;
    if(product && !product.price){
        product.price = {amount: 0, currencyCode: 'USD'}
    }
    if (product && product.price) {
        amount = product.price.amount;
    }
    if(product && product.vendor && product.vendor.profitPercentage){
        try{
            let profit = product.vendor.profitPercentage/100 * amount;
           
            
            amount = amount  + profit;
        }catch(e){

        }
    }
    if (product.discountPercentage && product.discountPercentage > 0) {
        amount = amount - (amount * product.discountPercentage / 100);
    }
    price.amount = Math.ceil(amount).toFixed(2);
    price.currencyCode = product.price.currencyCode;
    if(!price.currencyCode){
        price.currencyCode = "USD";
    }
    return price;
}

const getNextSerial = async () => {
    let maxSerial = 0;
    try {
        let itemWithMaxSerial = await Product.findOne({}).sort({ serialNumber: -1 });
        if (itemWithMaxSerial) {
            maxSerial = itemWithMaxSerial.serialNumber + 1;
        }
        console.log('maxSerial from db: ' + maxSerial);
        if (!maxSerial || isNaN(maxSerial)) {
            maxSerial = 1;
        }
    } catch (e) {
        console.log(e);
    }

    return maxSerial;
}

const generateProductCode = async (productId) => {
    console.log("Generating Product Code for [" + productId + "]");
    let product = await Product.findOne({ _id: productId }).populate("vendor").populate("category");
    if (product && product.vendor && product.category) {
        product.alias = product.vendor.code + "-" + ("000" + product.category.serialNumber).slice(-3) + "-" + ("000" + product.serialNumber).slice(-4);
        await Product.findOneAndUpdate({ _id: productId }, product);
    }

}


router.get('/all', async (req, res) => {
    var pageSize = 20;
    var page = req.params.page || 0;
    var result = {};
    var query = Product.find({ mainProduct: { $eq: null } }).populate("vendor");
    var count = await query.countDocuments();
    result.count = count;
    query.skip(page).limit(pageSize).exec('find', function (err, items) {
        result.items = items;
        res.json(result);
    });


    Product.find({ mainProduct: { $eq: null } }).populate("vendor")
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/allProductCodes', async (req, res) => {
    Product.find({ alias: { $ne: null } }, 'alias').then(items => {
        res.json(items);
    });
});


router.get('/applyToAll', async (req, res) => {
    let all = await Product.find({}).populate("vendor").populate("category");
    //let maxSerial = await getNextSerial();
    //maxSerial = 0;
    all.forEach(item => {
        console.log(item._id);
        //if (!item.serialNumber) {
        try {
            let newCode = item.vendor.code + "-" + ("000" + item.category.serialNumber).slice(-3) + "-" + ("000" + item.serialNumber).slice(-4);
            Product.findByIdAndUpdate(item._id, { alias: newCode }, function (err, updatedItem) {
                //console.log('generated new serial number is : ' + maxSerial);
            });
        } catch (e) {
            console.log(e);
        }

        // }
    });
    res.json(all);

});

router.get('/all2', (req, res) => {
    Product.find({ mainProduct: { $eq: null } }).populate("vendor")
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});


router.get('/offers', (req, res) => {
    Product.find({ mainProduct: { $eq: null }, discountPercentage: { $gt: 0 } }).populate("vendor")
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/myProducts/:page', verifyToken, async (req, res) => {
    var pageSize = 15;
    var page = parseInt(req.params.page) || 0;
    var result = {};
    result.page = page;

    if (req.user.vendorId && req.user.role != 'Administrator') {
        var query = Product.find({ vendor: req.user.vendorId, mainProduct: { $eq: null } });
        var count = await query.countDocuments();
        result.count = count;
        result.pages = Math.ceil(count / pageSize);
        query.skip(page * pageSize).limit(pageSize).exec('find', function (err, items) {
            result.items = items;
            res.json(result);
        });




    } else {
        var query = Product.find({ mainProduct: { $eq: null } });
        var count = await query.countDocuments();
        result.count = count;
        result.pages = Math.ceil(count / pageSize);
        query.skip(page * pageSize).limit(pageSize).exec('find', function (err, items) {
            result.items = items;
            res.json(result);
        });



    }

});

router.get('/myProducts2', verifyToken, (req, res) => {
    if (req.user.vendorId && req.user.role != 'Administrator') {

        Product.find({ vendor: req.user.vendorId, mainProduct: { $eq: null } })
            .sort({ id: 1 })
            .then(items => {
                res.json(items);
            });

    } else {

        Product.find({ mainProduct: { $eq: null } })
            .sort({ id: 1 })
            .then(items => {
                res.json(items);
            });

    }

});


router.get('/latest', (req, res) => {
    Product.find({ published: true, approved: true, mainProduct: { $eq: null } }).limit(10)
        .sort({ dateAdded: 1 })
        .then(items => {
            res.json(items);
        });
});


router.get('/autoComplete/:searchText', (req, res) => {
    Product.find({ $or: [{ "alias": { $regex: '.*' + req.params.searchText + '.*', $options: '-i' } }, { "name.english": { $regex: '.*' + req.params.searchText + '.*', $options: '-i' } }] })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/byCompany/:vendorId', (req, res) => {
    console.log('All Peorudtcs for Company with Id: ' + req.params.vendorId)
    Product.find({ $and: [{ vendorId: req.params.vendorId }, { published: true }, { approved: true }, { mainProduct: { $eq: null } }] })
        .sort({ id: 1 })
        .then(items => {

            res.json(items);
        });
});

router.get('/byCategory/:categoryId', (req, res) => {
    console.log('All Peorudtcs for Category with Id: ' + req.params.categoryId)
    Product.find({ $and: [{ category: req.params.categoryId }, { published: true }, { approved: true }, { mainProduct: { $eq: null } }] })
        .sort({ id: 1 })
        .then(items => {

            res.json(items);
        });
});

router.get('/recent', (req, res) => {
    Product.find({ mainProduct: { $eq: null } }, null, { limit: 9 })
        .sort({ id: -1 })
        //.limit(9)
        .then(items => {
            res.json(items);
        });
});



router.get('/byShop/:shopId', (req, res) => {
    Product.find({ shopId: req.params.shopId })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/get/:id', (req, res) => {
    Product.findOne({ _id: req.params.id })
        .populate("relatedProducts")
        .populate("vendor")
        .populate("productVariants")
        .populate("category")
        .populate("categories")
        .populate({
            path: 'category',
            populate: {
                path: 'parent',
                model: 'ProductCategory',

            }
        })

        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/getProductByCode/:code', (req, res) => {
    var regex = new RegExp(["^", req.params.code, "$"].join(""), "i");
    Product.findOne({ alias: regex })
        .populate("relatedProducts")
        .populate("vendor")
        .populate("productVariants")
        .populate("category")
        .populate({
            path: 'category',
            populate: {
                path: 'parent',
                model: 'ProductCategory',

            }
        })


        .then(items => {
            items.sellingPrice = getSellingPrice(items);
            res.json(items);
        });
});



router.post('/create', verifyToken, async (req, res, next) => {
    const newObject = new Product({
        ...req.body,
        vendorId: req.user.vendorId,
        vendor: req.user.vendorId
    });
    newObject.addedBy = req.user.id;
    newObject.serialNumber = await getNextSerial();
    if (newObject.name) {
        if (!newObject.name.arabic && newObject.name.english) {
            newObject.name.arabic = newObject.name.english;
        }
        if (!newObject.name.turkish && newObject.name.english) {
            newObject.name.turkish = newObject.name.english;
        }
    }
    //TODO: await save
    newObject._id = new mongoose.Types.ObjectId();
    newObject.save().then(createdObject => {
        generateProductCode(newObject._id);
        res.notify = { code: 'products', extra: 'new-product' };
        console.log('saved into database...');
        res.json(createdObject);
    }).catch(e => {
        console.log('cannot save into database', e.message);
        res.json(e);
    });

    //next();
});

router.get('/removeVariant/:id', verifyToken, async (req, res) => {

    Product.findByIdAndUpdate(req.params.id, { mainProduct: null }, function (err, item) {
        console.log('saved into database...');


    }).then(() => {
        Product.findOne({ _id: req.params.id }).populate("relatedProducts").populate("productVariants")
            .sort({ id: 1 })
            .then(item => {
                res.json(item);
            });
    })
});



//TODO: implement update
router.post('/update', verifyToken, async (req, res) => {
    console.log('product update called.');
    //console.log("updating product...");
    // console.log(req.user);
    // console.log('vendor id : ' + req.user.vendorId);
    if (req.user.vendorId && req.user.role != "Administrator") {
        req.body.vendorId = req.user.vendorId;
        req.body.vendor = req.user.vendorId;
    } else if (req.body.vendorId && req.user.role == "Administrator") {
        req.body.vendor = req.body.vendorId;
    }

    if (req.user.role == "Administrator") {

    } else {
        req.body.approved = false;
    }

    if (!req.body.serialNumber) {
        req.body.serialNumber = await getNextSerial();
    }
    if (req.body.name) {
        if (!req.body.name.arabic && req.body.name.english) {
            req.body.name.arabic = req.body.name.english;
        }
        if (!req.body.name.turkish && req.body.name.english) {
            req.body.name.turkish = req.body.name.english;
        }
    }

    //console.log(req.body);
    let result = await Product.findOneAndUpdate({ _id: req.body._id }, req.body);
    res.json(result);
});

router.post('/setApproved', verifyToken, async (req, res) => {
    let success = false;
    let updateToApply = {}
    let approved = req.body.approved;
    if (req.user.role == "Administrator") {
        updateToApply.approved = approved;
        success = true;
    } else {
        success = false;
    }
    Product.findByIdAndUpdate(req.body.id, updateToApply, function (err, item) {
        console.log('saved into database...');
        res.json({ success: success, approved: approved });
    })
});

router.post('/setpublished', verifyToken, async (req, res) => {
    let success = false;
    let updateToApply = {}
    let published = req.body.published;
    if (req.user.role == "Administrator" || req.user.role == "Company") {
        updateToApply.published = published;
        success = true;
    } else {
        success = false;
    }
    Product.findByIdAndUpdate(req.body.id, updateToApply, function (err, item) {
        console.log('saved into database...');
        res.json({ success: success, published: published });
    })
});




router.get('/byCategoryId/:categoryId', (req, res) => {
    // console.log("Param : " + req.params.categoryId);
    Product.find({ $and: [{ category: req.params.categoryId }, { published: true }, { approved: true }, { mainProduct: { $eq: null } }] })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});


router.post('/filter', checkUser, async (req, res) => {
    var pageSize = 20;
    var page = req.body.page || 0;
    let categoryId = req.body.categoryId || null;
    let categoryUrl = req.body.categoryUrl || null;

    let vendorId = req.body.vendorId || null;
    let minPrice = req.body.minPrice || null;
    let maxPrice = req.body.maxPrice || null;
    let filters = req.body.filters || [];
    let categories = req.body.categories || [];
    let showMainOnly = req.body.showMainOnly || true;
    let sortBy = req.body.sortBy || {_id:1};

    //console.log("price between " + minPrice + " and " + maxPrice);
    // console.log(filters);
    var result = {};
    let queryParams = {
        '$and': []
    };
    let filtersParams = {
        '$or': []
    };

    let categoriesParams = {
        '$or': []
    };



    // queryParams['$and'].push({ 'mainProduct': { $eq: null } });
    queryParams['$and'].push({ 'published': true });
    queryParams['$and'].push({ 'approved': true });
    if (categoryId) {
        queryParams['$and'].push({ 'categories': categoryId });
    }
    if (categoryUrl) {
        try {
            let category = await ProductCategory.findOne({ urlKey: categoryUrl });
            if (category && category._id) {

                categoriesParams['$or'].push({
                    categories: category._id
                });
                if(!categories || categories.length == 0){
                    categories = await ProductCategory.find({parent: category._id}, {_id: 1});
                    categories = categories.map(c => {return ''+c._id;});
                }
                // let subCategories = await ProductCategory.find({parent: category._id})

                // queryParams['$and'].push({ 'category': category._id });
            }
        } catch (e) {

        }

    }


    if (vendorId) {
        queryParams['$and'].push({ 'vendor': vendorId });
    }


    if (showMainOnly) {
        queryParams['$and'].push({ 'mainProduct': { $eq: null } });

    }
    if (minPrice && minPrice > 0) {
        queryParams['$and'].push({ 'price.amount': { $gte: minPrice } });
    }
    if (maxPrice && maxPrice > 0) {
        queryParams['$and'].push({ 'price.amount': { $lte: maxPrice } });
    }


    // if (filters.length > 0) {
    //     filters.forEach(filterId => {

    //         filtersParams['$or'].push({
    //             filters: { $elemMatch: { $eq: filterId } }
    //         });
    //     });
    //     queryParams['$and'].push(filtersParams);
    // }

    if (categories.length > 0) {
        categories.forEach(categoryId => {
           // console.log('adding category id : ' + categoryId)
            categoriesParams['$or'].push({
                categories: categoryId  //category: { $eq: categoryId }
            });
        });

    }
    if (categoriesParams['$or'].length > 0) {
        queryParams['$and'].push(categoriesParams);
    } else if(categoryId){
        queryParams['$and'].push({ 'categories': categoryId });
    }
console.log('query============================');
console.log(JSON.stringify(queryParams));
console.log('query============================');
   // console.log(JSON.stringify(queryParams));

    // queryParams['$and'].push({ 'price': { $gte: +filter.low, $lte: +filter.high } });

    var query = Product.find(queryParams).populate("vendor").populate("productVariants").populate("category").sort(sortBy);
    var countQuery = Product.find(queryParams).populate("vendor").populate("productVariants").populate("category");
    var count = await countQuery.countDocuments();
    result.count = count;
    result.page = page;
    result.pages = Math.ceil(count / pageSize);


    await query.skip(page * pageSize).limit(pageSize).exec('find', function (err, items) {
        for (itemIndex in items) {
            items[itemIndex].sellingPrice = getSellingPrice(items[itemIndex]);
        }
        if (!req.user) {
            for (itemIndex in items) {
                
                items[itemIndex].price = null;
               
            }
        }
        result.items = items;
        res.json(result);
    });

});


router.post('/adminProducts', verifyToken, async (req, res) => {
    var pageSize = 100;

    // let categoryId = req.body.categoryId || null;
    let filters = req.body || {};
    let productName = filters.productName || null;
    let productAlias = filters.alias || null;
    let sku = filters.sku || null;
    let categoryId = req.body.categoryId || null;
    var page = filters.page || 0;
    let vendorId = filters.vendorId || null;
    let isPublished = filters.published;
    let approved = filters.needsApproval || null;
    let offers = filters.offers || null;



    //console.log(filters);
    var result = {};
    result.page = page;
    let queryParams = {
        '$and': []
    };
    let nameParams = {
        '$or': []
    }
    if (req.user.role == 'Company') {
        queryParams['$and'].push({ 'vendorId': req.user.vendorId });
    }
    if (req.user.role == 'Administrator' && vendorId && vendorId.length > 0) {
        queryParams['$and'].push({ "vendor": vendorId });
    }


    if (productName) {
        nameParams['$or'].push({ "name.english": { $regex: '.*' + productName + '.*', $options: '-i' } });
        nameParams['$or'].push({ "name.arabic": { $regex: '.*' + productName + '.*', $options: '-i' } });
        nameParams['$or'].push({ "name.turkish": { $regex: '.*' + productName + '.*', $options: '-i' } });
        queryParams['$and'].push(nameParams);
    }
    if (productAlias && productAlias.length > 0) {
        queryParams['$and'].push({ "alias": { $regex: '.*' + productAlias + '.*', $options: '-i' } });

    }

    if (sku) {
        queryParams['$and'].push({ "sku": { $regex: '.*' + sku + '.*', $options: '-i' } });

    }

    if (offers) {
        queryParams['$and'].push({ discountPercentage: { $gt: 0 } });

    }

    if (categoryId) {
        queryParams['$and'].push({ 'category': categoryId });
    }



    if (isPublished == true) {
        queryParams['$and'].push({ "published": isPublished });
    }
    if (isPublished == false) {
        queryParams['$and'].push({ "published": { $ne: true } });
    }


    if (approved) {
        queryParams['$and'].push({ "approved": { $ne: true } });
    }



    // queryParams['$and'].push({ 'price': { $gte: +filter.low, $lte: +filter.high } });
    var query = Product.find({})
        .populate({ "path": "vendor", "select": "name -_id" })
        .populate({ "path": "category", "select": "name -_id" })
        .populate({ "path": "addedBy", "select": "firstName surName -_id" })
        .select("_id name alias sku addedBy published approved");

    var countQuery = Product.find({});


    if (queryParams['$and'].length > 0) {
        query = Product.find(queryParams)
            .populate({ "path": "vendor", "select": "name -_id" })
            .populate({ "path": "category", "select": "name -_id" })
            .populate({ "path": "addedBy", "select": "firstName surName -_id" })
            .select("_id name alias sku addedBy published approved");
        countQuery = Product.find(queryParams);

    }


    //console.log(queryParams);
    var count = await countQuery.countDocuments();
    result.count = count;


    result.pages = Math.ceil(count / pageSize);

    query.skip(page * pageSize).limit(pageSize).exec('find', function (err, items) {
        result.items = items;
        res.json(result);
    });

});




router.get('/byCompanyId/:vendorId', (req, res) => {
    console.log("Param : " + req.params.vendorId);
    Product.find({ $and: [{ vendor: req.params.vendorId }, { published: true }, { approved: true }, { mainProduct: { $eq: null } }] })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});



// router.get('/fixCategories', (req, res) => {
//     console.log("updating category ids");
//     Product.find({ })
//         .sort({ id: 1 })
//         .then(items => {
//             for(itemIndex in items){
//                 let item = items[itemIndex];
//                 console.log(item._id);
//                 Product.findByIdAndUpdate(item._id, {category: item.categoryId}, function (err, item) {
//                    // console.log('saved into database...');


//                 });

//             }

//             res.json(items);
//         });
// });









router.get('/byCategoryIds/:categoryIds', (req, res) => {
    console.log("Param : " + req.params.categoryIds);
    Product.find({ alias: req.params.categoryIds })
        .sort({ id: 1 })
        .then(items => {
            res.json(items[0]);
        });
});



router.get('/remove/:id', verifyToken, async (req, res) => {
    if (req.user.role != 'Administrator') {
        res.json({ success: false, message: 'Unauthorized Access' });
    }
    console.log("Param : " + req.params.id);
    //remove variants first
    let variants = await Product.find({ mainProduct: req.params.id });
    if (variants) {
        variants.forEach(variant => {
            Product.findById(variant._id)
                .then(item =>
                    item.remove().then(() => { console.log(`variant ${variant._id} romved`) }).catch(e => console.error(e)));
        });
    }

    //removing from mainProduct if is variant
    let product = await Product.findOne({ _id: req.params.id });
    if (product.mainProduct) {
        let mainProduct = await Product.findOne({ _id: product.mainProduct });
        mainProduct.productVariants = mainProduct.productVariants.filter(v => v != product._id);
        //update here
        Product.findByIdAndUpdate(mainProduct._id, mainProduct, function (err, item) {

        });
    }

    Product.findById(req.params.id)
        .then(item =>
            item.remove().then(() => res.json({ success: true }))).catch(e => res.status(404).json({ success: false }));
});


router.get('/clone/:id', verifyToken, async (req, res) => {
    let product = await Product.findOne({ _id: req.params.id });
    var d1 = product;
    d1._id = new mongoose.Types.ObjectId();
    d1.isNew = true;
    d1.serialNumber = await getNextSerial();
    d1.addedBy = req.user.id;
    d1.save().then(createdObject => {
        generateProductCode(d1._id);
        res.json(createdObject);
    });


});

router.get('/createVariant/:id', verifyToken, async (req, res, next) => {
    let product = await Product.findOne({ _id: req.params.id });
    if (!product) {
        res.json({ message: "Main Product doesnot exists" });
    } else {
        var d1 = product;
        if (product.mainProduct) {
            d1.mainProduct = product.mainProduct;
        } else {
            d1.mainProduct = req.params.id;
        }
        d1._id = new mongoose.Types.ObjectId();
        d1.isNew = true;
        d1.addedBy = req.user.id;
        d1.name.english += ' variant ' + d1._id;
        d1.productVariants = null;
        d1.serialNumber = await getNextSerial();
        let savedVariant = null;
        await d1.save().then(createdObject => {
            savedVariant = createdObject;
        });
        //updating main product
        let mainProduct = await Product.findOne({ _id: d1.mainProduct });
        if (!mainProduct.productVariants) {
            mainProduct.productVariants = [];
        }
        mainProduct.productVariants.push(savedVariant._id);

        Product.findByIdAndUpdate(d1.mainProduct, mainProduct);
        generateProductCode(savedVariant._id);
        res.notify = { code: 'products', extra: 'new-product' };
        res.json(savedVariant);
    }
    next();

});

router.get('/getVariants/:id', (req, res) => {
    Product.find({ $or: [{ mainProduct: req.params.id }, { _id: req.params.id }] })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);

        });
});


router.get('/removeVariant/:id', (req, res) => {
    console.log("Param : " + req.params.id);
    Product.findById(req.params.id)
        .then(item => {

            item.remove().then(() => {
                Product.findByIdAndUpdate(req.body._id, req.body, function (err, item) {
                    console.log('saved into database...');


                }
                )

            })
        }).catch(e => res.status(404).json({ success: false }));
});


module.exports = router;