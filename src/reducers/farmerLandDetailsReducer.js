const initialState = {
  farmerLandDetails: []
};

const farmerLandDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FARMERLANDDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          farmerLandDetails: action.payload
        }
      }

    default:
      return state;
  }
};



export default farmerLandDetailsReducer;