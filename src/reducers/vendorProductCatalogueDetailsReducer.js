const initialState = {
  vendorProductCatalogueDetails: []
};

const vendorProductCatalogueDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'VENDORPRODUCTCATALOGUEDETAILS':
      if(!action.payload)
      {
        return initialState
      }
      else if(Array.isArray(action.payload))
      {
        return{
          ...state,
          vendorProductCatalogueDetails : action.payload
        }
      }
      else{
        return{
          ...state,
          vendorProductCatalogueDetails : [...state.transactionDetails, action.payload]
        }
      }
    default:
      return state;
  }
};

export default vendorProductCatalogueDetailsReducer;