
const React = require('react-native');
const { StyleSheet } = React;

module.exports = StyleSheet.create({

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