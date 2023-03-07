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
  farmerDetailsErrorReducer
});

export default rootReducer;