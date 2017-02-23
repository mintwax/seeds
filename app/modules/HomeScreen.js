import TimeFormatter from '../lib/minutes-seconds';
import Toast from '../lib/toast'
import GridView from '../components/GridView';
import ToolBar from '../components/ToolBar';
import { LISTLAYOUT } from '../constants';

import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Alert,
  Button,
  Dimensions,
  ListView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Platform,
  PermissionsAndroid,
  PanResponder
} from 'react-native';

import {default as Sound} from 'react-native-sound';
import {AudioRecorder } from 'react-native-audio';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionButton from 'react-native-action-button';
import {List, Map} from 'immutable';

const recordModalWidth = 200;
const recordModalHeight = 200;
const window = Dimensions.get('window');
const recordModalTop = (window.height - recordModalHeight) / 2;
const recordModalLeft = (window.width - recordModalWidth) / 2;

class HomeScreen extends Component {
  
  static navigationOptions = {
    title: ({state}) => {
      return 'Seeds'
    },

    header: ({state, navigate}) => { 
      var selectedRecordings = List([]);
      if (state.params && state.params.selectedRecordings) {
        selectedRecordings = state.params.selectedRecordings;
      }
      
      return {
        style: {
          backgroundColor: '#1B5E20',
        },

        titleStyle: {
          fontWeight: '100',
          color: 'white'
        },
      
        right: (<ToolBar navigate={navigate} selectedRecordings={selectedRecordings} />)

      }
    },
  };

  static propTypes = {
    recordings: PropTypes.instanceOf(List).isRequired,
    addRecording: PropTypes.func.isRequired,
    mic: PropTypes.instanceOf(Map).isRequired,
    layout: PropTypes.string.isRequired,

    requestStartRecording: PropTypes.func.isRequired,
    requestStopRecording: PropTypes.func.isRequired,
    updateElapsedRecordingTime: PropTypes.func.isRequired,
    toggleRecording: PropTypes.func.isRequired,
    clearAllSelected: PropTypes.func.isRequired,
    setLayout: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this._onMenuEvent = this._onMenuEvent.bind(this);
    this._onPressFAB = this._onPressFAB.bind(this);
    this._onPressRecording = this._onPressRecording.bind(this);
    this._onLongPressRecording = this._onLongPressRecording.bind(this);

    this.state = {
      selectedRecordings: List([])
    }
  }

  _renderRecordPanel() {
    return(
        <View style={styles.recordPanel}>
          <Icon name="microphone" size={90} color="white" ></Icon>
          <Text style={styles.recordTimer}>
            {TimeFormatter(this.props.mic.get('elapsedRecordingSecs'))}
          </Text>
      </View>
    )
  }

  render() {

    return (
      <View style={styles.container}>
        <GridView
            recordings={this.props.recordings}
            onPress={this._onPressRecording}
            onLongPress={this._onLongPressRecording}
      />
       <ActionButton
          position="center"
          buttonColor="rgb(49,81,181)"
          icon={<Icon name={this.props.mic.get('isRecording') ? "stop" : "microphone"} style={styles.actionButtonIcon}/>} 
          onPress={this._onPressFAB}
       />

        {this.props.mic.get('isRecording') && this._renderRecordPanel()}

      </View>
    );
  }

  _onPressDelete() {
    Toast("delete");
  }

  _onPressShare() {
    Toast("share");
  }

  _onMenuEvent = (eventName, index) => {

    if (eventName == 'itemSelected') {
      if (index == 0) {
        this.props.setLayout(LISTLAYOUT.LIST);
      } else if (index == '1') {
        this.props.setLayout(LISTLAYOUT.GRID);
      }
    }
  }

  _checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    const rationale = {
      'title': 'Microphone Permission',
      'message': 'Need access to your microphone so you can record audio.'
    };

    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      .then((result) => {
        console.log('Permission result:', result);
        return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
      });
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

      onPanResponderGrant: (evt, gestureState) => {
        console.log("granted " + gestureState);
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        console.log("move " + gestureState);
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        console.log("released " + gestureState);
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        console.log("cancelled " + gestureState);
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        console.log("blocked " + gestureState);
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  componentDidMount() {
    this._checkPermission().then((hasPermission) => {
      this.setState({ hasPermission });

      if (!hasPermission) return;

      AudioRecorder.onProgress = (data) => {
        this.props.updateElapsedRecordingTime( Math.floor(data.currentTime));
      };

      AudioRecorder.onFinished = (data) => {
        // Android callback comes in the form of a promise instead.
          if (Platform.OS === 'ios') {
            if (data.satus === "OK") {
              this.props.addRecording(data.currentTime, data.audioFileURL);
            } else {
              console.error("Recording failed " + data.audioFileURL);
            }
          }
      };
    });
  }

  componentWillUnmount() {
    // TODO - track all the playings and clear the timeouts and intervals
  }

  componentWillReceiveProps(nextProps) {

    var selectedRecordings = nextProps.recordings.filter((recording) => {
      return recording.get('isSelected');
    })

    this.setState({
      selectedRecordings: selectedRecordings
    });
  }

  _toggleRecording(recording) {
    this.props.toggleRecording(recording);
    setTimeout( () => {
        const {setParams} = this.props.navigation;
        setParams({ selectedRecordings: this.state.selectedRecordings });
    }, 100);  // give time for the reducer to work
    
  }

  _onLongPressRecording(recording) {
    this._toggleRecording(recording);
  }

  _onPressRecording(recording) {
    if (this.state.selectedRecordings.size > 0) {
      this._toggleRecording(recording);
    } else {
      this.props.requestPlayRecording(recording);
    }
  }

  _onPressFAB() {
    if (this.props.mic.get('isRecording')) {
      this._pressStopRecording();
    } else {
      this._pressStartRecording();
    }
  }

  async _pressStartRecording() {
        
      if (!this.state.hasPermission) {
        console.warn('Can\'t record, no permission granted!');
        return;
      }

      if (this.props.mic.get('isRecording')){
        console.warn('Already recording.');
        return;
      }
      this.props.requestStartRecording();  
  }

  async _pressStopRecording() {
    if (! this.props.mic.get('isRecording')) {
      console.warn('Can\'t stop, not recording');
      return;
    }
    this.props.requestStopRecording();
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },

  recordPanel: {
    position: 'absolute',
    opacity: .8,
    //backgroundColor: '#ef553a',
    backgroundColor: '#8BC34A',
    borderRadius: 10,
    width: recordModalWidth,
    height: recordModalHeight,
    top: recordModalTop,
    left: recordModalLeft,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },

  recordTimer: {
    fontSize: 20,
    color: 'white',    
    fontWeight: '100',
    borderWidth: 0,
    alignSelf: 'center'
  },
  
  recordButtonWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 10,
    left: recordModalLeft,
    justifyContent: 'space-around',
    paddingTop: 15,
    paddingBottom: 15,
  },

  actionButtonIcon: {
    fontSize:30,
    //height: 22,
    color: 'white'
  },

  recordingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    paddingTop: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd'
  },

  recordingName: {
    fontSize: 16,
    color: '#777'
  },
  recordingDuration: {
    color: '#000',
    fontSize: 20,
    fontWeight: '300'
  }
});

export default HomeScreen;
