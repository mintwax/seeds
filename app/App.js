// import 'es6-symbol/implement';
import {Provider} from 'react-redux';
import store from './redux/store';
import HomeScreenContainer from './modules/HomeScreenContainer';
import EditScreenContainer from './modules/EditScreenContainer';
import React from 'react';

import { StackNavigator } from 'react-navigation';

const routes = {
  Home: { screen: HomeScreenContainer  },
  Edit: { screen: EditScreenContainer }
}
const config = {
  headerMode : 'screen'
}

const AppNavigator = StackNavigator(routes, config);

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