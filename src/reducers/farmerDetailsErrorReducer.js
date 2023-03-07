const initialState = {
  farmerDetailsError: {
    firstNameErr: {},
    lastNameErr: {},
    addressErr: {},    
  }
};

const farmerDetailsErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FARMERDETAILSERROR':
      if(!action.payload)
      {
        return initialState
      }
      else{
        return{
          ...state,
          farmerDetailsError : action.payload        
        }
      }
    default:
      return state;
  }
};

export default farmerDetailsErrorReducer;