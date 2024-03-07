import loginReducer from './loginReducer';
import { combineReducers } from 'redux';
import resetPasswordReducer from './resetPasswordReducer';
import transactionDetailsReducer from './transactionDetailsReducer';
import clientDetailsReducer from './clientDetailsReducer';
import clientDetailsErrorReducer from './clientDetailsErrorReducer';
import companyDetailsReducer from './companyDetailsReducer'
import companyDetailsErrorReducer from './companyDetailsErrorReducer'
import commonContactDetailsReducer from './commonContactDetailsReducer'
import clientDataReducer from './clientDataReducer'
import clientContactListReducer from './clientContactListReducer'
import userDetailsReducer from './userDetailsReducer'
import userDetailsErrorReducer from './userDetailsErrorReducer'
import productDetailsReducer from './productDetailsReducer'
import productDetailsErrorReducer from './productDetailsErrorReducer'
import selectedProductsReducer from './selectedProductsReducer'
import farmerDetailsReducer from './farmerDetailsReducer'
import farmerDetailsErrorReducer from './farmerDetailsErrorReducer'
import farmerFamilyDetailsReducer from './farmerFamilyDetailsReducer'
import bankDetailsReducer from './bankDetailsReducer'
import farmerLiveStockCattleDetailsReducer from './farmerLiveStockCattleDetailsReducer'
import farmerMachineryDetailsReducer from './farmerMachineryDetailsReducer'
import farmerIrrigationDetailsReducer from './farmerIrrigationDetailsReducer'
import farmerLandDetailsReducer from './farmerLandDetailsReducer'
import figMasterDetailReducer from './figMasterDetailReducer'
import distributionCentreListReducer from './distributionCentreListReducer'
import farmerDocumentDetailsReducer from './farmerDocumentDetailsReducer'
import formChangedReducer from './formChangedReducer'
import distributionCentreDetailsReducer from './distributionCentreDetailsReducer'
import distributionCentreDetailsErrorReducer from './distributionCentreDetailsErrorReducer'
import commonContactDetailErrorReducer from './commonContactDetailErrorReducer'
import tabInfoReducer from './tabInfoReducer'
import collectionCentreDetailsReducer from './collectionCentreDetailsReducer'
import figDetailsReducer from './figDetailsReducer'
import collectionCentreDetailsErrorReducer from './collectionCentreDetailsErrorReducer'
import productLineDetailsReducer from './productLineDetailsReducer'
import productLineDetailsErrorReducer from './productLineDetailsErrorReducer'
import productCategoryDetailReducer from './productCategoryDetailReducer'
import menuDetailsReducer from './menuDetailsReducer'
import menuDetailsErrorReducer from './menuDetailsErrorReducer'
import treeViewReducer from './treeViewReducer'
import shortcutKeyReducer from './shortcutKeyReducer'
import productMasterDetailsReducer from './productMasterDetailsReducer'
import productVarietyDetailReducer from './productVarietyDetailReducer'
import productMasterDetailsErrorReducer from './productMasterDetailsErrorReducer'
import oemMasterDetailsReducer from './oemMasterDetailsReducer'
import oemMasterDetailsErrorReducer from './oemMasterDetailsErrorReducer'
import oemProductDetailsReducer from './oemProductDetailsReducer'
import vendorMasterDetailsReducer from './vendorMasterDetailsReducer'
import vendorMasterDetailsErrorReducer from './vendorMasterDetailsErrorReducer'
import vendorProductCatalogueDetailsReducer from './vendorProductCatalogueDetailsReducer'
import purchaseOrderDetailsReducer from './purchaseOrderDetailsReducer'
import purchaseOrderProductDetailsReducer from './purchaseOrderProductDetailsReducer'
import purchaseOrderTermDetailsReducer from './purchaseOrderTermDetailsReducer'
import purchaseOrderDetailsErrorReducer from './purchaseOrderDetailsErrorReducer'
import materialReceiptHeaderReducer from './materialReceiptHeaderReducer'
import materialReceiptDetailsReducer from './materialReceiptDetailsReducer'
import vendorMasterDetailsListReducer from './vendorMasterDetailsListReducer'
import materialReceiptErrorReducer from './materialReceiptErrorReducer'
import vendorInvoiceEntryHeaderDetailsReducer from './vendorInvoiceEntryHeaderDetailsReducer'
import vendorInvoiceEntryErrorReducer from './vendorInvoiceEntryErrorReducer'
import vendorInvoiceEntryDetailsReducer from './vendorInvoiceEntryDetailsReducer'
import paymentDetailReducer from './paymentDetailReducer';
import paymentHeaderReducer from './paymentHeaderReducer';
import paymentErrorReducer from './paymentErrorReducer';
import demandHeaderReducer from './demandHeaderReducer';

const rootReducer = combineReducers({
  loginReducer,
  resetPasswordReducer,
  transactionDetailsReducer,
  clientDetailsReducer,
  clientDetailsErrorReducer,
  companyDetailsReducer,
  companyDetailsErrorReducer,
  commonContactDetailsReducer,
  clientDataReducer,
  clientContactListReducer,
  userDetailsReducer,
  userDetailsErrorReducer,
  productDetailsReducer,
  productDetailsErrorReducer,
  selectedProductsReducer,
  farmerDetailsReducer,
  farmerDetailsErrorReducer,
  farmerFamilyDetailsReducer,
  bankDetailsReducer,
  farmerLiveStockCattleDetailsReducer,
  farmerMachineryDetailsReducer,
  farmerIrrigationDetailsReducer,
  farmerLandDetailsReducer,
  figMasterDetailReducer,
  distributionCentreListReducer,
  farmerDocumentDetailsReducer,
  formChangedReducer,
  distributionCentreDetailsReducer,
  distributionCentreDetailsErrorReducer,
  commonContactDetailErrorReducer,
  tabInfoReducer,
  collectionCentreDetailsReducer,
  figDetailsReducer,
  collectionCentreDetailsErrorReducer,
  productLineDetailsReducer,
  productLineDetailsErrorReducer,
  productCategoryDetailReducer,
  menuDetailsReducer,
  menuDetailsErrorReducer,
  treeViewReducer,
  shortcutKeyReducer,
  productMasterDetailsReducer,
  productVarietyDetailReducer,
  productMasterDetailsErrorReducer,
  oemMasterDetailsReducer,
  oemMasterDetailsErrorReducer,
  oemProductDetailsReducer,
  vendorMasterDetailsReducer,
  vendorMasterDetailsErrorReducer,
  vendorProductCatalogueDetailsReducer,
  purchaseOrderDetailsReducer,
  purchaseOrderProductDetailsReducer,
  purchaseOrderTermDetailsReducer,
  purchaseOrderDetailsErrorReducer,
  materialReceiptHeaderReducer,
  materialReceiptDetailsReducer,
  vendorMasterDetailsListReducer,
  materialReceiptErrorReducer,
  vendorInvoiceEntryHeaderDetailsReducer,
  vendorInvoiceEntryErrorReducer,
  vendorInvoiceEntryDetailsReducer,
  paymentDetailReducer,
  paymentHeaderReducer,
  paymentErrorReducer,
  demandHeaderReducer
});

export default rootReducer;