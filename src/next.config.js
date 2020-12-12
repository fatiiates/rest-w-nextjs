const { v4: uuidv4 } = require('uuid');

module.exports = {
    distDir: '../.next',
    env: {
      uploads: './src/assets/files/uploads/',
      SECRET_KEY: uuidv4()
    },
}
