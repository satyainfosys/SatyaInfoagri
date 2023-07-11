const initialState = {
  menuDetails: {}
};

const menuDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MENUDETAILS':
      if(!action.payload) {
        return initialState
      }
      else{
        return{
          ...state,
          menuDetails : action.payload
        }
      }
    default:
      return state;
  }
};

export default menuDetailsReducer;