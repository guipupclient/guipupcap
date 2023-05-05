//ASSUMPTIONS

const transportationPort = 1500;
const customs_broker = 200;
const transportation_from_port_to_warehouse = 505;
const pallet_unload_receive = 6;
const apply_labels = 0.6;
const inbound_handling_pallet_put_away = 14;
const pallets_per_container_40_HC = 42;
const months_for_storage = 3;
const storage_per_pallet = 15;
const picking_per_pallet = 5;
const pallet_slipSheet_stretchWrap_per_pallet = 0;
const special_pack_slip_prep = 0;
const outbound_order_processing_BOL = 9.57;
const freight_cord = 0;
const min_pallets_per_outbound_order = 2;
const annual_retailer_fee = 0;
const lumper_unload_charge = 85;
const trucking_cost = 468.94;

module.exports = {
  transportationPort,
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
  trucking_cost
};
