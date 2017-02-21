import 'es6-symbol/implement';
import {Provider} from 'react-redux';
import store from './app/redux/store';
import AppViewContainer from './app/modules/AppViewContainer';
import React from 'react';
import {AppRegistry} from 'react-native';


const AppTemplate = React.createClass({

  render() {
    return (
      <Provider store={store}>
        <AppViewContainer />
      </Provider>
    );
  }
});

AppRegistry.registerComponent('AppTemplate', () => AppTemplate);