const express = require('express');
const app = express();
const { Readable } = require('stream');
const {client, promptToCommand} = require('./service/bedrockClient')
require('dotenv').config()
const bodyParser = require('body-parser');
const storyRouter = require('./route/storyRouter');
const sequelize = require('./db/initDb');
//todo 平行時空
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

storyRouter(app)

const port = 9000;
const host = '0.0.0.0';
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});
