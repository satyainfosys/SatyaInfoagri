const initialState = {
  productCategoryDetails: []
};

const productCategoryDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PRODUCTCATEGORYDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          productCategoryDetails: action.payload
        }
      }
    default:
      return state;
  }
};



export default productCategoryDetailReducer;