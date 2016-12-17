import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'interfaceManage',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const InterfaceManage = require('./containers/InterfaceManage.js').default
      const reducer = require('./modules/interfaceManage').default
      injectReducer(store, { key: 'interfaceManage', reducer })
      cb(null, InterfaceManage)
    })
  }
})
