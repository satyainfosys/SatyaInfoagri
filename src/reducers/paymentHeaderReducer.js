const initialState = {
	paymentHeaderDetail: {}
};

const paymentHeaderReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'PAYMENTHEADER':
			if (!action.payload) {
				return initialState
			}
			else {
				return {
					...state,
					paymentHeaderDetail: action.payload
				}
			}
		default:
			return state;
	}
};

export default paymentHeaderReducer;