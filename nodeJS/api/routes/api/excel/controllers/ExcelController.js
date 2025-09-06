const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');
const XLSX = require("xlsx");



router.get('/import-excel', verifyToken, async (req, res) => {

    let filePath = process.env.UPLOAD_ROOT + "invoice.xlsx";
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    let invoiceTypeCellAddress = "C3";
    let invoiceTypeCell = sheet[invoiceTypeCellAddress];
    let invoiceType = invoiceTypeCell?.v;
    console.log(`invoiceType: ${invoiceType}`);

    let invoiceDateCellAddress = "D3";
    let invoiceDateCell = sheet[invoiceDateCellAddress];
    let invoiceDate = invoiceDateCell?.v;
    console.log(`invoiceDate: ${invoiceDate}`);

    let currencyCellAddress = "E3";
    let currencyCell = sheet[currencyCellAddress];
    let currency = currencyCell?.v;
    console.log(`currency: ${currency}`);

    let clientNameCellAddress = "F3";
    let clientNameCell = sheet[clientNameCellAddress];
    let clientName = clientNameCell?.v;
    console.log(`clientName: ${clientName}`);


    let idTypeCellAddress = "G3";
    let idTypeCell = sheet[idTypeCellAddress];
    let idType = idTypeCell?.v;
    console.log(`idType: ${idType}`);

    let idValueCellAddress = "H3";
    let idValueCell = sheet[idValueCellAddress];
    let idValue = idValueCell?.v;
    console.log(`idValue: ${idValue}`);

    let phoneNumberCellAddress = "I3";
    let phoneNumberCell = sheet[phoneNumberCellAddress];
    let phoneNumber = phoneNumberCell?.v;
    console.log(`phoneNumber: ${phoneNumber}`);




    // // 2. Detect filled cells (non-empty)
    // console.log("\nFilled cells:");
    // for (const address in sheet) {
    //     // skip metadata keys like '!ref' and '!margins'
    //     if (address[0] === "!") continue;
    //     const value = sheet[address].v;
    //     if (value !== undefined && value !== null && value !== "") {
    //         console.log(address, "=", value);
    //     }
    // }

    // 3. Detect the filled cell range
    const range = XLSX.utils.decode_range(sheet["!ref"]);
    // console.log("\nSheet range:", sheet["!ref"]);
    // console.log("Decoded range:", range);

    // // Loop through the range and check non-empty cells
    // console.log("\nNon-empty cells in range:");
    // for (let R = range.s.r; R <= range.e.r; ++R) {
    //     for (let C = range.s.c; C <= range.e.c; ++C) {
    //         const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
    //         console.log("cell Address:", cellAddress);
    //         const cell = sheet[cellAddress];
    //         if (cell && cell.v !== undefined && cell.v !== null && cell.v !== "") {
    //             console.log(cellAddress, "=", cell.v);
    //         }
    //     }
    // }


    // Columns J (9) → O (14)
    const startCol = 9;   // J
    const endCol = 14;    // O
    let items = [];

    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const jCellAddress = XLSX.utils.encode_cell({ r: R, c: startCol });
        const jCell = sheet[jCellAddress];

        // Skip rows where J is empty
        if (!jCell || jCell.v === undefined || jCell.v === null || jCell.v === "") {
            continue;
        }

        // Collect values from J → O
        let rowData = {};
        let item = {};
        for (let C = startCol; C <= endCol; ++C) {

            const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
            const cell = sheet[cellAddress];
            rowData[cellAddress] = cell ? cell.v : null;
            if (C == 9) {
                item.description = cell ? cell.v : null;
            } else if (C == 10) {
                item.quantity = cell ? cell.v : null;
            } else if (C == 11) {
                item.unitPrice = cell ? cell.v : null;
            } else if (C == 12) {
                item.discount = cell ? cell.v : null;
            } else if (C == 13) {
                item.total = cell ? cell.v : null;
            } else if (C == 14) {
                item.notes = cell ? cell.v : null;

            }

        }
        items.push(item);
         console.log(`Row ${R + 1}:`, item);
        item = {};

       
    }



    res.json({ success: true });

});


module.exports = router;