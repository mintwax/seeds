import React, { Component, PropTypes } from 'react';
import {
  ListView,
  TouchableWithoutFeedback,
  View,
  Text,
  ProgressBarAndroid
} from 'react-native';

import styles from './styles';
import moment from 'moment';
import TimeFormatter from '../../lib/minutes-seconds';

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2
});

class GridView extends Component {

  constructor (props) {
    super(props);
    this.state = {
      dataSource: ds.cloneWithRows(props.recordings)
    };
    this._renderRow = this._renderRow.bind(this);
  }

  _updateDataSource(recordings) {
    this.setState({
      dataSource: ds.cloneWithRows(recordings)
    });
  }

  componentWillReceiveProps(newProps) {
    this._updateDataSource(newProps.recordings);
  }
  
  _renderRow(recording) {
    const onPress = this.props.onPress.bind(this, recording);
    const onLongPress = this.props.onLongPress.bind(this, recording);
    return (
      <TouchableWithoutFeedback onPress={onPress} onLongPress={onLongPress}>
        <View style={styles.gridItem}>
          <Text style={styles.gridName}>{recording.name}</Text>
          <Text style={styles.gridDuration}>{TimeFormatter(recording.duration)}</Text>
          {/*<Text style={styles.gridCreated}>{moment.duration(rowData.created - moment()).humanize()} ago</Text>*/}
          {recording.isPlaying && 
            <ProgressBarAndroid 
              styleAttr="Horizontal" 
              indeterminate={false} 
              color="blue" 
              progress={rowData.playProgress} 
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

GridView.propTypes = {
  recordings: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
  onLongPress: PropTypes.func.isRequired
};

export default GridView;