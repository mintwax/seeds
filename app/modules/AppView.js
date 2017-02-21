import uuid from 'uuid/v4';

import TimeFormatter from '../lib/minutes-seconds';
import Toast from '../lib/toast'
import GridView from '../components/GridView';
import TitleBar from '../components/TitleBar';
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
  PermissionsAndroid
} from 'react-native';

import {default as Sound} from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionButton from 'react-native-action-button';
import {List} from 'immutable';

const recordModalWidth = 200;
const recordModalHeight = 200;
const window = Dimensions.get('window');
const recordModalTop = (window.height - recordModalHeight) / 2;
const recordModalLeft = (window.width - recordModalWidth) / 2;

class AppView extends Component {

  static propTypes = {
    recordings: PropTypes.instanceOf(List).isRequired,
    addRecording: PropTypes.func.isRequired,
    setLayout: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      currentTime: 0.0,
    };

    this._onMenuEvent = this._onMenuEvent.bind(this);
    this._onPressFAB = this._onPressFAB.bind(this);
    this._onPressRecording = this._onPressRecording.bind(this);
  }

  _getNewAudioPath() {
    return AudioUtils.DocumentDirectoryPath + '/' + uuid() + '.aac'
  }

  _renderRecordPanel() {
    return(
        <View style={styles.recordPanel}>
           <Icon name="microphone" size={90} color="white" >
          </Icon>
          <Text style={styles.recordTimer}>
            {TimeFormatter(this.state.currentTime)}
          </Text>
      </View>
    )
  }

  render() {

    return (
      <View style={styles.container}>
        <TitleBar 
          title="Seeds"
          onMenuEvent={this._onMenuEvent}
          menuActions={['List view', 'Grid view']}  
        />
        <GridView
          recordings={this.props.recordings}
          onPress={this._onPressRecording}
          onLongPress={this._onLongPressRecording}
        />
       <ActionButton
          position="center"
          buttonColor="rgb(49,81,181)"
          icon={<Icon name={this.state.isRecording ? "stop" : "microphone"} style={styles.actionButtonIcon}/>} 
          onPress={this._onPressFAB}
       />

        {this.state.isRecording && this._renderRecordPanel()}

      </View>
    );
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

  prepareRecordingPath(){
    let filePath = this._getNewAudioPath();
    AudioRecorder.prepareRecordingAtPath(filePath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      // AudioEncodingBitRate: 32000
    });
  }

  componentDidMount() {
    this._checkPermission().then((hasPermission) => {
      this.setState({ hasPermission });

      if (!hasPermission) return;

      AudioRecorder.onProgress = (data) => {
        this.setState({currentTime: Math.floor(data.currentTime)});
      };

      AudioRecorder.onFinished = (data) => {
        // Android callback comes in the form of a promise instead.
          if (Platform.OS === 'ios') {
            this._finishRecording(data.status === "OK", data.audioFileURL);
          }
      };
    });
  }

  componentWillUnmount() {
    // TODO - track all the playings and clear the timeouts and intervals
  }

  _onLongPressRecording(recording) {
    Toast(recording.path + " selected ");
    // TODO - hook into redux dispatch
  }

  _onPressRecording(recording) {
    // in future press will either play or select depending on current state
    this._playRecording(recording);
  }

  _onPressFAB() {
    if (this.state.isRecording) {
      this._stopRecording();
    } else {
      this._startRecording()
    }
  }

  _playRecording(recording) {

    console.log("JOOBER-PLAY " + JSON.stringify(recording));
    var path = recording.path;
    var recordingDuration = recording.duration;
    clearInterval(recording.playProgressInterval);

    var sound = new Sound(path, '', (error) => {
      if (error) {
        Alert.alert('Unable to play', 'Failed to load the recording: ' + path);
        return;
      }
      
      sound.play((success) => {

        clearInterval(recording.playProgressInterval);
        
        if (success) {
          recording.playProgress = 1;
        } else {
          Alert.alert('Unable to play', 'playback failed due to audio decoding errors');
        }

        recording.isPlaying = false;
        sound.release();
      });

      recording.isPlaying = true;
      recording.playProgress = 0;
     
      recording.playProgressInterval = setInterval( () => {
      
        sound.getCurrentTime((curSecs) => {
          if (!recording.isPlaying) {
            return;
          }
          recording.playProgress = curSecs / recordingDuration;
        });
      }, 500);
    })
  }

  async _startRecording() {
        
      if (!this.state.hasPermission) {
        console.warn('Can\'t record, no permission granted!');
        return;
      }

      if (this.state.isRecording){
        console.warn('Already recording.');
        return;
      }

      this.prepareRecordingPath();

      try {
        const filePath = await AudioRecorder.startRecording();
        console.log('recording started for ' + filePath);
        this.setState({
          currentTime: 0.0,
          isRecording: true,
        });
      } catch (error) {
        console.error(error);
      }
  
  }

  async _stopRecording() {
    if (! this.state.isRecording) {
      console.warn('Can\'t stop, not recording');
      return;
    }

    try {
      const filePath = await AudioRecorder.stopRecording();
      console.log('recording stopped for ' + filePath);
      
      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath);
      }
      // clearInterval(this.interval);
      return filePath;
    } catch (error) {
      console.error(error);
      this.setState({
          isRecording: false,
      });
    }
  }

  _finishRecording(didSucceed, filePath) {
    this.setState({ finished: didSucceed });
    console.log(`Finished recording: ${filePath}`);
    
    // load file and get duration
    var sound = new Sound(filePath, '', (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }

      // get info from sound file
      console.log('duration in seconds: ' + sound.getDuration() 
              + 'number of channels: ' + sound.getNumberOfChannels());
      this.props.addRecording(sound.getDuration(), filePath);
      
      this.setState({
        isRecording: false,
      });
    });
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

export default AppView;
