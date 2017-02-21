import defaultRecordings from '../../mock/recordings'

// Actions
const ADD_RECORDING = 'RecordingState/ADD';
const TOGGLE_SELECT_RECORDING = 'RecordingState/TOGGLE_SELECT';

// Action creator
export function addRecording(duration, recordingPath) {
  return { 
    type: ADD_RECORDING,
    duration: duration,
    recordingPath: recordingPath
  };
}

export function toggleRecording(recording) {
  return {
    type: TOGGLE_SELECT_RECORDING,
    recordingPath: recording.recordingPath
  };
}


// Reducers
const recordings = (state = defaultRecordings, action) => {
  switch (action.type) {
    case ADD_RECORDING:
      return [
         {
            name: '', 
            duration: action.duration,
            recordingPath: action.filePath,
            created: moment()
          },
        ...state
      ];
    case TOGGLE_SELECT_RECORDING:
      return state.map((recording, index) => {
        if (recording.recordingPath === action.recordingPath) {
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