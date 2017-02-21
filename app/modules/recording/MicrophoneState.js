import {Map} from 'immutable';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import uuid from 'uuid/v4';
import Toast from '../../lib/toast'
import {default as Sound} from 'react-native-sound';
import * as RecordingStateActions from './RecordingState';

import {
  Alert,
  Platform
} from 'react-native';

// Actions
const START_RECORDING = 'MicrophoneState/START'
const STOP_RECORDING = 'MicrophoneState/STOP'
const UPDATE_ELAPSED_RECORDING_TIME = 'MicrophoneState/UPDATE'

const initialState = Map({
  isRecording : false,
  elapsedRecordingSecs: 0.0
});

// Action creator
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

export function updateElapsedRecordingTime(elapsedRecordingSecs) {
  return { 
    type: UPDATE_ELAPSED_RECORDING_TIME,
    elapsedRecordingSecs: elapsedRecordingSecs
  };
}

export function requestStartRecording() {

  return async function(dispatch) {
    prepareRecordingPath();
    
    console.log('recording preparation finished ');    

    try {
      const filePath = await AudioRecorder.startRecording();
      dispatch(startRecording());
      console.log('recording started for ' + filePath);    
    } catch (error) {
      console.error('start recording error: ' + error);
      dispatch(stopRecording());
    }
  }
}

function prepareRecordingPath() {
  let filePath = AudioUtils.DocumentDirectoryPath + '/' + uuid() + '.aac'
  AudioRecorder.prepareRecordingAtPath(filePath, {
    SampleRate: 22050,
    Channels: 1,
    AudioQuality: "Low",
    AudioEncoding: "aac",
    // AudioEncodingBitRate: 32000
  });
}

export function requestStopRecording() {

  return async function(dispatch) {

    dispatch(stopRecording());

    try {
      const filePath = await AudioRecorder.stopRecording();
      console.log('recording stopped for ' + filePath);
      
      if (Platform.OS === 'android') {
        var sound = new Sound(filePath, '', (error) => {
          if (error) {
            console.error('Unable to load', 'Failed to load the recording: ' + filePath);
            return;
          }
          dispatch(RecordingStateActions.addRecording(sound.getDuration(), filePath));
        })
      }

    } catch (error) {
      console.error("stop recording error: " + error);
    }
  }
}


// Reducers
const mic = (state = initialState, action) => {
  switch (action.type) {
    case START_RECORDING:
      return state.set('isRecording', true).set('elapsedRecordingSecs', 0.0);
    case STOP_RECORDING:
      return state.set('isRecording', false).set('elapsedRecordingSecs', 0.0);
    case UPDATE_ELAPSED_RECORDING_TIME:
      return state.set('elapsedRecordingSecs', action.elapsedRecordingSecs);
    default:
      return state;
  }
};

export default mic;