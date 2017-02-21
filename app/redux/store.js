import {createStore} from 'redux';
import reducer from './reducer';

// create the store
const store = createStore(
  reducer
);

export default store;