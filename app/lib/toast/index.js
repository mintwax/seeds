import {
    ToastAndroid
} from 'react-native';

(function() {
  
  function toast(msg) {
    ToastAndroid.showWithGravity(msg,
          ToastAndroid.SHORT, 
          ToastAndroid.CENTER);
  }

  module.exports = toast;
})()
