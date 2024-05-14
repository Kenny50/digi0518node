const express = require('express');
const app = express();
require('dotenv').config()
const bodyParser = require('body-parser');
const storyRouter = require('./route/storyRouter');
const attractionsRouter = require('./route/attractionsRouter');
const crawlerRouter = require('./route/crawlerRouter');
const chatRouter = require('./route/chatRouter');
const formRouter = require('./route/formRouter');
const summaryRouter = require('./route/summaryRouter');
//todo 平行時空
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

storyRouter(app)
attractionsRouter(app)
crawlerRouter(app)
chatRouter(app)
formRouter(app)
summaryRouter(app)

const port = 9000;
const host = '0.0.0.0';
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});
