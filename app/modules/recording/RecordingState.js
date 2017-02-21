import defaultRecordings from '../../mock/recordings'
import moment from 'moment'

// Actions
const ADD_RECORDING = 'RecordingState/ADD';
const TOGGLE_SELECT_RECORDING = 'RecordingState/TOGGLE_SELECT';
const START_RECORDING = 'RecordingState/START'
const STOP_RECORDING = 'RecordingState/STOP'

// Action creator
export function addRecording(duration, path) {
  return { 
    type: ADD_RECORDING,
    duration: duration,
    path: path
  };
}

function startRecording() {
  return { 
    type: START_RECORDING,
  };
}

function stopRecording() {
  return { 
    type: STOP_RECORDING,
  };
}

export function toggleRecording(recording) {
  return {
    type: TOGGLE_SELECT_RECORDING,
    path: recording.path
  };
}


// Reducers
const recordings = (state = defaultRecordings, action) => {
  switch (action.type) {
    case ADD_RECORDING:
      return state.unshift({
            name: '', 
            duration: action.duration,
            path: action.path,
            created: moment()
      });
    case TOGGLE_SELECT_RECORDING:
      return state.map((recording, index) => {
        if (recording.path === action.path) {
          return Object.assign({}, recording, {
            selected: !recording.selected
          })
        }
        return recording
      })
    default:
      return state;
  }
};

export default recordings;