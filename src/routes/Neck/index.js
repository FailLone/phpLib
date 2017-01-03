import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: '/',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const Neck = require('./container/Neck.js').default;
      const reducer = require('./modules/toolbar').default;
      injectReducer(store, { key: 'toolbar', reducer });
      cb(null, Neck);
    });
  }
})
;
