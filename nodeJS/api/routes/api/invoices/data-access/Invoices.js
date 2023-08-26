const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Invoice = require('../models/Invoice');
const Receipt = require('../../receipt/models/Receipt');
const InvoiceStatus = require('../models/InvoiceStatus');
const { query } = require('express');




function Invoices() {


  

  this.getInvoiceById = async function (invoiceId) {
    let invoice = await Invoice.findOne({ _id: invoiceId, deleted: false })
    .populate("user", "-password")
    .populate("contact")
    .populate("contract")
    .populate("package") 
    .populate("insurance") 

    //console.log("invoice:")
    //console.log(invoice) 
    return invoice;
  }

  this.getSubscriptionInvoices = async function (subscriptionId) {
    let invoices = await Invoice.find({ subscription: subscriptionId, deleted: false }).populate("user", "-password")
      .populate("items")
      .populate({
        path: 'items'

      })
      .populate("status");
    return invoices;
  }

  this.addInvoiceItem = async (InvoiceId, productId, qty) => {
    //TODO: add method to re-calculate Invoice total amounts
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
    const newInvoiceItem = new InvoiceItem({
      _id: new mongoose.Types.ObjectId(),
      Invoice: InvoiceId,
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
    if (!newInvoiceItem.status) {
      newInvoiceItem.status = { deleted: false }
    }
    try {
      let savedInvoiceItem = await newInvoiceItem.save();
      result.success = true;
      result.item = savedInvoiceItem;
      //Updating Invoice 
      let Invoice = await Invoice.findOne({ _id: InvoiceId });
      if (!Invoice.items) {
        Invoice.items = [];
      }
      Invoice.items.push(savedInvoiceItem._id);
      await Invoice.findByIdAndUpdate(InvoiceId, { items: Invoice.items }, function (err, item) {
        console.log('InvoiceItem added to Invoice');
      });
      await this.recalculateTotals(InvoiceId);


    } catch (e) {
      result.success = false;
      console.log('Invoice Item Error', e);
    }
    return result;
  }


  this.recalculateTotals = async (InvoiceId) => {
    let Invoice = await this.getInvoiceById(InvoiceId);
    let total = 0;
    let vendorTotal = 0;
    Invoice.items.forEach(item => {
      if (!item.status.deleted == true) {
        total += item.itemPrice.subtotal;
        vendorTotal += item.itemPrice.vendorSubtotal;
      }

    });
    if (!Invoice.totalAmount) {
      Invoice.totalAmount = {};
    }
    Invoice.totalAmount.currencyCode = 'USD';
    Invoice.totalAmount.amount = total.toFixed(3);
    Invoice.totalAmount.vendorAmount = vendorTotal.toFixed(3);
    Invoice.findByIdAndUpdate(InvoiceId, { totalAmount: Invoice.totalAmount }, function (err, item) {
      console.log('InvoiceItem added to Invoice');
    });

  }

  this.creatInvoiceFromUserCart = async (userId) => {
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


module.exports = new Invoices();  