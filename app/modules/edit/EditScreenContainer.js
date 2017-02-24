import {connect} from 'react-redux';
import EditScreen from './EditScreen';
import * as RecordingStateActions from '../home/RecordingState';

const mapStateToProps = (state) => {
  return ({
    recordings: state.recordings,
    mic: state.mic,
    layout: state.layout
  });
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateRecording: (recording) => {
      dispatch(RecordingStateActions.updateRecording(recording));
    },

    requestPlayRecording: (recording) => {
      dispatch(RecordingStateActions.requestPlayRecording(recording));
    },

    clearAllSelected: () => {
      dispatch(RecordingStateActions.clearAllSelected());
    }
  }

}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditScreen);