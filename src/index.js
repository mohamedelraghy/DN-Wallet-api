const express = require('express');
const app = express();


require('./startup/logging')();
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app);
require('./startup/routes')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));