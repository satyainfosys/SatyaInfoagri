const initialState = {
    vendorInvoiceEntryHeaderDetails: {}
  };
  
  const vendorInvoiceEntryHeaderDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'VENDORINVOICEENTRYHEADERDETAILS':
        if (!action.payload) {
          return initialState
        }
        else {
          return {
            ...state,
            vendorInvoiceEntryHeaderDetails: action.payload
          }
        }
      default:
        return state;
    }
  };
  
  export default vendorInvoiceEntryHeaderDetailsReducer;