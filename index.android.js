/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import TimeFormatter from 'minutes-seconds-milliseconds';
import uuid from 'uuid/v4';

import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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

const LISTLAYOUT = {
  GRID : "grid",
  LIST : "list"
};

// let recordings = [];
let recordings = [
  { name: "recording-6", duration: 2, created: Date.now() - 8000 },
  { name: "recording-5", duration: 20, created: Date.now() - 7000 },
  { name: "recording-4", duration: 15, created: Date.now() - 6000 },
  { name: "recording-3", duration: 7, created: Date.now() - 5000 },
  { name: "recording-2", duration: 4.5, created: Date.now() - 4000 },
  { name: "recording-1", duration: 6, created: Date.now() - 3000 },
]
export default class seeds extends Component {
    
  constructor(props) {
    super(props);
    this.state = {

      dataSource: ds.cloneWithRows(recordings),
      isRecording: false,
      recordingDuration: 0,
      recordingStart: null,
      currentTime: 0.0,
      listLayout: LISTLAYOUT.GRID,
    };
  }

  _getNewAudioPath() {
    return AudioUtils.DocumentDirectoryPath + '/' + uuid() + '.aac'
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
        <Text style={styles.timer}>{this.state.currentTime}</Text>
      </View>
    )
  }

  _renderRecordButton() {

    return(
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
    )
  }

  _renderList() {

    return(
      <ListView 
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={ (rowData) => (
            <TouchableWithoutFeedback
                onPress={this._playRecording.bind(this, rowData.recordingPath)}>
              <View style={ styles.recordingRow }>
                <Text style={styles.recordingName}>{rowData.name}</Text>
                <Text style={styles.recordingDuration}>{TimeFormatter(rowData.duration)}</Text>
              </View>
           </TouchableWithoutFeedback>
        )}  
      />
    )
  }

  _renderGrid() {

    return(
      <ListView contentContainerStyle={styles.grid}
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={ (rowData) => (
            <TouchableWithoutFeedback
                onPress={this._playRecording.bind(this, rowData.recordingPath)}>
              <View style={ styles.gridItem }>
                <Text style={styles.recordingName}>{rowData.name}</Text>
                <Text style={styles.recordingDuration}>{TimeFormatter(rowData.duration)}</Text>
              </View>
           </TouchableWithoutFeedback>
        )}  
      />
    )
  }

  _renderListControls() {

    return(
        <View style={styles.listControls}>
           <MIcon.Button name="view-list" backgroundColor="#3b5998" 
              onPress={this._toggleListLayout.bind(this, LISTLAYOUT.LIST)}>List</MIcon.Button>
           <MIcon.Button name="view-grid" backgroundColor="#3b5998" 
              onPress={this._toggleListLayout.bind(this, LISTLAYOUT.GRID)}>Grid</MIcon.Button>
       </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          {this._renderTitle()}
          {this._renderRecordPanel()}
        </View>
        <View style={styles.bottom}>
          {this._renderRecordButton()}
          {this._renderListControls()}
          {this.state.listLayout == LISTLAYOUT.LIST && this._renderList()}
          {this.state.listLayout == LISTLAYOUT.GRID && this._renderGrid()}
        </View>
      </View>
    );
  }

  _toggleListLayout(layoutType) {

    if (layoutType == this.state.listLayout) {
      return;
    }

    this.setState( {
      "listLayout": layoutType
    })

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
    recordings.unshift(
      { name: 'recording', 
        duration: this.state.currentTime, 
        recordingPath: filePath,
        created: Date.now()
      });
    this.setState({
      dataSource: ds.cloneWithRows(recordings),
      isRecording: false,
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
  listControls: {
    justifyContent: 'center',
    flexDirection: 'row'
  },

  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  gridItem: {
       backgroundColor: '#CCC',
        margin: 10,
        width: 100,
        height: 100
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
