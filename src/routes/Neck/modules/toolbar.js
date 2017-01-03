import {map, cloneDeep} from 'lodash';
import {message} from 'antd';
// ------------------------------------
// Constants
// ------------------------------------
export const GET_CONFIG_DATA = 'GET_CONFIG_DATA';
export const GET_PATH_DATA = 'GET_PATH_DATA';
export const SET_PATH_PARAMS = 'SET_PATH_PARAMS';
export const UPDATE_LOADING = 'UPDATE_LOADING';
export const UPDATE_TIME_LOADING = 'UPDATE_TIME_LOADING';
export const GET_TIME_DATA = 'GET_TIME_DATA';
// ------------------------------------
// Actions
// ------------------------------------

export function getConfigData(value) {
  return {
    type: GET_CONFIG_DATA,
    payload: value
  };
}

export function getPathData(value) {
  return {
    type: GET_PATH_DATA,
    payload: value
  };
}

export function getTimeData(value, id) {
  return {
    type: GET_TIME_DATA,
    payload: {
      value, id
    }
  };
}

export function setPathParams(value) {
  return {
    type: SET_PATH_PARAMS,
    payload: value
  };
}

export function updateLoading(value) {
  return {
    type: UPDATE_LOADING,
    payload: value
  };
}

export function updateTimeLoading(value) {
  return {
    type: UPDATE_TIME_LOADING,
    payload: value
  };
}

export const actions = {
  getConfigData
};

export const fetchGetConfigData = () => (dispatch, getState) => {
  return fetch('/apilog/getconditiondata').then(data => data.json()).then(text => dispatch(getConfigData(text)));
};

export const fetchGetPathData = (params) => (dispatch, getState) => {
  dispatch(updateLoading(true));
  return fetch('/apilog/getapipaths', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: map(params, (v, k) => k + '=' + (v || '')).join('&')
  }).then(data => {
    dispatch(updateLoading(false));
    if (data.ok) {
      data.json().then(text => {
        dispatch(getPathData(text));
      });
    } else {
      message.error(data.statusText);
    }
  });
};

export const getTime = (params) => (dispatch, getState) => {
  dispatch(updateTimeLoading(true));
  return fetch('/apilog/getlogdetail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: map(params, (v, k) => k + '=' + (v || '')).join('&')
  }).then(data => {
    dispatch(updateTimeLoading(false));
    if (data.ok) {
      data.json().then(text => {
        dispatch(getTimeData(text, params.id));
      });
    } else {
      message.error(data.statusText);
    }
  });
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_CONFIG_DATA]: (state, action) => {
    return {...state, data: action.payload};
  },
  [GET_PATH_DATA]: (state, action) => {
    return {...state, paths: action.payload};
  },
  [GET_TIME_DATA]: (state, action) => {
    return {...state, times: {...state.times, [action.payload.id]: action.payload.value}};
  },
  [SET_PATH_PARAMS]: (state, action) => {
    return {...state, params: action.payload};
  },
  [UPDATE_LOADING]: (state, action) => {
    return {...state, loading: action.payload};
  },
  [UPDATE_TIME_LOADING]: (state, action) => {
    return {...state, timeLoading: action.payload};
  }
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  data: [],
  times: {},
  paths: {},
  params: {},
  loading: false,
  timeLoading: false
};
export default function elapseReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
