const assumptions = require('../modules/assumptions');

function calculateInches(req) {
    return req.palletTotalHeight / 25.4
}

function calculatePalletWeightLbs(req) {
    return (parseFloat(req.grossKg) * 2.2 * req.casesPerPallet + 50).toFixed(2)
}

function casesPerContainer(req) {
    let _40qtyPallets = calculate40QTYUnits(req)
    return _40qtyPallets / Number(req.caseCount)
}

function calculate40QTYUnits(req) {
    return 20 * Number(req.caseCount) * Number(req.casesPerPallet)
}

function calculateContainerWtLbs(req) {
    let casesContainer = casesPerContainer(req)
    return casesContainer * Number(req.grossKg) * 2.2
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
    return (((req._40qtyPallets * req.fobPerPack) + req.oFreightCost + req.truckingBarcelona) * req.duties)
    
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
                //inches
                sql.inches = calculateInches(sql)

                //est. pallet weight lbs
                sql.palletWeight = calculatePalletWeightLbs(sql)
                
                //cases per container
                sql.casesPerContainer = casesPerContainer(sql)
                
                //40' FCL QTY Units PALLET loaded **
                sql._40qtyPallets = calculate40QTYUnits(sql)              
                
                //container wt. lbs
                sql.containerLbs = calculateContainerWtLbs(sql)              

                //est. trucking to Barcelona
                sql.truckingBarcelona = calculateTrackingBarcelona(sql)

                //Ocean Freight Cost
                sql.oFreightCost = calculateFreightCost(sql)

                //Duties to be paid
                sql.dutiesToBePaid = calculateDutiesPaid(sql)




                sql.fobPerPack = calculateFOBPerPack(sql)
                sql.duties = calculateDuties(sql)
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