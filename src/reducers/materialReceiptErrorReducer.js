const initialState = {
    materialReceiptError: {
        vendorErr: {}
    }
};

const materialReceiptErrorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'MATERIALRECEIPTERROR':
            if (!action.payload) {
                return initialState
            }
            else {
                return {
                    ...state,
                    materialReceiptError: action.payload
                }
            }
        default:
            return state;
    }
};

export default materialReceiptErrorReducer;