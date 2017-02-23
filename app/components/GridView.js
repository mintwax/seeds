import React, { Component, PropTypes } from 'react';
import {
  ListView,
  TouchableWithoutFeedback,
  TouchableHighlight,
  View,
  Text,
  ProgressBarAndroid,
  StyleSheet,
  Platform
} from 'react-native';

import {List} from 'immutable';
import moment from 'moment';
import TimeFormatter from '../lib/minutes-seconds';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
       dataSource: ds.cloneWithRows(props.recordings.toArray()),
       itemsSelected: false
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

    var enabledSelectedStyle = {};
    if (recording.get('isSelected')) {
      if (Platform.OS === 'ios') {
        enabledSelectedStyle.shadowColor = "#9ecaed";
        enabledSelectedStyle.shadowOffset = 1;
        enabledSelectedStyle.shadowOpacity = 1;
      } else if (Platform.OS === 'android') {
        enabledSelectedStyle.elevation = 3;
        enabledSelectedStyle.borderColor = '#9ecaed';
      }
    }

    return (
      <TouchableWithoutFeedback delayPressIn={0.0} deplayPressOut={0.0} onPress={onPress} onLongPress={onLongPress}>
          <View style={[styles.gridItem, enabledSelectedStyle]}>
            <Text style={styles.gridName}>{recording.get('name')}</Text>
            <Text style={styles.gridDuration}>{TimeFormatter(recording.get('duration'))}</Text>
            {/*<Text style={styles.gridCreated}>{moment.duration(moment(recording.get('created')) - moment()).humanize()} ago</Text>*/}
            {recording.get('isPlaying') && <Icon name="volume-high" size={20} color="white" ></Icon>}
            {recording.get('isSelected') && <Icon name="checkbox-marked-circle" size={20} color="green" ></Icon>}
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
    flex: 1,
    padding: 10
    // backgroundColor: 'tan',
  },

  gridItem: {
    backgroundColor: '#CCC',
    margin: 10,
    marginTop: 5,
    // width: 100,
    height: 70,
    padding: 10,
    borderRadius: 10,
    elevation: 5,
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