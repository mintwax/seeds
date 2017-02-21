import thunkMiddleware from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux';
import rootReducer from './reducer';
import createLogger from 'redux-logger';

const logger = createLogger();

// create the store
const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    logger
  )
);

export default store;