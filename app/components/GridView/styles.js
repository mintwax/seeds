
const React = require('react-native');
const { StyleSheet } = React;

module.exports = StyleSheet.create({

  grid: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  gridItem: {
       backgroundColor: '#CCC',
        margin: 10,
        // width: 100,
        height: 70,
        paddingTop: 5,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
        borderRadius: 10,
  },

  gridName: {
    fontSize: 12,
    color: '#777'
  },
  
  gridDuration: {
    color: '#000',
    fontSize: 12,
    fontWeight: '300'
  }
});