const initialState = {
  commonContactDetailsError: {
    contactErr: {}
  }
};

const commonContactDetailErrorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'COMMONCONTACTDETAILSERROR':
      if (!action.payload) {
        return initialState
      }
      else {
        return {
          ...state,
          commonContactDetailsError: action.payload
        }
      }
    default:
      return state;
  }
};

export default commonContactDetailErrorReducer;