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
  productCategoryDetailReducer
});

export default rootReducer;