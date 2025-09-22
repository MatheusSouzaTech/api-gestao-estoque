const express = require('express');
const consign = require('consign');
const app = express();

app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
});

consign()
    .include('controllers')
    .into(app)
    

