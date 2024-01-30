const initialState = {
    paymentError: {
        paidAmountErr: {},
    }
};

const paymentErrorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'PAYMENTERROR':
            if (!action.payload) {
                return initialState
            }
            else {
                return {
                    ...state,
                    paymentError: action.payload
                }
            }
        default:
            return state;
    }
};

export default paymentErrorReducer;