const {
  customs_broker,
  transportation_from_port_to_warehouse,
  pallet_unload_receive,
  apply_labels,
  inbound_handling_pallet_put_away,
  pallets_per_container_40_HC,
  months_for_storage,
  storage_per_pallet,
  picking_per_pallet,
  pallet_slipSheet_stretchWrap_per_pallet,
  special_pack_slip_prep,
  outbound_order_processing_BOL,
  freight_cord,
  min_pallets_per_outbound_order,
  annual_retailer_fee,
  lumper_unload_charge,
} = require("../modules/assumptions");

function calculateInches(req) {
  return req.palletTotalHeight / 25.4;
}

function calculatePalletWeightLbs(req) {
  return (parseFloat(req.grossKg) * 2.2 * req.casesPerPallet + 50).toFixed(2);
}

function casesPerContainer(req) {
  let _40qtyPallets = calculate40QTYUnits(req);
  return _40qtyPallets / Number(req.caseCount);
}

function calculate40QTYUnits(req) {
  return 20 * Number(req.caseCount) * Number(req.casesPerPallet);
}

function calculateContainerWtLbs(req) {
  let casesContainer = casesPerContainer(req);
  return casesContainer * Number(req.grossKg) * 2.2;
}

function calculateFOBPerPack(req) {
  return 0.95;
}

function calculateTrackingBarcelona(req) {
  return 800;
}

function calculateFreightCost(req) {
  return 8800;
}

function calculateDuties(req) {
  return 0;
}

function calculateDutiesPaid(req) {
  return (
    (req._40qtyPallets * req.fobPerPack +
      req.oFreightCost +
      req.truckingBarcelona) *
    req.duties
  );
}

function calculateCustomsBroker(req) {
  return 410;
}

function calculateFreightCost(req) {
  return (800 + 8800 + 0 + 410) / 300;
}

function calculateRRSS(req) {
  const total_unit_price_before_buffer_and_commission =
    calculateRRSSFormulaA(req);

  return (
    total_unit_price_before_buffer_and_commission +
    total_unit_price_before_buffer_and_commission * req.margen_cadena +
    total_unit_price_before_buffer_and_commission * req.marketing
  );
}

function calculateRRSSFormulaD(req, unit_per_40) {
  //Units per 40' FCL = piezas x caja  * caja por pallet * pallet x container del valor ingresado
  return (
    //( Precio flete terrestre al puerto (ingresado pantalla fletes)
    (req.precio_flete_terrestre_puerto +
      //Precio flete marítimo (ingresado pantalla fletes)
      req.precio_flete_maritimo +
      //Customs Broker (de assumptions ) ) /
      customs_broker) /
    //Units per 40' FCL
    unit_per_40
  );
}
function calculateRRSSFormulaE(req, unit_per_40) {
  //Pallets per container (40’HC) ( de assumptions si no se ingresó por pantalla)
  const pallet_por_container = req.pallets_per_container_40_HC
    ? req.pallets_per_container_40_HC
    : pallets_per_container_40_HC;
  return (
    //Transportation From Port to Warehouse (de assumptions )
    (transportation_from_port_to_warehouse +
      //Pallet Unload & Receive( de assumptions) * pallet por container (ingresado por pantalla )
      pallet_unload_receive * req.pallet_por_container +
      //-Pallets per container (ingresado por pantalla ) * Apply Labels ( de assumptions)
      apply_labels * req.pallet_por_container +
      //-Pallets per container (ingresado por pantalla ) *  Inbound handling and Pallet put away ( de assumptions)
      inbound_handling_pallet_put_away * req.pallet_por_container +
      //- Pallets per container (ingresado por pantalla )  *  Apply Labels ( de assumptions)
      apply_labels * req.pallet_por_container +
      //-Pallets per container (40’HC) ( de assumptions si no se ingresó por pantalla) * Months for storage ( de assumptions) * Storage per pallet ( de assumptions)
      pallet_por_container * months_for_storage * storage_per_pallet +
      //-Pallets per container (40’HC) ( de assumptions si no se ingresó por pantalla) *  Picking per Pallet (de assumptions)
      pallet_por_container * picking_per_pallet +
      //- Pallet, Slip Sheet, Stretch Wrap per pallet (de assumptions)
      pallet_slipSheet_stretchWrap_per_pallet +
      //- ( Special Pack Slip Prep (14.65 if required) (de assumptions)  + Outbound Order Processing - BOL  (de assumptions) + Freight Cord (de assumptions) )    * ( Pallets per container / Min. pallets per outbound order (de assumptions) )
      (special_pack_slip_prep + outbound_order_processing_BOL + freight_cord) *
        (req.pallet_por_container / min_pallets_per_outbound_order)) /
    unit_per_40
  );
}

