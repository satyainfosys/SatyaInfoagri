const initialState = {
  distributionCentreDetailsError: {
    distributionNameErr: {},
    countryErr: {},
    stateErr: {},
    contactErr: {}
  }
};

const distributionCentreDetailsErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DISTRIBUTIONCENTREDETAILSERROR':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          distributionCentreDetailsError: action.payload
        }
      }
    default:
      return state;
  }
};

export default distributionCentreDetailsErrorReducer;