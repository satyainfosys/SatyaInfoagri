const initialState = {
  distributionCentreDetails: {}
};

const distributionCentreDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DISTRIBUTIONCENTREDETAILS':
      if(!action.payload) {
        return initialState
      }
      else{
        return{
          ...state,
          distributionCentreDetails : action.payload
        }
      }
    default:
      return state;
  }
};

export default distributionCentreDetailsReducer;