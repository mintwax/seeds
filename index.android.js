/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import TimeFormatter from 'minutes-seconds-milliseconds';
import uuid from 'node-uuid';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Alert,
  Button,
  ListView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Platform,
  PermissionsAndroid
} from 'react-native';

import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

let recordings = [];

export default class seeds extends Component {
    
  constructor(props) {
    super(props);
    this.state = {

      dataSource: ds.cloneWithRows(recordings),
      isRecording: false,
      recordingDuration: 0,
      recordingStart: null,
      currentTime: 0.0,
    };
  }

  _getNewAudioPath() {
    return AudioUtils.DocumentDirectoryPath + '/' + uuid.v4() + '/recording.aac'
  }

  _renderTitle() {
    return(
      <View style={styles.header}>
        <Text style={styles.title}>Seeds</Text>
      </View>
    );
  }

  _renderRecordPanel() {
    return(
      <View style={styles.recordPanel}>
        <Text style={styles.timer}>{TimeFormatter(this.state.recordingDuration)}</Text>
        <Text style={styles.timer}>{this.state.currentTime}</Text>
      </View>
    )
  }

  _renderList() {
    return(
      <View>

       <View style={styles.recordButtonWrapper}>
        <TouchableOpacity
                style={styles.recordButton}
                underlayColor='#777'
                delayPressIn={0.0}
                delayPressOut={0.0}
                onPressIn={this._startRecording.bind(this)}
                onPressOut={this._stopRecording.bind(this)}
              >
              <Text>Record</Text>
          </TouchableOpacity>
        </View>
      <ListView
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={ (rowData) => (
            <TouchableWithoutFeedback
                onPress={this._playRecording.bind(this, rowData.recordingPath)}>
              <View style={styles.recordingRow}>
                <Text style={styles.recordingName}>{rowData.name}</Text>
                <Text style={styles.recordingDuration}>{TimeFormatter(rowData.duration)}</Text>
              </View>
           </TouchableWithoutFeedback>
        )}  
      />
      </View>
    )
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

  _playRecording(recordingPath) {

      var sound = new Sound(recordingPath, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
        }
      });

      setTimeout(() => {
        sound.play((success) => {
          if (success) {
             console.log('successfully finished playing');
           } else {
             console.log('playback failed due to audio decoding errors');
           }
        });
      }, 500)
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
          isRecording: true,
          recordingDuration: 0,
          recordingStart: new Date()
        });
      } catch (error) {
        console.error(error);
      }
  
      // this.interval = setInterval( () => {
      //    this.setState({
      //      recordingDuration: new Date() - this.state.recordingStart
      //    })
      // }, 100);
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
    }
  }

  _finishRecording(didSucceed, filePath) {
    this.setState({ finished: didSucceed });
    console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
    const id = _getIDFromAudioPath(filePath);
    recordings.push(
      { name: 'recording', 
        duration: this.state.recordingDuration, 
        id: id,
        recordingPath: filePath
      });
    this.setState({
      dataSource: ds.cloneWithRows(recordings),
      isRecording: false,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          {this._renderTitle()}
          {this._renderRecordPanel()}
        </View>
        <View style={styles.bottom}>
          {this._renderList()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  header: {
    borderBottomWidth: 0.5,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#F9F9F9'
  },

  title: {
    alignSelf: 'center',
    fontWeight: '600'
  },

  recordPanel: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    flex: 1
  },

  timer: {
    fontSize: 60,
    fontWeight: '100',
    borderWidth: 0,
    alignSelf: 'center'
  },
  
  top: {
    flex: 1,
  },
  bottom: {
    flex: 2,
    backgroundColor: '#F0EFF5'
  },
  recordButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    paddingBottom: 30
  },
  recordButton: {
    height:80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
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

AppRegistry.registerComponent('seeds', () => seeds);
