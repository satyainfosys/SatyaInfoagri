const initialState = {
  menuDetailsError: {
    menuNameErr: {}
  }
};

const menuDetailsErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MENUDETAILSERROR':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          menuDetailsError: action.payload
        }
      }
    default:
      return state;
  }
};

export default menuDetailsErrorReducer;