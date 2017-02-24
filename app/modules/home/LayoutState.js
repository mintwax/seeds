import {LISTLAYOUT} from '../../constants'


// Actions 
const SET_LAYOUT = 'RecordingState/SET_LAYOUT';

// Action creator
export function setLayout(layoutType) {
  return {
    type: SET_LAYOUT,
    layoutType: layoutType
  };
}

// Reducer
const layout = (state = LISTLAYOUT.GRID, action) => {
  switch (action.type) {
    case SET_LAYOUT: 
      return action.layoutType
    default:
      return state
  }
}
 
 export default layout;