const mongoose = require('mongoose');
const NavigationMenu = require('../models/NavigationMenu');
const NavigationMenuItem = require('../models/NavigationMenuItem');


function NavigationMenus() {
    this.getMenuByCode = async function (code) {
        let result = {};
        try {
            let menu = await NavigationMenu.findOne({ code: code }).populate({
                path: 'items',
                populate: {
                    path: 'items',
                    model: 'NavigationMenuItem'
                }
            });
            menu.items = menu.items.sort((a, b) => {
                return a.order - b.order;
            });
            menu.items.forEach(item => {
                item.items = item.items.sort((a, b) => {
                    return a.order - b.order;
               });
             });

            menu.items = menu.items.filter(mi => mi.parent == null && mi.published == true);
            result.menu = menu;
            result.success = true;
        } catch (e) {
            result.sucess = false;
            result.errorMessage = e.message;
        }


        return result;
    }



    this.getMenuById = async function (id) {
        let result = {};
        try {
            let menu = await NavigationMenu.findOne({ _id: id }).populate("items").populate({
                path: 'items',
                populate: {
                    path: 'items',
                    model: 'NavigationMenuItem'
                }
            });
             menu.items = menu.items.sort((a, b) => {
                  return a.order - b.order;
             });

             menu.items.forEach(item => {
                item.items = item.items.sort((a, b) => {
                    return a.order - b.order;
               });
             });


            result.menu = menu;
           // console.log(menu);
            result.success = true;
        } catch (e) {
            result.sucess = false;
            result.errorMessage = e.message;
        }


        return result;
    }

    this.getNewOrder = async (menuId, parentId) => {
        let newOrder = 1;
        let lastItem = null;
        if (parentId) {
            lastItem = await NavigationMenuItem.findOne({ menu: menuId }).sort({ order: -1 });
        } else {
            lastItem = await NavigationMenuItem.findOne({ menu: menuId, parent: parentId }).sort({ order: -1 });
        }
        if (lastItem) {
            newOrder = lastItem.order + 1;
        }
        return newOrder;
    }
    this.addMenuItem = async function (item) {
        let result = {};
        try {
            let newOrder = await this.getNewOrder(item.menu, item.parent);
            const newObject = new NavigationMenuItem({
                ...item
            });
            newObject.order = newOrder;
            newObject.title = item.title;
            newObject.parent = item.parent;
            newObject._id = new mongoose.Types.ObjectId();
            let savedItem = await newObject.save();


            if (savedItem.parent) {
                let parentITem = await NavigationMenuItem.findOne({ _id: savedItem.parent });
                if (!parentITem.items) {
                    parentITem.items = [];
                }
                parentITem.items.push(savedItem._id);
                await NavigationMenuItem.findByIdAndUpdate(parentITem._id, parentITem);
            } else {
                let menu = await NavigationMenu.findOne({ _id: savedItem.menu });
                if (!menu.items) {
                    menu.items = [];
                }
                menu.items.push(savedItem._id);
                await NavigationMenu.findByIdAndUpdate(menu._id, menu);
            }


        } catch (e) {
            result.sucess = false;
            result.errorMessage = e.message;
        }

        return result;
    }

    this.updateMenuItem = async function (item) {
        let result = {};
        try {
            let updates = { published: item.published, link: item.link, order: item.order, target: item.target, title: item.title, article: item.article, parent: item.parent };
            let updatedItem = await NavigationMenuItem.findByIdAndUpdate(item._id, updates);
        } catch (e) {
            result.sucess = false;
            result.errorMessage = e.message;
        }

        return result;
    }

    this.updateItem = async (item) => {
        let result = await NavigationMenuItem.findByIdAndUpdate(item._id, item);
        return result;
    }

    this.reorderItems = async ({ itemId, newOrder }) => {
        let item = await NavigationMenuItem.findOne({ _id: itemId });
        console.log('new order : ' + newOrder);
        console.log('==============================');
        console.log('item id : ' + itemId);
        console.log('item title : ' + item.title.english);
        console.log('item parent : ' + item.parent);
        console.log('item menu : ' + item.menu);
        //console.log('itemId: ' + itemId);
        let items = await NavigationMenuItem.find({ menu: item.menu, parent: { $eq: item.parent } });
        //  console.log(items);

        items.forEach(oi => {
            if (oi._id == itemId) {
                oi.order = parseFloat(newOrder) + 0.5;
            }
        });


        items = items.sort((a, b) => {
            return a.order - b.order;
        });

        let newIndex = 0;
        items.forEach(oi => {
            oi.order = ++newIndex;
            console.log('updating menu item order [' + oi.title.english + '] to ' + newIndex);
            this.updateItem(oi);
           
           
        })
       


        //console.log(items);

        return {}

        // //console.log('reordered =================');


        // console.log('saving to database...');

    }

}
module.exports = new NavigationMenus();  