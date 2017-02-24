import {connect} from 'react-redux';
import ToolBar from './ToolBar';

const mapStateToProps = (state) => {
  return ({
    recordings: state.recordings
  });
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToolBar);