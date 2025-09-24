const customExpress = require('./config/customExpress')

const app = customExpress()

//configurando server.js
app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});










