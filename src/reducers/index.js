import loginReducer from './loginReducer';
import { combineReducers } from 'redux';
import resetPasswordReducer from './resetPasswordReducer';
import clientContactDetailsReducer from './clientContactDetailsReducer';
import updateClientContactDetailReducer from './updateClientContactDetailReducer';
import transactionDetailsReducer from './transactionDetailsReducer';
import clientDetailsReducer from './clientDetailsReducer';
import clientDetailsErrorReducer from './clientDetailsErrorReducer';
import contactDetailChangedReducer from './contactDetailChangedReducer'
import transactionDetailChangedReducer from './transactionDetailChangedReducer'
import companyDetailsReducer from './companyDetailsReducer'
import commonContactDetailsListReducer from './commonContactDetailsListReducer'
import companyDetailsErrorReducer from './companyDetailsErrorReducer'
import commonContactDetailsReducer from './commonContactDetailsReducer'
import commonContactDetailChangedReducer from './commonContactDetailChangedReducer'
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
import bankDetailsListReducer from './bankDetailsListReducer'
import farmerCardDetailsReducer from './farmerCardDetailsReducer'
import farmerLiveStockCattleDetailsReducer from './farmerLiveStockCattleDetailsReducer'
import farmerMachineryDetailsReducer from './farmerMachineryDetailsReducer'
import farmerIrrigationDetailsReducer from './farmerIrrigationDetailsReducer'
import farmerLandDetailsReducer from './farmerLandDetailsReducer'
import figMasterDetailReducer from './figMasterDetailReducer'
import distributionCentreListReducer from './distributionCentreListReducer'
import farmerDocumentDetailsReducer from './farmerDocumentDetailsReducer'
import formChangedReducer from './formChangedReducer'

const rootReducer = combineReducers({
  loginReducer,
  resetPasswordReducer,
  clientContactDetailsReducer,
  updateClientContactDetailReducer,
  transactionDetailsReducer,
  clientDetailsReducer,
  clientDetailsErrorReducer,
  contactDetailChangedReducer,
  transactionDetailChangedReducer,
  companyDetailsReducer,
  commonContactDetailsListReducer,
  companyDetailsErrorReducer,
  commonContactDetailsReducer,
  commonContactDetailChangedReducer,
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
  bankDetailsListReducer,
  farmerCardDetailsReducer,
  farmerLiveStockCattleDetailsReducer,
  farmerMachineryDetailsReducer,
  farmerIrrigationDetailsReducer,
  farmerLandDetailsReducer,
  figMasterDetailReducer,
  distributionCentreListReducer,
  farmerDocumentDetailsReducer,
  formChangedReducer
});

export default rootReducer;