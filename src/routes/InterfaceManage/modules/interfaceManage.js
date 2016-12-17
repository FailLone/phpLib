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
  getAbnormal
};

export const fetchGetNormal = () => (dispatch, getState) => {
  return fetch('http://10.194.217.43:8067/data.php?normal').then(data => data.json()).then(text => dispatch(getNormal(text.data)));
};

export const fetchGetAbnormal = () => (dispatch, getState) => {
  return fetch('http://10.194.217.43:8067/data.php?abnormal').then(data => data.json()).then(text => dispatch(getAbnormal(text.data)));
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_NORMAL]: (state, action) => {
    return {...state, normal: action.payload};
  },
  [GET_ABNORMAL]: (state, action) => {
    return {...state, abnormal: action.payload};
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  normal: {},
  abnormal: {}
};
export default function elapseReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
