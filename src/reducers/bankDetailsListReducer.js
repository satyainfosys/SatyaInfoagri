const initialState = {
  bankDetailsList: []
};

const bankDetailsListReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'BANKDETAILSLIST':
      if(!action.payload)
      {
        return initialState
      }
      else if(Array.isArray(action.payload))
      {
        return{
          ...state,
          bankDetailsList : action.payload
        }
      }
      else{
        return{
          ...state,
          bankDetailsList : [...state.bankDetailsList, action.payload]
        }
      }
    default:
      return state;
  }
};

export default bankDetailsListReducer;