const initialState = {
    farmerCardDetails: []
  };
  
  const farmerCardDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FARMERCARDDETAILS':
        return{
          ...state,
          farmerCardDetails : action.payload
        }
      default:
        return state;
    }
  };
  
  
  
  export default farmerCardDetailsReducer;