import Toast from '../../lib/toast'
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
} from 'react-native';

import { Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Map, fromJS} from 'immutable';

class EditScreen extends Component {
  
  static navigationOptions = {
    title: 'Edit',
    header: ({state, setParams}) => {
      
      return {
        style: {
          backgroundColor: '#1B5E20',
        },

        titleStyle: {
          fontWeight: '100',
          color: 'white'
        },  
      }
    },
  };

  static propTypes = {
    requestPlayRecording: PropTypes.func.isRequired,
    updateRecording: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props); 

    const {state} = this.props.navigation;
    const editableRecording = state.params.recording.toJS();

    this.state = {
      editableRecording: editableRecording
    }

    this._saveRecording = this._saveRecording.bind(this);
  }

  componentWillReceiveProps() {
    const {state} = this.props.navigation;
    const editableRecording = state.params.recording.toJS();

    this.setState({
      editableRecording: editableRecording
    });
  }

  _saveRecording() {
    this.props.updateRecording(fromJS(this.state.editableRecording));
    this.props.clearAllSelected();
    this.props.navigation.goBack();
  }

  render() {
    
    return (
      <View style={styles.container}>
        <TextInput
          style={{height: 40}}
          placeholder=""
          onChangeText={(text) => this.setState({
              editableRecording: Object.assign({}, this.state.editableRecording, {
                name: text
              })
            })
          }
          value={this.state.editableRecording.name} 
        />
        <Button iconLeft light
          onPress={this._saveRecording}>
            <Icon name="content-save" size={30} color="blue" />
            <Text>Save</Text>
        </Button>

     
      </View>
    );
  }
}
 
const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },

});

export default EditScreen;
