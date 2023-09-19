const initialState = {
  purchaseOrderTermDetails: []
};

const purchaseOrderTermDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PURCHASEORDERTERMDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          purchaseOrderTermDetails: action.payload
        }
      }
    default:
      return state;
  }
};

export default purchaseOrderTermDetailsReducer;