const initialState = {
    collectionCentreDetailsError: {
        collectionCentreNameErr: {},
        distributionCentreErr: {},
        countryErr: {},
        stateErr: {},
        collectionCentreTypeErr: {},
        figDetailErr: {},
    }
};

const collectionCentreDetailsErrorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'COLLECTIONCENTREDETAILSERROR':
            if (!action.payload) {
                return initialState
            }
            else {
                return {
                    ...state,
                    collectionCentreDetailsError: action.payload
                }
            }
        default:
            return state;
    }
};

export default collectionCentreDetailsErrorReducer;