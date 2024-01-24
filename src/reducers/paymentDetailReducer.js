const initialState = {
  paymentDetails: []
};

const paymentDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PAYMENTDETAIL':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          paymentDetails: action.payload
        }
      }
    default:
      return state;
  }
};

export default paymentDetailReducer;