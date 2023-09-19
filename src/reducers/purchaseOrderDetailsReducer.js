const initialState = {
  purchaseOrderDetails: {}
};

const purchaseOrderDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PURCHASEORDERDETAILS':
      if(!action.payload) {
        return initialState
      }
      else{
        return{
          ...state,
          purchaseOrderDetails : action.payload
        }
      }
    default:
      return state;
  }
};

export default purchaseOrderDetailsReducer;