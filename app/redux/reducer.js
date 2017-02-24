import { combineReducers } from 'redux';

import RecordingStateReducer from '../modules/home/RecordingState';
import LayoutStateReducer from '../modules/home/LayoutState';
import MicrophoneStateReducer from '../modules/home/MicrophoneState';

const reducers = combineReducers({
  recordings: RecordingStateReducer,
  layout: LayoutStateReducer,
  mic: MicrophoneStateReducer
});

export default reducers;