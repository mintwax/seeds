import React, { Component, PropTypes } from 'react';
import {
  View, 
  Text,
  StyleSheet
} from 'react-native';

import PopupMenu from './PopupMenu';

class TitleBar extends Component {

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

const styles = StyleSheet.create({

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
});


TitleBar.propTypes = {
  title: PropTypes.string.isRequired,
  menuActions:  PropTypes.arrayOf(PropTypes.string).isRequired,
  onMenuEvent: PropTypes.func.isRequired
}

export default TitleBar;



