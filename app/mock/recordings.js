import {List, Map} from 'immutable';
import moment from 'moment'

module.exports = List([ Map({ 
    name: "recording-6 long name with spaces that overflows out of boundary", 
    duration: 2, 
    created: moment().add(1, 'days').valueOf(),
    path: '/dummy/path/sound1.acc' 
  }), Map({ 
    name: "recording-50", 
    duration: 20, 
    created: moment().add(2, 'days').add(3, 'hours').add(5, 'seconds').valueOf(),
    path: '/dummy/path/sound2.acc' 
  })
  // }), Map({ 
  //   name: "recording-5", 
  //   duration: 20, 
  //   created: moment().add(2, 'days').add(3, 'hours').add(30, 'seconds').valueOf(),
  //   path: '/dummy/path/sound3.acc' 
  // }), Map({ 
  //   name: "", 
  //   duration: 15, 
  //   created: moment().add(2, 'days').add(3, 'hours').add(30, 'seconds').valueOf(),
  //   path: '/dummy/path/sound4.acc' 
  // }), Map({ 
  //   name: "", 
  //   duration: 7, 
  //   created: moment().add(2, 'days').add(3, 'hours').add(30, 'seconds').valueOf(),
  //   path: '/dummy/path/sound5.acc' 
  // }), Map({ 
  //   name: "recording-37", 
  //   duration: 200, 
  //   created: moment().add(2, 'days').add(17, 'hours').add(30, 'seconds').valueOf(),
  //   path: '/dummy/path/sound6.acc' 
  // }), Map({ 
  //   name: "songs for jujubee", 
  //   duration: 100, 
  //   created: moment().add(12, 'days').add(3, 'hours').add(30, 'seconds').valueOf(),
  //   path: '/dummy/path/sound7.acc' 
  // }), Map({ 
  //   name: "jungle bells", 
  //   duration: 70, 
  //   created: moment().add(22, 'days').add(3, 'hours').add(30, 'seconds').valueOf(),
  //   path: '/dummy/path/sound8.acc' 
  // }), Map({ 
  //   name: "kfc is what its all about", 
  //   duration: 17, 
  //   created: moment().add(102, 'days').add(8, 'hours').add(3, 'seconds').valueOf(),
  //   path: '/dummy/path/sound9.acc' 
  // }), Map({ 
  //   name: "recording-16", 
  //   duration: 6, 
  //   created: moment().add(222, 'days').add(18, 'hours').add(2, 'seconds').valueOf(),
  //   path: '/dummy/path/sound10.acc' 
  // }), Map({ 
  //   name: "recording-37", 
  //   duration: 7, 
  //   created: moment().add(1000, 'days').add(80, 'hours').add(13, 'seconds').valueOf(),
  //   path: '/dummy/path/sound11.acc' 
  // }), Map({ 
  //   name: "recording-20", 
  //   duration: 4.6, 
  //   created: moment().add(2, 'years').add(8, 'hours').add(9, 'seconds').valueOf(),
  //   path: '/dummy/path/sound12.acc' 
  // })
])

