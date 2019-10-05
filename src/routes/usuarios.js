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
    const {id , name , descripcion} = req.body;

    //no se por que no funciona la query1 gg
    const query = 'CALL usuariosAddOrEdit(?,?,?)';
    const query2 = 'INSERT INTO usuarios(id,name,descripcion) VALUES(?,?,?)'

    dbc.query( query2 , [id, name , descripcion] , (err, rows , fields) => {
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
    const {id, name} = req.body;
    const query = "SELECT * FROM usuarios WHERE id = ? AND name = ?";

    if(id && name){
        dbc.query(query, [id,name] , (err,rows,fields) => {
            if(rows.length > 0){
                req.session.loggedin = true;
                req.session.username = name;
                res.json({Status:req.session.username+' ' + req.session.loggedin});
            }else{
                res.json({Status: 'sus datos no se encontraron'});
            }
        })
    }else{
        res.json({Status:'ingrese id y name'});
    }
       
});

//redireccionamiento
router.get('/home' ,(req,res) => {
    if(req.session.loggedin === undefined){
        res.json({Status: req.session.username});
    }else{
        res.json({Status:'no ha iniciado session'});
    }
});

module.exports = router;