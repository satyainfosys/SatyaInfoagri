const initialState = {
    demandHeaderDetailsError: {
        moduleNameErr: {},
    }
};

const demandHeaderDetailsErrorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'DEMANDHEADERDETAILSERROR':
            if (!action.payload) {
                return initialState
            }
            else {
                return {
                    ...state,
                    demandHeaderDetailsError: action.payload
                }
            }
        default:
            return state;
    }
};

export default demandHeaderDetailsErrorReducer;