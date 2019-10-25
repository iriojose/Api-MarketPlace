const express = require('express'); 
const router = express.Router();

const dbc = require('../database');
const helpers = require('../helpers/index');

router.get('/tiendas', async (req,res ) => {
    await dbc.query('SELECT * FROM tiendas', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

router.post('/tiendas', async (req, res) => {
   const {id,nombre, avatar,tipo} = req.body;

    const query = 'INSERT INTO tiendas(id,nombre,avatar,tipo) VALUES(?,?,?,?)';
 

    dbc.query( query , [id,nombre,avatar,tipo] , (err, rows , fields) => {
        if(!err){
            res.json({Status : 'tienda agregada'});
        }else{
            console.log(err);
        }
    });
});

router.post('/filtro', async (req,res) => {
    const {busqueda} =req.body;

    const query = 'SELECT * FROM tiendas WHERE tipo = ?';

    dbc.query(query ,[busqueda.tipo], (err,rows,fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
})

module.exports = router;