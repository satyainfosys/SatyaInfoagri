const initialState = {
  farmerDetailsError: {
    firstNameErr: {},
    lastNameErr: {},
    addressErr: {},
    farmerDobErr: {},
    farmerGenderErr: {},
    farmerFatherNameErr: {},
    maritalStatusErr: {},
    socailCategoryErr: {},
    countyrErr: {},
    stateErr: {},
    districtErr: {},
    tehsilErr: {},
    blockErr: {},
    postOfficeErr: {},
    villageErr: {},
    ditributionErr: {},
    collectionErr: {},
    contactErr: {},
    familyErr: {},
    cardDetailErr: {},
    // bankDetailErr: {},
    // irrigationDetailErr: {},
    // landDetailErr: {}
  }
};

const farmerDetailsErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FARMERDETAILSERROR':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          farmerDetailsError: action.payload
        }
      }
    default:
      return state;
  }
};

export default farmerDetailsErrorReducer;