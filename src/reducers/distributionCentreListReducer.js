const initialState = {
    distributionCentreList: []
};

const distributionCentreListReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DISTRIBUTIONCENTRELIST':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          distributionCentreList: action.payload
        }
      }
    default:
      return state;
  }
};



export default distributionCentreListReducer;