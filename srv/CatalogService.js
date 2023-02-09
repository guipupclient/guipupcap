const cds = require("@sap/cds");
//importar módulo "calculate"
const requestModule = require('./modules/formulas');
/* const req = {
    cohitech: "00963",
    tariffCode: "9619.00.15",
    moq: 130621,
    origin: "Spain",
    caseCount: 6,
    casesPerPallet: 364,
    grossKg: 1, 16
} */

//const dotenv = require('dotenv')
//dotenv.config()

async function createProduct(req) {
    return req.data;
}

async function getProduct(req) {
    const oTest = {
        cohitech: "00963",
        tariffCode: "9619.00.15",
        moq: 130621,
        origin: "Spain",
        caseCount: 6,
        casesPerPallet: 364,
        grossKg: 16
    }
    console.log(req.data)
    return requestModule.calculate(req.data);
}

async function updateProduct(req) {
    return req.data;
}

async function deleteProduct(req) {
    return req;
}

async function getCalculos(req) {
    const id = req.data.id
    const response = await requestModule.getRequests(id)
    return response;
}

module.exports = cds.service.impl(function () {
    const { product } = this.entities;
    this.on("INSERT", product, getProduct);
    this.on("READ", product, getProduct);
    this.on("UPDATE", product, updateProduct);
    this.on("DELETE", product, deleteProduct);
});