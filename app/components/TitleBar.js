import React, { Component, PropTypes } from 'react';
import {
  View, 
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import {List} from 'immutable'
import PopupMenu from './PopupMenu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const ICON_SIZE=24;

function TitleBarButton(props) {
  if (!props.show) {
    return null;
  } else {
    return (<TouchableHighlight onPress={props.onPress}>
              <Icon name={props.iconName} size={ICON_SIZE} color={'white'} />
            </TouchableHighlight>)}
}

class TitleBar extends Component {

  constructor (props) {
    super(props);
    this.state = {
      displayActions: false
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedRecordings.size == 1) {
      this.setState({
        displayDelete: true,
        displayEdit: true,
        displayShare: true,
        displayCancel: true
      });
    } else if (nextProps.selectedRecordings.size == 0) {
      this.setState({
        displayDelete: false,
        displayEdit: false,
        displayShare: false,
        displayCancel: false
      });
    } else {
      this.setState({
        displayDelete: true,
        displayEdit: false,
        displayShare: true,
        displayCancel: true
      });
    }
  }

  render() { 
    var displayActions = this.state.displayActions;
    return(
      <View style={styles.titleBar}>
        <TitleBarButton show={this.state.displayCancel}
          iconName='arrow-left-bold' onPress={this.props.onPressCancel} />
        <Text style={styles.title}>{this.props.title}</Text>
        <TitleBarButton show={this.state.displayDelete}
           iconName='delete' onPress={this.props.onPressDelete} />
        <TitleBarButton show={this.state.displayShare}
          iconName='share' onPress={this.props.onPressShare} />
        <TitleBarButton show={this.state.displayEdit} 
          iconName='pencil' onPress={this.props.onPressEdit} />
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
  onMenuEvent: PropTypes.func.isRequired,
  selectedRecordings: PropTypes.instanceOf(List),
  onPressShare: PropTypes.func.isRequired,
  onPressDelete: PropTypes.func.isRequired,
  onPressEdit: PropTypes.func.isRequired,
  onPressCancel: PropTypes.func.isRequired,
}

export default TitleBar;



