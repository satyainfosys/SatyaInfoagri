const initialState = {
  bankDetails: []
};

const bankDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'BANKDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          bankDetails: action.payload
        }
      }
    default:
      return state;
  }
};



export default bankDetailsReducer;