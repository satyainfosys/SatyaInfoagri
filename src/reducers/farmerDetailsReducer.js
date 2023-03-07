const initialState = {
  farmerDetails: {}
};

const farmerDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FARMERDETAILS':
      if(!action.payload) {
        return initialState
      }
      else{
        return{
          ...state,
          farmerDetails : action.payload
        }
      }
    default:
      return state;
  }
};

export default farmerDetailsReducer;