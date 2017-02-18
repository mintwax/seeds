import React, { Component, PropTypes } from 'react';
import {
  ListView,
  TouchableWithoutFeedback,
  View,
  Text
} from 'react-native';

import styles from './styles';
import TimeFormatter from '../../lib/minutes-seconds';

export default class GridView extends Component {

  static propTypes = {
    // array of actions, will be list items of Menu
    dataSource: PropTypes.instanceOf(ListView.DataSource),
    onPress: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
  }
  
  render() { 
    return (
      <ListView contentContainerStyle={styles.grid}
        enableEmptySections={true}
        dataSource={this.props.dataSource}
        // renderFooter={ () =>  { return (<Text>{this.props.dataSource.getRowCount()} rows</Text>)}} 
        renderRow={ (rowData) => (
          <TouchableWithoutFeedback
              onPress={this.props.onPress.bind(this, rowData.recordingPath)}>
            <View style={ styles.gridItem }>
              <Text style={styles.gridName}>{rowData.name}</Text>
              <Text style={styles.gridDuration}>{TimeFormatter(rowData.duration)}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
    />
  )
  }
}


          