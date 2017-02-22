import {connect} from 'react-redux';
import AppView from './AppView';
import * as RecordingStateActions from '../modules/recording/RecordingState';
import * as MicrophoneStateActions from '../modules/recording/MicrophoneState';
import * as LayoutStateActions from '../modules/recording/LayoutState';

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
)(AppView);