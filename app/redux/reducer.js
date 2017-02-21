import { combineReducers } from 'redux';

import RecordingStateReducer from '../modules/recording/RecordingState';
import LayoutStateReducer from '../modules/recording/LayoutState';

const reducers = combineReducers({
  recordings: RecordingStateReducer,
  layout: LayoutStateReducer
});

export default reducers;