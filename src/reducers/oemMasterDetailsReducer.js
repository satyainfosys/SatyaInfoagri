const initialState = {
  oemMasterDetails: {}
};

const oemMasterDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'OEMMASTERDETAILS':
      if(!action.payload) {
        return initialState
      }
      else{
        return{
          ...state,
          oemMasterDetails : action.payload
        }
      }
    default:
      return state;
  }
};

export default oemMasterDetailsReducer;