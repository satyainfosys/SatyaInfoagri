const initialState = {
  farmerDocumentDetails: []
};

const farmerDocumentDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FARMERDOCUMENTDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          farmerDocumentDetails: action.payload
        }
      }
    default:
      return state;
  }
};



export default farmerDocumentDetailsReducer;