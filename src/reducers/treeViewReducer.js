const initialState = {
  treeViewDetails: []
};

const treeViewReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TREEVIEWDETAILS':
      if(!action.payload) {
        return initialState
      }
      else{
        return{
          ...state,
          treeViewDetails : action.payload
        }
      }
    default:
      return state;
  }
};

export default treeViewReducer;