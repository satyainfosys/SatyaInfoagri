const initialState = {
    shortcutKeyList: []
};

const shortcutKeyReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHORTCUTKEYLIST':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          shortcutKeyList: action.payload
        }
      }
    default:
      return state;
  }
};

export default shortcutKeyReducer;