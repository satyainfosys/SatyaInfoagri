const initialState = {
  figMaster: []
};

const figMasterDetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FIGMASTERLIST':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          figMaster: action.payload
        }
      }
    default:
      return state;
  }
};



export default figMasterDetailReducer;