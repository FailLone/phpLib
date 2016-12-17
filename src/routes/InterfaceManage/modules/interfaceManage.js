// ------------------------------------
// Constants
// ------------------------------------
export const GET_NORMAL = 'GET_NORMAL';
export const GET_ABNORMAL = 'GET_ABNORMAL';

// ------------------------------------
// Actions
// ------------------------------------

export function getNormal(value) {
  return {
    type: GET_NORMAL,
    payload: value
  };
}

export function getAbnormal(value) {
  return {
    type: GET_ABNORMAL,
    payload: value
  };
}

export const actions = {
  getAbnormal,
  getNormal
};

export const fetchGetNormal = () => (dispatch, getState) => {
  return fetch('/data.php?normal').then(data => data.json()).then(text => dispatch(getNormal(text)));
};

export const fetchGetAbnormal = () => (dispatch, getState) => {
  return fetch('/data.php?abnormal').then(data => data.json()).then(text => dispatch(getAbnormal(text)));
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_NORMAL]: (state, action) => {
    return {...state, data: action.payload};
  },
  [GET_ABNORMAL]: (state, action) => {
    return {...state, data: action.payload};
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  data: []
};
export default function elapseReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
