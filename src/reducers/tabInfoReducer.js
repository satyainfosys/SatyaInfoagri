const initialState = {
  tabInfo: {}
};

const tabInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TABINFO':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          tabInfo: action.payload
        }
      }
    default:
      return state;
  }
};

export default tabInfoReducer;