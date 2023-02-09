using {
  cuid,
  managed
} from '@sap/cds/common';

namespace guipup;

entity product : managed {
  cohitech            : String; //p
  tariffCode          : String; //p
  moq                 : String; //p
  origin              : String; //p
  caseCount           : Integer; //p
  casesPerPallet      : Integer; //p
  grossKg             : String; //p
  palletTotalHeight   : String; //p
  inches              : String;
  palletWeight        : Integer;
  casesPerContainer   : String;
  _40qtyPallets       : String;
  containerLbs        : String;
  fobPerPack          : String;
  truckingBarcelona   : String;
  oFreightCost        : String;
  duties              : String;
  dutiesToBePaid      : String;
  customsBroker       : String;
  oFreightCostUnit    : String;
  palletsPerCont      : String;
  containersPerYear   : String;
  monthsForStorage    : Integer;
  contTransportNY     : String;
  palletUnloadRec     : String;
  fixedWarehPerCont   : String;
  palletSlipSheet     : String;
  wrapPerPallet       : String;
  pickingNC           : String;
  storagePerPalletNC  : String;
  packSlipPerOrder    : String;
  orderProcessing     : String;
  totalWarehouse      : String;
  totalLandedCost     : String;
  buffer              : String;
  HRSGlobalComm       : String;
  priceToRetailer     : String;
  notes               : String;
  totalCasesinXPallet : String;
  avgCHR135Pallet     : String;
  lumperUnloadCharge  : String;
  total               : String;
  paymentTerms        : String;
  dlvyCostPerUnit     : String;
  totalDelivCost      : String;
  factorExworks       : String;
}
