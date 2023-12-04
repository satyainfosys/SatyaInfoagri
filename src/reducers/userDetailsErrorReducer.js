const initialState = {
  userDetailsError: {
    clientErr: {},    
    loginUserNameErr: {},
    loginNameErr: {}
  }
};

const userDetailsErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USERDETAILSERROR':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          userDetailsError: action.payload
        }
      }
    default:
      return state;
  }
};

export default userDetailsErrorReducer;