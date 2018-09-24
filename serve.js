var express = require('express');
var cors = require('cors');
var path = require('path');
var uuid  = require('uuid/v4');
var bodyParser = require('body-parser');

var list = [];

var app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/api/login', (req, res) => {
  if (req.body.username !== 'admin' || req.body.password !== 'admin') {
    res.status(401);
    res.send('Unauthorized');
    return;
  }
  let token = uuid((new Date()).valueOf().toString());
  res.set({
    'Token': 'Bearer ' + token,
  })
  res.send({success:true});
});

app.post('/api/objects', (req, res) => {
  let id = uuid((new Date()).valueOf().toString());
  let obj = { id : id }
  let keys = Object.keys(req.body);
  for (var i in keys) {
    obj[keys[i]] = req.body[keys[i]];
  }
  list.push(obj);
  res.send({lastInsertId:obj.id});
});

/* multipart
app.post('/api/multipart-objects', multipartObjPost.none(), (req, res) => {
  console.log(req.body);
  let id = uuid((new Date()).valueOf().toString());
  let obj = { id : id }
  let keys = Object.keys(req.body);
  for (var i in keys) {
    obj[keys[i]] = req.body[keys[i]];
  }
  list.push(obj);
  res.send({lastInsertId:obj.id});
});
 * */

app.get('/api/objects', (req, res) => {
  res.send(list);
});

app.get('/api/object/:id', (req, res) => {
  let obj = {}
  let index = null;
  for (let i in list) {
    if (req.params.id === list[i].id) {
      index = i;
      obj = list[i];
      break;
    }
  }
  if (index === null) {
    res.status(404);
    res.send('Not found');
    return;
  }
  res.send(obj);
});

app.put('/api/object/:id', (req, res) => {
  let obj = {}
  let index = null;
  for (let i in list) {
    if (req.params.id === list[i].id) {
      index = i;
      obj = list[i];
      break;
    }
  }
  if (index === null) {
    res.status(404);
    res.send('Not found');
  }
  let keys = Object.keys(req.body);
  for (var i in keys) {
    obj[keys[i]] = req.body[keys[i]];
  }
  list.splice(index,1);
  list.push(obj);
  res.send(obj);
});

app.delete('/api/object/:id', (req, res) => {
  let index = null;
  for (let i in list) {
    if (req.params.id === list[i].id) {
      index = i;
      break;
    }
  }
  if (index === null) {
    res.status(404);
    res.send('Not found');
    return;
  }
  list.splice(index,1);
  res.send({success:true});
});

app.listen(3000);
console.log('Running on localhost:3000');
