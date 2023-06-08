const initialState = {
  figDetails: []
};

const figDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FIGDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          figDetails: action.payload
        }
      }
    default:
      return state;
  }
};



export default figDetailsReducer;