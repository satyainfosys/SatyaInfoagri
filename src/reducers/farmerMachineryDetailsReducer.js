const initialState = {
    farmerMachineryDetails: []
  };
  
  const farmerMachineryDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FARMERMACHINERYDETAILS':
        return{
          ...state,
          farmerMachineryDetails : action.payload
        }
      default:
        return state;
    }
  };
  
  
  
  export default farmerMachineryDetailsReducer;