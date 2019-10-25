const express = require('express'); 
const router = express.Router();

const dbc = require('../database');
const helpers = require('../helpers/index');

router.get('/users', async (req,res ) => {
    await dbc.query('SELECT * FROM users', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

router.post('/users', async (req, res) => {
   const {id,firstName, lastName,telefono,avatar,email,password,logeado} = req.body;

    //no se por que no funciona la query1 gg
    const query = 'CALL usuariosAddOrEdit(?,?,?,?,?,?,?,?)';
    const query2 = 'INSERT INTO users(id,firstName, lastName,telefono,avatar,email,password,logeado) VALUES(?,?,?,?,?,?,?,?)'
    //const salt = await bcrypt.genSalt(10);
    //password = await bcrypt.hash(password,salt);

    dbc.query( query2 , [id,firstName, lastName,telefono,avatar,email,password,logeado] , (err, rows , fields) => {
        if(!err){
            res.json({Status : 'usuario agregado'});
        }else{
            console.log(err);
        }
    });
});

//auth route de prueba
router.post('/auth2', async (req,res) => {
    const {email, password} = req.body;
    const query = "SELECT * FROM users WHERE email = ?";

    if(email && password){
        dbc.query(query, [email] , (err,rows,fields) => {
            if(rows.length > 0){ 
                if(password == rows[0].password ){
                    res.json(rows[0]);
                }else{
                    res.json({Status: 'su clave es incorrecta'});
                }
            }else{
                res.json({Status: 'sus datos no se encontraron'});
            }
        })
    }else{
        res.json({Status:'ingrese email y password'});
    }
       
});

module.exports = router;