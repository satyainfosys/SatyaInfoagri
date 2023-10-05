const initialState = {
  materialReceiptHeaderDetails: {}
};

const materialReceiptHeaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MATERIALRECEIPTHEADERDETAILS':
      if(!action.payload) {
        return initialState
      }
      else{
        return{
          ...state,
          materialReceiptHeaderDetails : action.payload
        }
      }
    default:
      return state;
  }
};

export default materialReceiptHeaderReducer;