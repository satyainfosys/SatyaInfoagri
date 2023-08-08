const initialState = {
  oemProductDetails: []
};

const oemProductDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'OEMPRODUCTDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          oemProductDetails: action.payload
        }
      }
    default:
      return state;
  }
};



export default oemProductDetailsReducer;