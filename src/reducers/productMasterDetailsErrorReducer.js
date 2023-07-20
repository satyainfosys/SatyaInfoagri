const initialState = {
    productMasterDetailsError: {
        productMasterNameErr: {},
        productVarietyNameErr: {}
    }
};

const productMasterDetailsErrorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PRODUCTMASTERDETAILSERROR':
            if (!action.payload) {
                return initialState
            }
            else {
                return {
                    ...state,
                    productMasterDetailsError: action.payload
                }
            }
        default:
            return state;
    }
};

export default productMasterDetailsErrorReducer;