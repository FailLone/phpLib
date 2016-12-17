import {map} from 'lodash';
import {message} from 'antd';
// ------------------------------------
// Constants
// ------------------------------------
export const GET_CONFIG = 'GET_CONFIG';

// ------------------------------------
// Actions
// ------------------------------------

export function get(value) {
  return {
    type: GET_CONFIG,
    payload: value
  };
}

export const fetchGetConfig = () => (dispatch, getState) => {
  return fetch('/getconfig.php').then(data => data.json()).then(text => dispatch(get(text.data)));
};

export const fetchSetConfig = (value) => (dispatch, getState) => {
  return fetch('/setconfig.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: map(value, (v, k) => k + '=' + (v || '')).join('&')
  }).then((res) => {
    if (res.ok && res.status === 200 && res.json().errmsg === 'success') {
      message.success('配置成功！');
      fetchGetConfig();
    }
  });
};

export const actions = {
  get
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_CONFIG]: (state, action) => {
    return {...state, config: action.payload};
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  config: {}
};
export default function elapseReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
