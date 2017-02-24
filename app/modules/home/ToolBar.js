import React, { Component, PropTypes } from 'react';
import {
  View, 
  Text,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';

import {List} from 'immutable'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PopupMenu from '../../components/PopupMenu';

const ICON_SIZE=24;

function ToolBarButton(props) {
  if (!props.show) {
    return null;
  } else {
    return (<TouchableWithoutFeedback onPress={props.onPress}>
              <Icon name={props.iconName} size={ICON_SIZE} color={'white'} />
            </TouchableWithoutFeedback>)}
}

class ToolBar extends Component {

  constructor (props) {
    super(props);

    this.state = {
      displayDelete: false,
      displayEdit: false,
      displayShare: false,
      selectedRecordings: List([])
    }
  }
  
  componentWillReceiveProps(nextProps) {
    
    var selectedRecordings = nextProps.recordings.filter((recording) => {
      return recording.get('isSelected');
    })

    var displayDelete = false, displayEdit = false, displayShare = false;

    if (selectedRecordings.size > 0) {
      displayDelete = true;
      displayEdit = true;
      displayShare = true;
    };
    
    if (selectedRecordings.size == 2) {
      displayEdit = false
    } 

    this.setState({
      selectedRecordings: selectedRecordings,
      displayDelete: displayDelete,
      displayEdit: displayEdit,
      displayShare: displayShare
    });
  }

  render() { 

    const {navigate} = this.props;

    return(
      <View style={styles.toolBar}>
        <ToolBarButton show={this.state.displayEdit} 
          iconName='pencil' onPress={ () => navigate('Edit', { recording: this.state.selectedRecordings.first()})}/>
        <ToolBarButton show={this.state.displayDelete}
           iconName='delete' />
        <ToolBarButton show={this.state.displayShare}
          iconName='share' />
        <PopupMenu actions={['List view', 'Grid view']}
                    onPress={ () => console.log("yo yo")} />
      </View>
    );
  }

}

const styles = StyleSheet.create({

    toolBar: {
      backgroundColor: '#1B5E20',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
});


ToolBar.propTypes = {
  recordings: PropTypes.instanceOf(List),
  navigate: PropTypes.func.isRequired
}

export default ToolBar;



