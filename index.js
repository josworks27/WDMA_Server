const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Router 가져오기
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const authRouter = require('./routes/auth');
const forgotRouter = require('./routes/forgot');
const dressRouter = require('./routes/dress');
const chatRouter = require('./routes/chat');
const userRouter = require('./routes/user');
const storeRouter = require('./routes/store');

// Middleware 세팅
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Router 분기하기
app.get('/', (req, res) => res.send('Hello WDMA!'));

app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use('/auth', authRouter);
app.use('/forgot', forgotRouter);
app.use('/dresses', dressRouter);
app.use('/chat', chatRouter);
app.use('/users', userRouter);
app.use('/store', storeRouter);

app.listen(PORT, () =>
  console.log(`WDMA app listening at http://localhost:${PORT}`)
);
