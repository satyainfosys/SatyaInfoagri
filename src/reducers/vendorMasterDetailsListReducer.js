const initialState = {
  vendorMasterListDetails: []
};

const vendorMasterDetailsListReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'VENDORMASTERLISTDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          vendorMasterListDetails: action.payload
        }
      }
    default:
      return state;
  }
};

export default vendorMasterDetailsListReducer;