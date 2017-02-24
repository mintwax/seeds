import defaultRecordings from '../../mock/recordings'
import moment from 'moment'
import {Map} from 'immutable'
import {default as Sound} from 'react-native-sound';

import {
  Alert,
} from 'react-native';

// Actions
const ADD_RECORDING = 'RecordingState/ADD';
const UPDATE_RECORDING = 'RecordingState/UPDATE';
const TOGGLE_SELECT_RECORDING = 'RecordingState/TOGGLE_SELECT';
const CLEAR_ALL_SELECTED = 'RecordingState/CLEAR_ALL';
const START_PLAY_RECORDING = 'RecordingState/PLAY'
const STOP_PLAY_RECORDING = 'RecordingState/STOP'
const UPDATE_ELAPSED_PLAY_TIME = 'RecordingState/UPDATE_ELAPSED_PLAY_TIME'

// Action creator
export function addRecording(duration, path) {
  return { 
    type: ADD_RECORDING,
    duration: duration,
    path: path
  };
}

export function updateRecording(recording) {

  return { 
    type: UPDATE_RECORDING,
    path: recording.get('path'),
    name: recording.get('name'),
  };
}


function startPlayRecording(recording) {
  return { 
    type: START_PLAY_RECORDING,
    path: recording.get('path')
  };
}

function stopPlayRecording(recording) {
  return { 
    type: STOP_PLAY_RECORDING,
    path: recording.get('path')
  };
}

function updateElapsedPlayTime(recording, elapsedPlaySecs) {
  return {
    type: UPDATE_ELAPSED_PLAY_TIME,
    path: recording.get('path'),
    elapsedPlaySecs: elapsedPlaySecs
  }
}

export function clearAllSelected() {
  return {
    type: CLEAR_ALL_SELECTED
  };
}
export function toggleRecording(recording) {
  return {
    type: TOGGLE_SELECT_RECORDING,
    path: recording.get('path')
  };
}

export function requestPlayRecording(recording) {
  
    var path = recording.get('path');

    return function(dispatch) {
      var sound = new Sound(path, '', (error) => {
        if (error) {
          Alert.alert('Unable to play', 'Failed to load the recording: ' + path);
          return;
        }
        
        dispatch(startPlayRecording(recording));

        sound.play((success) => {
          
          if (!success) {
            Alert.alert('Unable to play', 'playback failed due to audio decoding errors');
          }

          dispatch(stopPlayRecording(recording));
          sound.release();
        });
      })
    }
  }

// Reducers
const recordings = (state = defaultRecordings, action) => {
  
  switch (action.type) {
    
    case ADD_RECORDING:
      return state.unshift(Map({
            name: '', 
            duration: action.duration,
            path: action.path,
            created: moment().valueOf()
      }));

    case UPDATE_RECORDING:
      return state.map((r) => {
        if (r.get('path') === action.path) {
          return r.set('name', action.name);
        }
        return r;
      });

    case CLEAR_ALL_SELECTED:
      return state.map((r) => {
        return r.set('isSelected', false);
      });

    case TOGGLE_SELECT_RECORDING:
      return state.map((r) => {
        if (r.get('path') === action.path) {
          return r.set('isSelected', !r.get('isSelected'));
        }
        return r;
      });

    case START_PLAY_RECORDING:
      return state.map((r) => {
        if (r.get('path') === action.path) {
          return r.set('isPlaying', true).set('elapsedPlaySecs', 0.0)
        }
        return r;
      });

    case STOP_PLAY_RECORDING:
      return state.map((r) => {
        if (r.get('path') === action.path) {
          return r.set('isPlaying', false);
        }
        return r;
      });

    case UPDATE_ELAPSED_PLAY_TIME:
      return state.map((r) => {
        if (r.get('path') === action.path) {
          return r.set('elapsedPlaySecs', action.elapsedPlaySecs);
        }
        return r;
      });
    default:
      return state;
  }
};

export default recordings;