function calculateRRSSFormulaB(req) {
  return (
    //Annual Retailer Fee (sale de assumptions) / Annual Sales Volume (units) – Se va a ingresar por pantalla
    annual_retailer_fee / req.annual_sales_volume +
    //Trucking cost (ingresado en pantalla de fletes) / (cajas x pallet (ingresado pantalla producto) * piezas x caja (ingresado pantalla producto) * Min. pallets per outbound order (de assumptions) )
    req.trucking_cost /
      (req.caja_por_pallet *
        req.piezas_por_caja *
        min_pallets_per_outbound_order) +
    //Lumper/Unload Charge (de assumptions) / (cajas x pallet (ingresado pantalla producto) * piezas x caja (ingresado pantalla producto) *  Min. pallets per outbound order (de assumptions) )
    lumper_unload_charge /
      (req.caja_por_pallet *
        req.piezas_por_caja *
        min_pallets_per_outbound_order)
  );
}

function calculateRRSSFormulaA(req) {
  const unit_per_40 =
    req.piezas_por_caja * req.caja_por_pallet * req.pallet_por_container;

  //Formula D
  const ocean_freight_cost_per_unit = calculateRRSSFormulaD(req, unit_per_40);
  //Formula E
  const total_warehouse_fullFlment_cost_per_unit = calculateRRSSFormulaE(
    req,
    unit_per_40
  );
  //Formula C
  const total_landed_unit_cost =
    Number(req.EXW_per_unit) +
    ocean_freight_cost_per_unit +
    total_warehouse_fullFlment_cost_per_unit;

  //Formula B
  const total_trucking_and_retailer_fees = calculateRRSSFormulaB(req);
  //Formula A
  return total_trucking_and_retailer_fees + total_landed_unit_cost;
}

function calculatePrecioDestino(req) {
  const unit_per_40 =
    req.piezas_por_caja * req.caja_por_pallet * req.pallet_por_container;

  //Formula D
  const ocean_freight_cost_per_unit = calculateRRSSFormulaD(req, unit_per_40);
  //Formula E
  const total_warehouse_fullFlment_cost_per_unit = calculateRRSSFormulaE(
    req,
    unit_per_40
  );

  //Formula C
  return (
    Number(req.EXW_per_unit) +
    ocean_freight_cost_per_unit +
    total_warehouse_fullFlment_cost_per_unit
  );
}

function calculateSupplyChainFactor(req) {
  const precio_destino = calculatePrecioDestino(req);
  return precio_destino / req.EXW_per_unit;
}

module.exports = {
  async calculate(sql) {
    return new Promise(async (resolve, reject) => {
      try {
        //inches
        sql.inches = calculateInches(sql);

        //est. pallet weight lbs
        sql.palletWeight = calculatePalletWeightLbs(sql);

        //cases per container
        sql.casesPerContainer = casesPerContainer(sql);

        //40' FCL QTY Units PALLET loaded **
        sql._40qtyPallets = calculate40QTYUnits(sql);

        //container wt. lbs
        sql.containerLbs = calculateContainerWtLbs(sql);

        //est. trucking to Barcelona
        sql.truckingBarcelona = calculateTrackingBarcelona(sql);

        //Ocean Freight Cost
        sql.oFreightCost = calculateFreightCost(sql);

        //Duties to be paid
        sql.dutiesToBePaid = calculateDutiesPaid(sql);

        sql.fobPerPack = calculateFOBPerPack(sql);
        sql.duties = calculateDuties(sql);
        sql.customsBroker = calculateCustomsBroker(sql);
        sql.oFreightCostUnit = calculateFreightCost(sql);
        sql.rrss = calculateRRSS(sql);
        sql.supplyChainFactor = calculateSupplyChainFactor(sql);
        sql.precioDestino = calculatePrecioDestino(sql);

        resolve(sql);
      } catch (ex) {
        reject("We messed up! " + ex);
      }
    });
  },
};
