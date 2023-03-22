const initialState = {
  farmerMachineryDetails: []
};

const farmerMachineryDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FARMERMACHINERYDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          farmerMachineryDetails: action.payload
        }
      }

    default:
      return state;
  }
};



export default farmerMachineryDetailsReducer;