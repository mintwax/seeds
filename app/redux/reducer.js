import { combineReducers } from 'redux';

import RecordingStateReducer from '../modules/recording/RecordingState';
import LayoutStateReducer from '../modules/recording/LayoutState';
import MicrophoneStateReducer from '../modules/recording/MicrophoneState';

const reducers = combineReducers({
  recordings: RecordingStateReducer,
  layout: LayoutStateReducer,
  mic: MicrophoneStateReducer
});

export default reducers;