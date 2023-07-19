const initialState = {
  productVarietyDetails: []
};

const productVarietyDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PRODUCTVARIETYDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          productVarietyDetails: action.payload
        }
      }
    default:
      return state;
  }
};

export default productVarietyDetailReducer;