import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import AppContext from 'context/Context';
import { settings } from './config';
import { getItemFromStore } from 'helpers/utils';
import { configReducer } from './reducers/configReducer';
import useToggleStyle from './hooks/useToggleStyle';

const Main = props => {
  const configState = {
    isRTL: getItemFromStore('isRTL', settings.isRTL)
  };

  const [config, configDispatch] = useReducer(configReducer, configState);

  const { isLoaded } = useToggleStyle(
    config.isRTL,
    configDispatch
  );

  const setConfig = (key, value) => {
    configDispatch({
      type: 'SET_CONFIG',
      payload: {
        key,
        value,
        setInStore: [
          'isRTL'
        ].includes(key)
      }
    });
  };

  if (!isLoaded) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }}
      />
    );
  }

  return (
    <AppContext.Provider value={{ config, setConfig, configDispatch }}>
      {props.children}
    </AppContext.Provider>
  );
};

Main.propTypes = { children: PropTypes.node };

export default Main;
