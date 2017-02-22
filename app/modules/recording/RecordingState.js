import defaultRecordings from '../../mock/recordings'
import moment from 'moment'
import {Map} from 'immutable'
import {default as Sound} from 'react-native-sound';

const playTimers = {};

import {
  Alert,
} from 'react-native';

// Actions
const ADD_RECORDING = 'RecordingState/ADD';
const TOGGLE_SELECT_RECORDING = 'RecordingState/TOGGLE_SELECT';
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

function startPlayRecording() {
  return { 
    type: START_PLAY_RECORDING,
  };
}

function stopPlayRecording() {
  return { 
    type: STOP_PLAY_RECORDING,
  };
}

function updateElapsedPlayTime(recording, elapsedPlaySecs) {
  return {
    type: UPDATE_ELAPSED_PLAY_TIME,
    elapsedPlaySecs: elapsedPlaySecs
  }
}

export function toggleRecording(recording) {
  return {
    type: TOGGLE_SELECT_RECORDING,
    path: recording.get('path')
  };
}

export function requestPlayRecording(recording) {
  
    var path = recording.get('path');
    var recordingDuration = recording.get('duration');

    clearInterval(playTimers[path]);

    return function(dispatch) {
      var sound = new Sound(path, '', (error) => {
        if (error) {
          Alert.alert('Unable to play', 'Failed to load the recording: ' + path);
          return;
        }
        
        sound.play((success) => {

          clearInterval(playTimers[path]);
          
          if (success) {
            dispatch(updateElapsedPlayTime(recording, recordingDuration));
          } else {
            Alert.alert('Unable to play', 'playback failed due to audio decoding errors');
          }

          dispatch(stopPlayRecording(recording));
          sound.release();
        });

        dispatch(startPlayRecording(recording));
      
        playTimers[path] = setInterval( () => {
        
          sound.getCurrentTime((curSecs) => {
            if (!recording.get('isPlaying')) {
              return;
            }
            dispatch(updateElapsedPlayTime(recording, curSecs));
          });
        }, 500);
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

    case TOGGLE_SELECT_RECORDING:
      return state.map((r) => {
        if (r.path === action.path) {
          return r.set('selected', !r.selected);
        }
        return r;
      });

    case START_PLAY_RECORDING:
      return state.map((r) => {
        if (r.path === action.path) {
          return r.set('isPlaying', true).set('elapsedPlaySecs', 0.0)
        }
        return r;
      });

    case STOP_PLAY_RECORDING:
      return state.map((r) => {
        if (r.path === action.path) {
          return r.set('isPlaying', false);
        }
        return r;
      });

    case UPDATE_ELAPSED_PLAY_TIME:
      return state.map((r) => {
        if (r.path === action.path) {
          return r.set('elapsedPlaySecs', action.elapsedPlaySecs);
        }
        return r;
      });
    default:
      return state;
  }
};

export default recordings;