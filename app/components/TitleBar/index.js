import React, { Component, PropTypes } from 'react';
import {
  View, 
  Text
} from 'react-native';

import styles from './styles';
import PopupMenu from '../PopupMenu';

export default class TitleBar extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    menuActions:  PropTypes.arrayOf(PropTypes.string).isRequired,
    onMenuEvent: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
  }
  
  render() { 
    return(
      <View style={styles.titleBar}>
        <Text style={styles.title}>{this.props.title}</Text>
        <PopupMenu 
            actions={this.props.menuActions}
            onPress={this.props.onMenuEvent} />
      </View>
    );
  }

}


