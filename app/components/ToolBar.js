import React, { Component, PropTypes } from 'react';
import {
  View, 
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import {List} from 'immutable'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const ICON_SIZE=24;

function ToolBarButton(props) {
  if (!props.show) {
    return null;
  } else {
    return (<TouchableHighlight onPress={props.onPress}>
              <Icon name={props.iconName} size={ICON_SIZE} color={'#1B5E20'} />
            </TouchableHighlight>)}
}

class ToolBar extends Component {

  constructor (props) {
    super(props);
  }
  
  componentWillReceiveProps(nextProps) {
    var displayDelete = false, displayEdit = false, displayShare = false;

    if (nextProps.selectedRecordings.size > 0) {
      displayDelete = true;
      displayEdit = true;
      displayShare = true;
    };
    
    if (nextProps.selectedRecordings.size == 2) {
      displayEdit = false
    } 

    this.setState({
      displayDelete: displayDelete,
      displayEdit: displayEdit,
      displayShare: displayShare,
    });
  }

  render() { 
    if (this.props.selectedRecordings.size === 0) {
      return null;
    }
    
    return(
      <View style={styles.toolBar}>
        <ToolBarButton show={this.state.displayEdit} 
          iconName='pencil' onPress={this.props.onPressEdit} />
        <ToolBarButton show={this.state.displayDelete}
           iconName='delete' onPress={this.props.onPressDelete} />
        <ToolBarButton show={this.state.displayShare}
          iconName='share' onPress={this.props.onPressShare} />
        
      </View>
    );
  }

}

const styles = StyleSheet.create({

    toolBar: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 10,
      paddingLeft: 10,
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
});


ToolBar.propTypes = {
  selectedRecordings: PropTypes.instanceOf(List),
  onPressShare: PropTypes.func.isRequired,
  onPressDelete: PropTypes.func.isRequired,
  onPressEdit: PropTypes.func.isRequired,
}

export default ToolBar;



