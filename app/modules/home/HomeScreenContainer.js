import {connect} from 'react-redux';
import HomeScreen from './HomeScreen';
import * as RecordingStateActions from './RecordingState';
import * as MicrophoneStateActions from './MicrophoneState';
import * as LayoutStateActions from './LayoutState';

const mapStateToProps = (state) => {
  return ({
    recordings: state.recordings,
    mic: state.mic,
    layout: state.layout
  });
}

const mapDispatchToProps = (dispatch) => {
  return {
    addRecording: (duration, recordingPath) => {
      dispatch(RecordingStateActions.addRecording(duration, recordingPath));
    },

    requestPlayRecording: (recording) => {
      dispatch(RecordingStateActions.requestPlayRecording(recording));
    },

    toggleRecording: (recording) => {
      dispatch(RecordingStateActions.toggleRecording(recording));
    },

    clearAllSelected: () => {
      dispatch(RecordingStateActions.clearAllSelected());
    },

    requestStartRecording: () => {
      dispatch(MicrophoneStateActions.requestStartRecording());
    },

    requestStopRecording: () => {
      dispatch(MicrophoneStateActions.requestStopRecording());
    },

    updateElapsedRecordingTime: (secs) => {
      dispatch(MicrophoneStateActions.updateElapsedRecordingTime(secs));
    },

    setLayout: (layoutType) => {
      dispatch(LayoutStateActions.setLayout(layoutType));
    }
  }

}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreen);