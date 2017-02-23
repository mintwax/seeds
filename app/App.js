// import 'es6-symbol/implement';
import {Provider} from 'react-redux';
import store from './redux/store';
import HomeScreenContainer from './modules/HomeScreenContainer';
import React from 'react';

import { StackNavigator } from 'react-navigation';

const AppNavigator = StackNavigator({
  Home: { screen: HomeScreenContainer },
});

class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
};

export default App