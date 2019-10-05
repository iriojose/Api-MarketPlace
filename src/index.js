
const express = require('express');
const session = require('express-session');
const app = express();

//settings
app.set('port', process.env.PORT || 3000);
    //config session
    app.use(session({
        secret: 'dont ask',
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 60000}
    }));

//middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(express.json());


//routes
app.use(require('./routes/usuarios'));

//starting server
app.listen(app.get('port') , () => {
    console.log('iniciado el servidor ' + app.get('port'));
});