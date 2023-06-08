const initialState = {
  collectionCentreDetails: {}
};

const collectionCentreDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'COLLECTIONCENTREDETAILS':
      if(!action.payload) {
        return initialState
      }
      else{
        return{
          ...state,
          collectionCentreDetails : action.payload
        }
      }
    default:
      return state;
  }
};

export default collectionCentreDetailsReducer;