import {connect} from 'react-redux';
import AppView from './AppView';
import * as RecordingStateActions from '../modules/recording/RecordingState';

const mapStateToProps = (state) => {
  return ({
    recordings: state.recordings
  });
}

const mapDispatchToProps = (dispatch) => {
  return {
    addRecording: (duration, recordingPath) => {
      dispatch(RecordingStateActions.addRecording(duration, recordingPath));
    },

    setLayout: (layoutType) => {
      dispatch(RecordingStateActions.setLayout(layoutType));
    }
  }

}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppView);