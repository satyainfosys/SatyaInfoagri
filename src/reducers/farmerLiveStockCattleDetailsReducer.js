const initialState = {
    farmerLiveStockCattleDetails: []
  };
  
  const farmerLiveStockCattleDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FARMERLIVESTOCKCATTLEDETAILS':
        return{
          ...state,
          farmerLiveStockCattleDetails : action.payload
        }
      default:
        return state;
    }
  };
  
  
  
  export default farmerLiveStockCattleDetailsReducer;