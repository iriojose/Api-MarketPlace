const express = require('express'); 
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const dbc = require('../database');

//ruta que trae a todos los usuarios
router.get('/usuarios', (req,res ) => {
    dbc.query('SELECT * FROM usuarios', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//ruta que trae a un usuario especifico
router.get('/usuarios/:id', (req,res) => {
    const {id} = req.params;
    dbc.query('SELECT * FROM usuarios WHERE id = ?',[id], (err,rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            res.json({Status:'algo salio mal'});
        }
    });
});

//ruta para añadir
router.post('/usuarios', (req, res) => {
    const { name , email,password} = req.body;

    //no se por que no funciona la query1 gg
    const query = 'CALL usuariosAddOrEdit(?,?,?)';
    const query2 = 'INSERT INTO usuarios(name,email,password) VALUES(?,?,?)'

    dbc.query( query2 , [name , email , password] , (err, rows , fields) => {
        if(!err){
            res.json({Status : 'usuario agregado'});
        }else{
            console.log(err);
        }
    });
});

//ruta para actualizar || arreglar la query gg
router.put('/usuarios/:id/edit', (req, res) => {
    const {name , descripcion} = req.body;
    const {id} = req.params;
    const query = 'CALL usuariosAddOrEdit(?,?,?)';
    
    const query2 = 'UPDATE usuarios(name,descripcion) VALUES(?,?)';

    dbc.query(query, [id,name,descripcion] , (err,rows,fields) => {
        if(!err){
            res.json({Status : 'usuario actualizado'});
        }else{
            console.log(err);
        }
    })

});

//ruta para eliminar
router.delete('/usuarios/:id/delete', (req,res) => {
    const {id} = req.body;
    const query = 'DELETE FROM usuarios WHERE id = ?'

    dbc.query(query,[id], (err,rows,fields) => {
        if(!err){
            res.json({Status : 'usuario eliminado'});
        }else{
            console.log(err);
        }
    })
});

//auth route de prueba
router.post('/auth', (req,res) => {
    const {email, password} = req.body;
    const query = "SELECT * FROM usuarios WHERE email = ? AND password = ?";

    if(email && password){
        dbc.query(query, [email, password] , (err,rows,fields) => {
            if(rows.length > 0){
                req.session.loggedin = true;
                req.session.username = email;
                res.json({usuario:req.session.username, loggin:req.session.loggedin});
            }else{
                res.json({Status: 'sus datos no se encontraron'});
            }
        })
    }else{
        res.json({Status:'ingrese email y password'});
    }
       
});

//redireccionamiento //esto es estupido XD 
router.get('/home' ,(req,res) => {
    if(req.session.loggedin === undefined){
        res.json({Status: req.session.username});
    }else{
        res.json({Status:'no ha iniciado session'});
    }
});

module.exports = router;