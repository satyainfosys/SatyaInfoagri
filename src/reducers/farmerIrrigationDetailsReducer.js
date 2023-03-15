const initialState = {
    farmerIrrigationDetails: []
  };
  
  const farmerIrrigationDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FARMERIRRIGATIONDETAILS':
        return{
          ...state,
          farmerIrrigationDetails : action.payload
        }
      default:
        return state;
    }
  };
  
  
  
  export default farmerIrrigationDetailsReducer;