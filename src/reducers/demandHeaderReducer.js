const initialState = {
	demandHeaderDetail: {}
};

const demandHeaderReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'DEMANDHEADER':
			if (!action.payload) {
				return initialState
			}
			else {
				return {
					...state,
					demandHeaderDetail: action.payload
				}
			}
		default:
			return state;
	}
};

export default demandHeaderReducer;