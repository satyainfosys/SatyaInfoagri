const initialState = {
    vendorMasterDetailsError: {
        vendorNameErr: {},
        countryCodeErr: {},
        stateCodeErr: {},
        panNoErr: {},
        gstNoErr: {},
        websiteErr: {},
        vendorProductCatalogueDetailsErr: {},
        productDuplicateErr: {},
    }
};

const vendorMasterDetailsErrorReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'VENDORMASTERDETAILSERROR':
            if (!action.payload) {
                return initialState
            }
            else {
                return {
                    ...state,
                    vendorMasterDetailsError: action.payload
                }
            }
        default:
            return state;
    }
};

export default vendorMasterDetailsErrorReducer;