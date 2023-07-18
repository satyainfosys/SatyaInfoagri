const initialState = {
  productMasterDetails: {}
};

const productMasterDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PRODUCTMASTERDETAILS':
      if(!action.payload) {
        return initialState
      }
      else{
        return{
          ...state,
          productMasterDetails : action.payload
        }
      }
    default:
      return state;
  }
};

export default productMasterDetailsReducer;