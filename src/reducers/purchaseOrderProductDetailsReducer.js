const initialState = {
  purchaseOrderProductDetails: []
};

const purchaseOrderProductDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PURCHASEORDERPRODUCTDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          purchaseOrderProductDetails: action.payload
        }
      }
    default:
      return state;
  }
};

export default purchaseOrderProductDetailsReducer;