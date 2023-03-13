const initialState = {
  farmerLiveStockCattleDetailsList: []
};

const farmerLiveStockCattleDetailsListReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FARMERLIVESTOCKCATTLEDETAILSLIST':
      if(!action.payload)
      {
        return initialState
      }
      else if(Array.isArray(action.payload))
      {
        return{
          ...state,
          farmerLiveStockCattleDetailsList : action.payload
        }
      }
      else{
        return{
          ...state,
          farmerLiveStockCattleDetailsList : [...state.farmerLiveStockCattleDetailsList, action.payload]
        }
      }
    default:
      return state;
  }
};

export default farmerLiveStockCattleDetailsListReducer;