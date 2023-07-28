const initialState = {
    oemMasterDetailsError: {
        oemNameErr: {},
        countryCodeErr: {},
        stateCodeErr: {},
        oemAddressErr: {}
    }
};

const oemMasterDetailsErrorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'OEMMASTERDETAILSERROR':
            if (!action.payload) {
                return initialState
            }
            else {
                return {
                    ...state,
                    oemMasterDetailsError: action.payload
                }
            }
        default:
            return state;
    }
};

export default oemMasterDetailsErrorReducer;