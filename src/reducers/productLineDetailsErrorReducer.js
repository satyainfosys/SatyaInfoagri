const initialState = {
    productLineDetailsError: {
        productNameErr: {},
        productCategoryNameErr: {}
    }
};

const productLineDetailsErrorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PRODUCTLINEDETAILSERROR':
            if (!action.payload) {
                return initialState
            }
            else {
                return {
                    ...state,
                    productLineDetailsError: action.payload
                }
            }
        default:
            return state;
    }
};

export default productLineDetailsErrorReducer;