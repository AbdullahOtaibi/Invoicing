db.getCollection('Contacts').updateMany(
    { contactTotalReceipt: { $exists: false } },
    { $set: { contactTotalReceipt: 0 } }
);


db.getCollection('Contacts').updateMany(
    { contactTotalInvoiced: { $exists: false } },
    { $set: { contactTotalInvoiced: 0 } }
);

db.getCollection('Contacts').updateMany(
    { contactTotalBalance: { $exists: false } },
    { $set: { contactTotalBalance: 0 } }
);