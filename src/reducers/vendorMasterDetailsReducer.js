const initialState = {
  vendorMasterDetails: {}
};

const vendorMasterDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'VENDORMASTERDETAILS':
      if(!action.payload) {
        return initialState
      }
      else{
        return{
          ...state,
          vendorMasterDetails : action.payload
        }
      }
    default:
      return state;
  }
};

export default vendorMasterDetailsReducer;