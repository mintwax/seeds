
import moment from 'moment'

module.exports = [ { 
    name: "recording-6 long name with spaces that overflows out of boundary", 
    duration: 2, 
    created: moment().add(1, 'days'),
    recordingPath: '/dummy/path/sound.acc' 
  }, { 
    name: "recording-50", 
    duration: 20, 
    created: moment().add(2, 'days').add(3, 'hours').add(5, 'seconds'),
    recordingPath: '/dummy/path/sound.acc' 
  }, { 
    name: "recording-5", 
    duration: 20, 
    created: moment().add(2, 'days').add(3, 'hours').add(30, 'seconds'),
    recordingPath: '/dummy/path/sound.acc' 
  }, { 
    name: "", 
    duration: 15, 
    created: moment().add(2, 'days').add(3, 'hours').add(30, 'seconds'),
    recordingPath: '/dummy/path/sound.acc' 
  }, { 
    name: "", 
    duration: 7, 
    created: moment().add(2, 'days').add(3, 'hours').add(30, 'seconds'),
    recordingPath: '/dummy/path/sound.acc' 
  }, { 
    name: "recording-37", 
    duration: 200, 
    created: moment().add(2, 'days').add(17, 'hours').add(30, 'seconds'),
    recordingPath: '/dummy/path/sound.acc' 
  }, { 
    name: "songs for jujubee", 
    duration: 100, 
    created: moment().add(12, 'days').add(3, 'hours').add(30, 'seconds'),
    recordingPath: '/dummy/path/sound.acc' 
  }, { 
    name: "jungle bells", 
    duration: 70, 
    created: moment().add(22, 'days').add(3, 'hours').add(30, 'seconds'),
    recordingPath: '/dummy/path/sound.acc' 
  }, { 
    name: "kfc is what its all about", 
    duration: 17, 
    created: moment().add(102, 'days').add(8, 'hours').add(3, 'seconds'),
    recordingPath: '/dummy/path/sound.acc' 
  }, { 
    name: "recording-16", 
    duration: 6, 
    created: moment().add(222, 'days').add(18, 'hours').add(2, 'seconds'),
    recordingPath: '/dummy/path/sound.acc' 
  }, { 
    name: "recording-37", 
    duration: 7, 
    created: moment().add(1000, 'days').add(80, 'hours').add(13, 'seconds'),
    recordingPath: '/dummy/path/sound.acc' 
  }, { 
    name: "recording-20", 
    duration: 4.6, 
    created: moment().add(2, 'years').add(8, 'hours').add(9, 'seconds'),
    recordingPath: '/dummy/path/sound.acc' 
  }
]