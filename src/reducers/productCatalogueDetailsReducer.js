const initialState = {
  productCatalogueDetails: []
};

const productCatalogueDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PRODUCTCATALOGUEDETAILS':
      if (!action.payload) {
        return initialState;
      } else if (Array.isArray(action.payload)) {
        return {
          ...state,
          productCatalogueDetails: action.payload
        };
      } else {
        return {
          ...state,
          productCatalogueDetails: [...state.transactionDetails, action.payload]
        };
      }
    default:
      return state;
  }
};

export default productCatalogueDetailsReducer;