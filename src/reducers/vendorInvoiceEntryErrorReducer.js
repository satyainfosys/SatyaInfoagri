const initialState = {
    vendorInvoiceEntryError: {
        vendorErr: {},
        invoiceNoErr: {},
        invoiceAmountErr: {},
        invoiceDateErr: {},
        invoiceDueDateErr: {},
        vendorInvoiceEntryDetailErr: {},
    }
};

const vendorInvoiceEntryErrorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'VENDORINVOICEENTRYERROR':
            if (!action.payload) {
                return initialState
            }
            else {
                return {
                    ...state,
                    vendorInvoiceEntryError: action.payload
                }
            }
        default:
            return state;
    }
};

export default vendorInvoiceEntryErrorReducer;