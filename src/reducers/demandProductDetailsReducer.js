const initialState = {
    demandProductDetails: {}
  };
  
  const demandProductDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'DEMANDPRODUCTDETAILS':
        if(!action.payload) {
          return initialState
        }
        else{
          return{
            ...state,
            demandProductDetails : action.payload
          }
        }
      default:
        return state;
    }
  };
  
  export default demandProductDetailsReducer;