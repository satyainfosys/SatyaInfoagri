const initialState = {
    vendorInvoiceEntryDetails: []
  };
  
  const vendorInvoiceEntryDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'VENDORINVOICEENTRYDETAILS':
        if (!action.payload) {
          return initialState
        }
        else {
          return {
            ...state,
            vendorInvoiceEntryDetails: action.payload
          }
        }
      default:
        return state;
    }
  };
  
  export default vendorInvoiceEntryDetailsReducer;