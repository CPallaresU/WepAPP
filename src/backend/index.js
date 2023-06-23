//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================
app.post('/device/',async function(req,res){
   
    const query= 'INSERT INTO Devices (name, description, state, type) VALUES (?, ?, ?, ?)';
    const values = [req.body.name, req.body.description,req.body.state,req.body.type];
    utils.query(query,values, function(err,rsp){
        if(err != null){
            res.send(err).status(409);
        }else{
            res.send(JSON.stringify(rsp)).status(200);
        }
    });
});
app.patch('/device/', function(req,res){
    const query= 'UPDATE Devices SET name=?, description=?, state=?, type=? WHERE id = ?';
    const values = [req.body.name, req.body.description,req.body.state,req.body.type,req.body.id];
    utils.query(query,values, function(err,rsp){
        if(err != null){
            res.send(err).status(409);
        }else{
            res.send("Dispositivo editado con exito").status(200);
        }
    });
});
app.delete('/device/', function(req,res){
    const query= 'DELETE FROM Devices WHERE id = ? ';
    const value = [req.body.id];
    utils.query(query,value, function(err,rsp){
        if(err != null){
            res.send(err).status(409);
        }else{
            res.send("Registro Borrado Exitosamente").status(200);
        }
    });
});
app.get('/device/', function(req, res, next) {
    utils.query("select * from Devices",function(err,rsp){
        if(rsp!=null){
            res.send(JSON.stringify(rsp)).status(200);
        }else{
            res.send(err).status(400);
        }
    });
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
