const mysql = require('mysql');

const dbc = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'api'
});

dbc.connect(function(err){
    if(err){
        console.log('error papu');
        return
    }else{
        console.log('conectado correctamente');
    }
});

module.exports = dbc;

