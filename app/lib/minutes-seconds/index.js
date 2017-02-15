(function() {
  var moment = require('moment');

  function minutes(duration){
    return format(duration.minutes());
  }

  function seconds(duration){
    return format(duration.seconds());
  }

  function milliseconds(duration){
    return format(duration.milliseconds());
  }

  function format(duration){
    if(!duration){
      return '00';
    } else if(('' + duration).length == 1){
      return '0' + duration;
    } else if(('' + duration).length == 3){
      return ('' + duration).slice(0, 2);
    } else {
      return duration;
    }
  }

  function convert(lengthSecs) {
    if(!lengthSecs) {
      return '00:00'
    }

    var duration = moment.duration(lengthSecs * 1000);
    var formattedDuration = '';

    formattedDuration += minutes(duration) + ':';
    formattedDuration += seconds(duration);
    // formattedDuration += milliseconds(duration);

    return formattedDuration;
  }

  module.exports = convert;
})()
