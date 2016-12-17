import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'config',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Config = require('./containers/Config').default
      const reducer = require('./modules/config').default
      injectReducer(store, { key: 'config', reducer })
      cb(null, Config)
    })
  }
})
