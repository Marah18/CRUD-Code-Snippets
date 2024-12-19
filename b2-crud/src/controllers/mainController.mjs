import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import userRoute from '../route/userRoute.mjs';
import snippetRoute from '../route/snippetRoute.mjs';

// The main controller that imports the routers 
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://ma226gw:marah12345..@crud.r33emb2.mongodb.net/Node-API?retryWrites=true&w=majority&appName=crud' })
}));

app.use(flash());


app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.set('view engine', 'ejs');
app.use(express.static("public"))

app.use('/', userRoute);
app.use('/', snippetRoute);

export default app ;


