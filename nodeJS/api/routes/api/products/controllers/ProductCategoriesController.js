const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const verifyToken = require('../../utils/auth');
const forUrl = require('../../utils/utils');

const ProductCategory = require('../models/ProductCategory');
const Company = require('../../companies/models/Company');

const getNextSerial = async () => {
    let maxSerial = 0;
    try {
        let itemWithMaxSerial = await ProductCategory.findOne({}).sort({ serialNumber: -1 });
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


router.get('/all', (req, res) => {
    ProductCategory.find({ published: true })
        .sort({ id: 1 })
        .then(items => {

            res.json(items);
        });
});

router.get('/mainWithProductsCount', async (req, res) => {
    let result = [];
    let promises = [];
    try {
        let categories = await ProductCategory.find({  }).sort({ id: 1 });
        categories.forEach(async cat => {
           


            let p1 =  Product.countDocuments({ categories: cat._id }).then(c => {
                result.push({ productsCount: c, _id: cat._id , name: cat.name.english, published: cat.published, level: cat.level, parentId: cat.parent, serialNumber: cat.serialNumber});
                //console.log('subCount : ' + c);
            });
            promises.push(p1);
        });

      //  res.json(result);
    } catch (e) {
        res.json(result);
    }


    Promise.all(promises).then((values) => {
        res.json(result.sort((a,b) => a.serialNumber - b.serialNumber));
    });


});

router.get('/cp/forProduct', verifyToken, (req, res) => {

    if (req.user.role != "Administrator" && req.user.vendorId) {
        Company.findOne({ _id: req.user.vendorId })
            .sort({ id: 1 })
            .then(vendor => {
                if (vendor && !vendor.categories) {
                    vendor.categories = [];
                }

                ProductCategory.find({ _id: { $in: vendor.categories }, deleted: { $ne: true }, level: 3 })
                    .sort({ id: 1 })
                    .then(items => {
                        res.json(items);
                    });
            });
    } else {
        ProductCategory.find({})
            .sort({ id: 1 })
            .then(items => {

                res.json(items);
            });
    }


});

router.get('/main', (req, res) => {
    ProductCategory.find({ deleted: { $ne: true } })
        .sort({ id: 1 })
        .then(items => {

            res.json(items);
        });
});

router.get('/subWithCounts/:parentId', async (req, res) => {
    let result = [];
    let promises = [];
    try {
        let categories = await ProductCategory.find({ parent: req.params.parentId }).sort({ id: 1 });
        categories.forEach(async cat => {
           


            let p1 =  ProductCategory.countDocuments({ parent: cat._id }).then(c => {
                result.push({ subCategoriesCount: c, _id: cat._id , name: cat.name, published: cat.published, level: cat.level});
                //console.log('subCount : ' + c);
            });
            promises.push(p1);
        });

      //  res.json(result);
    } catch (e) {
        res.json(result);
    }


    Promise.all(promises).then((values) => {
        res.json(result);
    });


});


router.get('/mainWithCounts', async (req, res) => {
    let result = [];
    let promises = [];
    try {
        let categories = await ProductCategory.find({ parent: null }).sort({ id: 1 });
        categories.forEach(async cat => {
           


            let p1 =  ProductCategory.countDocuments({ parent: cat._id }).then(c => {
                result.push({ subCategoriesCount: c, _id: cat._id , name: cat.name, published: cat.published, level: cat.level});
                //console.log('subCount : ' + c);
            });
            promises.push(p1);
        });

      //  res.json(result);
    } catch (e) {
        res.json(result);
    }


    Promise.all(promises).then((values) => {
        res.json(result.sort((a,b) => a._id - b._id));
    });


});


router.get('/sub/:parentId', (req, res) => {
    ProductCategory.find({ parent: req.params.parentId })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});


router.get('/vendorCategories', (req, res) => {
    ProductCategory.find({ parent: { $ne: null }, published: true, deleted: { $ne: true } })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});




router.get('/mainCategories', (req, res) => {
    ProductCategory.find({ parent: null, published: true, deleted: { $ne: true } })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/subCategories/:id', (req, res) => {
    ProductCategory.find({ parent: req.params.id, published: true, deleted: { $ne: true } })
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/subCategoriesByUrl/:urlKey', async (req, res) => {
    let parent = await ProductCategory.findOne({ urlKey: req.params.urlKey });
    if (parent) {
        ProductCategory.find({ parent: parent._id, published: true, deleted: { $ne: true } })
            .sort({ id: 1 })
            .then(items => {
                res.json(items);
            });
    } else {
        res.json([]);
    }

});



// "/v1/category/{id}"
router.get('/get/:id', (req, res) => {
    console.log('getting category ' + req.params.id);
    ProductCategory.findOne({ _id: req.params.id }).populate("parent")
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/getByUrl/:urlKey', (req, res) => {
    console.log('getting category by url ' + req.params.urlKey);
    ProductCategory.findOne({ urlKey: req.params.urlKey }).populate("parent")
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});



router.get('/applyToAll', async (req, res) => {
    let all = await ProductCategory.find({});
    let maxSerial = await getNextSerial();
    //maxSerial = 0;
    all.forEach(item => {
        console.log(item._id);
        if (!item.serialNumber) {

            ProductCategory.findByIdAndUpdate(item._id, { serialNumber: maxSerial++ }, function (err, updatedItem) {
                console.log('generated new serial number is : ' + maxSerial);
            })

        }
    });
    res.json(all);

});



// "/v1/categories/create"
router.post('/create', verifyToken, async (req, res) => {


    const newObject = new ProductCategory({
        ...req.body
    });

    newObject.serialNumber = await getNextSerial();

    newObject._id = new mongoose.Types.ObjectId();
    newObject.urlKey = forUrl(req.body.name.english);
    newObject.save().then(createdObject => {

        console.log('saved into database...');
        res.json(createdObject);
    }).catch(e => {
        console.log('cannot save into database', e.message);
        res.json(e);
    });
});

// "/v1/categories/update"
router.post('/update', verifyToken, async (req, res) => {
    if (req.body.parent == '') {
        req.body.parent = null;
    }
    if (req.body.filters) {
        for (var cf in req.body.filters) {
            if (!req.body.filters[cf]._id) {
                req.body.filters[cf]._id = new mongoose.Types.ObjectId();
            }
        }
    }
    if (!req.body.serialNumber) {
        console.log('generating serial number...');

        req.body.serialNumber = await getNextSerial();
        console.log('generated new serial number is : ' + req.body.serialNumber);
    }

    ProductCategory.findByIdAndUpdate(req.body._id, { ...req.body, urlKey: forUrl(req.body.name.english) }, function (err, item) {
        console.log('categroy updates saved into database...');
        res.json(item);
    })


});


router.get('/updateUrls', verifyToken, async (req, res) => {

    let allCategories = await ProductCategory.find({});
    for (var index in allCategories) {
        let category = allCategories[index];
        ProductCategory.findByIdAndUpdate(category._id, { urlKey: forUrl(category.name.english) }, function (err, item) {


        })
    }
    console.log('all urls updated...');
    res.json({ success: true });



});



// "/v1/categories/remove/{id}"
router.get('/remove/:id', verifyToken, async (req, res) => {
    console.log("Param : " + req.params.id);
    ProductCategory.findByIdAndUpdate(req.params.id, { deleted: true }, function (err, item) {
        console.log('saved into database...');
        res.json(item);
    })

});

module.exports = router;