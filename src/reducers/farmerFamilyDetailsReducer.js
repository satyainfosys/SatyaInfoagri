const initialState = {
    farmerFamilyDetails: []
  };
  
  const farmerFamilyDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FARMERFAMILYDETAILS':
        return{
          ...state,
          farmerFamilyDetails : action.payload
        }
      default:
        return state;
    }
  };
  
  
  
  export default farmerFamilyDetailsReducer;