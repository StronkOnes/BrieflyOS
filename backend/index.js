const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
  console.log(`Access it via: http://localhost:${port} or http://<YOUR_IP_ADDRESS>:${port}`);
});