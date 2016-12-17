var path = require('path');

module.exports = {
    host: {
        gogo: 'http://10.194.217.43:8067',
    },

    server: {
        from: '*.php',
        mime: 'application/json'
    },

    static: {
        from: '/static/*'
    }

}
