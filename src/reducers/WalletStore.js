export const initState = {
    tab: 1
  };
  
  const WalletStore = (state = initState, action) => {
    if (action.type === "UPDATE_TAB") {
      return {
        ...state,
        ...action.payload,
      };
    }
  
    return state;
  };
  
  export default WalletStore;
  