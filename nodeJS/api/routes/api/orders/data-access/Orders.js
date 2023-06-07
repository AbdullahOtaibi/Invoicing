const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const OrderStatus = require('../models/OrderStatus');
const { query } = require('express');
const Payment = require('../../payments/models/Payment');
const Product = require('../../products/models/Product');
const Carts = require('../../carts/data-access/Carts');


function Orders() {

  this.getOrderById = async function (orderId) {
    let order = await Order.findOne({ _id: orderId, deleted: false }).populate("client", "-password")
      .populate("shippingAddress")
      .populate("shippingCompany")
      .populate("payments")
      .populate("items")
      .populate({
        path: 'items',
        populate: {
          path: 'vendor',
          model: 'Company'
        }

      })
      .populate({
        path: 'items',
        populate: {
          path: 'product',
          model: 'Product'
        }

      })
      .populate({
        path: 'items',
        populate: {
          path: 'messages',
          populate: {
            path: 'addedBy',
            model: 'User'
          }
        }

      })
      .populate({
        path: 'actions',
        populate: {
          path: 'createdBy',
          model: 'User'
        }
      })
      .populate("status");

    if (order && order.items && order.items.length > 0) {
      order.items = order.items.filter(item => !item.status.deleted || item.status.deleted != true);
    }
    return order;
  }

  this.addOrderItem = async (orderId, productId, qty) => {
    //TODO: add method to re-calculate order total amounts
    let result = { success: false }
    let discount = 0;
    let total = 0;
    let profitPercentage = 0;
    const product = await Product.findOne({ _id: productId }).populate("vendor");
    if (product && product.discountPercentage && product.discountPercentage > 0) {
      discount = product.price.amount * (product.discountPercentage / 100);
    }
    try {
      if (product && product.vendor.profitPercentage && product.vendor.profitPercentage > 0) {
        profitPercentage = (product.price.amount - discount) * (product.vendor.profitPercentage / 100);
      }
    } catch (e) {
      result.success = false;
    }

    let netItemPrice = product.price.amount - discount + profitPercentage;
    total += netItemPrice * qty;
    currencyCode = product.price.currencyCode;
    const newOrderItem = new OrderItem({
      _id: new mongoose.Types.ObjectId(),
      order: orderId,
      vendor: product.vendor._id,
      product: productId,
      qty: qty,
      itemPrice: {
        amount: product.price.amount,
        discount: discount,
        margin: profitPercentage,
        net: Math.ceil(netItemPrice),
        subtotal: Math.ceil(netItemPrice * qty),
        vendorSubtotal: Math.ceil((product.price.amount - discount) * qty),
        currencyCode: product.price.currencyCode

      }
    });
    if (!newOrderItem.status) {
      newOrderItem.status = { deleted: false }
    }
    try {
      let savedOrderItem = await newOrderItem.save();
      result.success = true;
      result.item = savedOrderItem;
      //Updating Order 
      let order = await Order.findOne({ _id: orderId });
      if (!order.items) {
        order.items = [];
      }
      order.items.push(savedOrderItem._id);
      await Order.findByIdAndUpdate(orderId, { items: order.items }, function (err, item) {
        console.log('OrderItem added to Order');
      });
      await this.recalculateTotals(orderId);


    } catch (e) {
      result.success = false;
      console.log('Order Item Error', e);
    }
    return result;
  }


  this.recalculateTotals = async (orderId) => {
    let order = await this.getOrderById(orderId);
    let total = 0;
    let vendorTotal = 0;
    order.items.forEach(item => {
      if (!item.status.deleted == true) {
        total += item.itemPrice.subtotal;
        vendorTotal += item.itemPrice.vendorSubtotal;
      }

    });
    if (!order.totalAmount) {
      order.totalAmount = {};
    }
    order.totalAmount.currencyCode = 'USD';
    order.totalAmount.amount = total.toFixed(3);
    order.totalAmount.vendorAmount = vendorTotal.toFixed(3);
    Order.findByIdAndUpdate(orderId, { totalAmount: order.totalAmount }, function (err, item) {
      console.log('OrderItem added to Order');
    });

  }

  this.creatOrderFromUserCart = async (userId) => {
    let result = {};
    try {
      var cart = await Carts.getCart(userId);

      result.success = true;
    } catch (e) {
      result.errorMessage = e.message;
      result.success = false;
    }
    return result;
  }

  this.getContainerDetails = async (cart) => {
    let result = {};
    //result.products = [];
    let totalVolume = 0;
    let containers = 0;
    result.items = 0;
    try {
      for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let product = await Product.findOne({ _id: item._id });
        if (product && product.packaging && product.packaging.length && product.packaging.width && product.packaging.height) {
          result.items += item.qty;
          totalVolume += (item.qty * product.packaging.length * product.packaging.width * product.packaging.height);
         // result.products.push(product);
        }

      }
      result.success = true;
    } catch (e) {
      result.success = false;
      result.errorMessage = e.message;
    }
    result.totalVolume = totalVolume.toFixed(2);
    //40ft: => 72 CBM
    //20ft: => 32 CBM
    result.containers = parseInt(totalVolume / 32) + (totalVolume % 32 > 0?1:0);
    result.percentge = parseInt(((totalVolume % 32.0)/32.0) * 100);
    

    return result;
  }
}


module.exports = new Orders();  