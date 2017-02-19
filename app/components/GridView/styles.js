
const React = require('react-native');
const { StyleSheet } = React;

module.exports = StyleSheet.create({

  grid: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1
    // backgroundColor: 'tan',
  },

  gridItem: {
       backgroundColor: '#CCC',
        marginLeft: 5,
        marginTop: 5,
        // width: 100,
        height: 70,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
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
  },

  gridCreated: {
    color: '#777',
    fontSize: 12,
  }
});