const initialState = {
  farmerFamilyDetailsList: []
};

const farmerFamilyDetailsListReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FARMERFAMILYDETAILSLIST':
      if(!action.payload)
      {
        return initialState
      }
      else if(Array.isArray(action.payload))
      {
        return{
          ...state,
          farmerFamilyDetailsList : action.payload
        }
      }
      else{
        return{
          ...state,
          farmerFamilyDetailsList : [...state.farmerFamilyDetailsList, action.payload]
        }
      }
    default:
      return state;
  }
};

export default farmerFamilyDetailsListReducer;