const initialState = {
  farmerCardDetails: []
};

const farmerCardDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FARMERCARDDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          farmerCardDetails: action.payload
        }
      }
    default:
      return state;
  }
};



export default farmerCardDetailsReducer;