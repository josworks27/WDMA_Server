const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// router 가져오기
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');

// middleware 세팅
app.use(compression());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(morgan('dev'));

// Router 분기하기
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);

app.listen(app.get('port'), () =>
  console.log(`WDMA app listening at http://localhost:${PORT}`)
);
