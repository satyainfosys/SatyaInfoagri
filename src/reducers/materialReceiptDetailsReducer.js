const initialState = {
  materialReceiptDetails: []
};

const materialReceiptDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MATERIALRECEIPTDETAILS':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          materialReceiptDetails: action.payload
        }
      }
    default:
      return state;
  }
};

export default materialReceiptDetailsReducer;