const initialState = {
  formChanged: {}
};

const formChangedReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FORMCHANGED':
      if(!action.payload) {
        return initialState
      }
      else{
        return{
          ...state,
          formChanged : action.payload
        }
      }
    default:
      return state;
  }
};

export default formChangedReducer;