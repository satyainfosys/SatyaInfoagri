const initialState = {
    purchaseOrderDetailsError: {
        vendorErr: {},
        poDateErr: {},
        poAmountErr: {},
        poProductDetailsErr: {}
    }
};

const purchaseOrderDetailsErrorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PURCHASEORDERDETAILSERROR':
            if (!action.payload) {
                return initialState
            }
            else {
                return {
                    ...state,
                    purchaseOrderDetailsError: action.payload
                }
            }
        default:
            return state;
    }
};

export default purchaseOrderDetailsErrorReducer;