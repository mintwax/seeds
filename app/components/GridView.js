import React, { Component, PropTypes } from 'react';
import {
  ListView,
  TouchableWithoutFeedback,
  View,
  Text,
  ProgressBarAndroid,
  StyleSheet
} from 'react-native';

import {List} from 'immutable';
import moment from 'moment';
import TimeFormatter from '../lib/minutes-seconds';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

class GridView extends Component {

  static propTypes = {
    recordings: PropTypes.instanceOf(List).isRequired,
    onPress: PropTypes.func.isRequired,
    onLongPress: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
       dataSource: ds.cloneWithRows(props.recordings.toArray())
    };
    this._renderRow = this._renderRow.bind(this);
  }

  _updateDataSource(recordings) {
    this.setState({
      dataSource: ds.cloneWithRows(recordings.toArray())
    });
  }

  componentWillReceiveProps(newProps) {
    // TODO - why is this being called every second when recording a new audio
    this._updateDataSource(newProps.recordings);
  }
  
  _renderRow(recording) {
    const onPress = this.props.onPress.bind(this, recording);
    const onLongPress = this.props.onLongPress.bind(this, recording);
    return (
      <TouchableWithoutFeedback onPress={onPress} onLongPress={onLongPress}>
        <View style={styles.gridItem}>
          <Text style={styles.gridName}>{recording.get('name')}</Text>
          <Text style={styles.gridDuration}>{TimeFormatter(recording.get('duration'))}</Text>
          {/*<Text style={styles.gridCreated}>{moment.duration(moment(recording.get('created')) - moment()).humanize()} ago</Text>*/}
          {recording.get('isPlaying') && 
            <ProgressBarAndroid 
              styleAttr="Horizontal" 
              indeterminate={false} 
              color="blue" 
              progress={recording.get('elapsedPlaySecs') / recording.get('duration')} 
              {...this.props}
            />
          }
        </View>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    return (
      <ListView contentContainerStyle={styles.grid}
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow}
      />
    )
  }
}

const styles = StyleSheet.create({

  grid: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1
    // backgroundColor: 'tan',
  },

  gridItem: {
       backgroundColor: '#CCC',
        marginLeft: 5,
        marginTop: 5,
        // width: 100,
        height: 70,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        borderRadius: 10,
  },

  gridName: {
    fontSize: 12,
    color: '#777'
  },
  
  gridDuration: {
    color: '#000',
    fontSize: 12,
    fontWeight: '300'
  },

  gridCreated: {
    color: '#777',
    fontSize: 12,
  }
});

export default GridView;