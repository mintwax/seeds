/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import TimeFormatter from './app/lib/minutes-seconds';
import uuid from 'uuid/v4';

import Icon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PopupMenu from './app/components/PopupMenu';
import GridView from './app/components/GridView';

import React, { Component } from 'react';
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

const recordModalWidth = 200;
const recordModalHeight = 200;
const window = Dimensions.get('window');
const recordModalTop = (window.height - recordModalHeight) / 2;
const recordModalLeft = (window.width - recordModalWidth) / 2;

// let recordings = [];
import recordings from './app/mock/recordings'

export default class seeds extends Component {
    
  constructor(props) {
    super(props);
    this.state = {

      dataSource: ds.cloneWithRows(recordings),
      isRecording: false,
      recordingStart: null,
      currentTime: 0.0,
      listLayout: LISTLAYOUT.GRID,
    };

    // alert(this.state.dataSource.getRowCount());
  }

  _getNewAudioPath() {
    return AudioUtils.DocumentDirectoryPath + '/' + uuid() + '.aac'
  }

  _onPopupMenuEvent = (eventName, index) => {

    if (eventName == 'itemSelected') {
      if (index == 0) {
        this._toggleListLayout(LISTLAYOUT.LIST);
      } else if (index == '1') {
        // grid view
        this._toggleListLayout(LISTLAYOUT.GRID);
      }
    }
  
  }


  _renderTitleBar() {
    return(
      <View style={styles.titleBar}>
        <Text style={styles.title}>Seeds</Text>
        <PopupMenu actions={['List view', 'Grid view']} onPress={this._onPopupMenuEvent} />
      </View>
    );
  }

  _renderRecordPanel() {

    return(
        <View style={styles.recordPanel}>
           <MIcon name="microphone" size={90} color="white" >
          </MIcon>
          <Text style={styles.recordTimer}>
            {TimeFormatter(this.state.currentTime)}
          </Text>
      </View>
    )
  }

  _renderRecordButton() {

    return(
       <View style={styles.recordButtonWrapper}>
           <MIcon.Button name="record" backgroundColor="#3b5998" 
                style={styles.recordButton}
                // underlayColor='#777'
                delayPressIn={0.0}
                delayPressOut={0.0}
                onPress={this._startRecording.bind(this)}
              >Record
          </MIcon.Button>
        </View>
    )
  }

 _renderStopButton() {
    return(
       <View style={styles.recordButtonWrapper}>
           <MIcon.Button name="stop-circle" backgroundColor="#3b5998" 
                style={styles.recordButton}
                // underlayColor='#777'
                delayPressIn={0.0}
                delayPressOut={0.0}
                onPress={this._stopRecording.bind(this)}
              >Stop
          </MIcon.Button>
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
      <GridView dataSource={this.state.dataSource} onPress={this._playRecording.bind(this)}/>
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
        {this._renderTitleBar()}
        {/*{this._renderListControls()}*/}
        {this.state.listLayout == LISTLAYOUT.LIST && this._renderList()}
        {this.state.listLayout == LISTLAYOUT.GRID && this._renderGrid()}
        {!this.state.isRecording && this._renderRecordButton()}
        {this.state.isRecording && this._renderStopButton()}
        {this.state.isRecording && this._renderRecordPanel()}
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
          recordingStart: new Date()
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

  titleBar: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: '#1B5E20',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  title: {
    alignSelf: 'center',
    fontWeight: '600',
    color: 'white'
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    paddingBottom: 15,
  },

  recordButton: {
    height:100,
    width: 100,
    // borderRadius: 60,
    // backgroundColor: '#fff',
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
