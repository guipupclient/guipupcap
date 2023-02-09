const assumptions = require('../modules/assumptions');

function calculateInches(req) {
    return req.palletTotalHeight / 2.5
}

function calculatePalletWeightLbs(req) {
    return (parseFloat(req.grossKg) * 2.2 * req.casesPerPallet + 50).toFixed(2)
}

function casesPerContainer(req) {
    let _40qtyPallets = this.calculate40QTYUnits(req)
    return _40qtyPallets / req.caseCount
}

function calculate40QTYUnits(req) {
    return 20 * req.caseCount * req.casesPerPallet
}

function calculateContainerWtLbs(req) {
    let casesPerContainer = this.casesPerContainer(req)
    return casesPerContainer * req.grossKg * 2.2
}

function calculateFOBPerPack(req) {
    return 0.95
}

function calculateTrackingBarcelona(req) {
    return 800
}

function calculateFreightCost(req) {
    return 8800
}

function calculateDuties(req) {
    return 0
}

function calculateDutiesPaid(req) {
    //return (((req._40qtyPallets * sql.fobPerPack) + sql.oFreightCost + sql.truckingBarcelona) * sql.duties)
    return 0
}

function calculateCustomsBroker(req) {
    return 410
}

function calculateFreightCost(req) {
    return (800 + 8800 + 0 + 410) / 300
}

module.exports = {
    async calculate(sql) {
        return new Promise(async (resolve, reject) => {
            try {

                sql.inches = calculateInches(sql)
                sql.palletWeight = calculatePalletWeightLbs(sql)
                sql._40qtyPallets = calculate40QTYUnits(sql)
                sql.truckingBarcelona = calculateTrackingBarcelona(sql)
                sql.fobPerPack = calculateFOBPerPack(sql)
                sql.oFreightCost = calculateFreightCost(sql)
                sql.duties = calculateDuties(sql)
                sql.dutiesToBePaid = calculateDutiesPaid(sql)
                sql.customsBroker = calculateCustomsBroker(sql)
                sql.oFreightCostUnit = calculateFreightCost(sql)


                resolve(sql);
            }

            catch (ex) {
                reject("We messed up! " + ex);
            }
        });
    }
};