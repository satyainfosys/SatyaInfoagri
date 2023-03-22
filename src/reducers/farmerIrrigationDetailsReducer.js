const initialState = {
  farmerIrrigationDetails: []
};

const farmerIrrigationDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FARMERIRRIGATIONDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          farmerIrrigationDetails: action.payload
        }
      }
    default:
      return state;
  }
};



export default farmerIrrigationDetailsReducer;