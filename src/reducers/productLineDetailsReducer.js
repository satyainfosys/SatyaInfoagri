const initialState = {
  productLineDetails: {}
};

const productLineDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PRODUCTLINEDETAILS':
      if(!action.payload) {
        return initialState
      }
      else{
        return{
          ...state,
          productLineDetails : action.payload
        }
      }
    default:
      return state;
  }
};

export default productLineDetailsReducer;