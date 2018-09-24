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
app.use(express.static('public'))

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

// BSSN API simulated
var tokenCSR = '0ea98d32-49b1-450b-9375-094160a2facc';
var tokenAccess = '796e418c-06ac-4a93-8a9a-f986b700a38e'

app.post('/oauth/token', (req, res) => {
  if (req.body.username !== 'admin' || req.body.password !== 'admin') {
    res.status(401);
    res.send('Unauthorized');
    return;
  }
  res.send({
    "access_token": tokenAccess,
    "token_type": "bearer",
    "refresh_token": "17ce397f-c775-403b-b8af-632c0673df62",
    "expires_in": 3599,
    "scope": "read write"
  });
});

app.get('/rest/client_toolkit/subject_dn/:id', (req, res) => {
  console.log(req.headers.authorization);
  if (!req.headers.authorization || (req.headers.authorization && req.headers.authorization !== tokenAccess)) {
    res.status(401);
    res.send('Unauthorized');
    return;
  }
  if (req.params.id !== tokenCSR)  {
    res.status(404);
    res.send('Not found');
    return;
  }
  res.send({
    "data": {
      "organization": "Kementerian Sekretariat Negara",
      "description": "74268352524_Tanda Tangan Digital",
      "key_length": [
          "2048"
      ],
      "subject_alt_name": "disable",
      "state": "jakarta",
      "locality": "jakarta",
      "common_name": "Seskemensetneg",
      "organization_unit": "KTLN",
      "email_address": "yusri_sm@setneg.go.id",
      "country": "ID"
    },
    "success": true
  });
});

app.post('/rest/client_toolkit/csr/:id', (req, res) => {
  console.log(req.headers.authorization);
  if (!req.headers.authorization || (req.headers.authorization && req.headers.authorization !== tokenAccess)) {
    res.status(401);
    res.send('Unauthorized');
    return;
  }
  if (req.params.id !== tokenCSR)  {
    res.status(404);
    res.send('Not found');
    return;
  }
  if (req.body.csr) {
    console.log(req.body.csr);
  }
  res.send({
    "message": "CSR berhasil dikirimkan",
    "success": true
  });
});

app.get('/rest/client_toolkit/cert/:id', (req, res) => {
  console.log(req.headers.authorization);
  if (!req.headers.authorization || (req.headers.authorization && req.headers.authorization !== tokenAccess)) {
    res.status(401);
    res.send('Unauthorized');
    return;
  }
  if (req.params.id !== tokenCSR)  {
    res.status(404);
    res.send('Not found');
    return;
  }
  res.send({
    "cert": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN1akNDQWlPZ0F3SUJBZ0lCQVRBTkJna3Foa2lHOXcwQkFRVUZBREJiTVJBd0RnWURWUVFERXdkb1pYSncKYVd0dk1Rc3dDUVlEVlFRR0V3SkpSREVMTUFrR0ExVUVDQk1DU1VReEN6QUpCZ05WQkFjVEFrbEVNUkF3RGdZRApWUVFLRXdkQ2JHRnVhMDl1TVE0d0RBWURWUVFMRXdWU2FYTmxkREFlRncweE9UQTVNalF3TmpJNE5EWmFGdzB4Ck9EQTVNalF3TmpJNE5EWmFNRnN4RURBT0JnTlZCQU1UQjJobGNuQnBhMjh4Q3pBSkJnTlZCQVlUQWtsRU1Rc3cKQ1FZRFZRUUlFd0pKUkRFTE1Ba0dBMVVFQnhNQ1NVUXhFREFPQmdOVkJBb1RCMEpzWVc1clQyNHhEakFNQmdOVgpCQXNUQlZKcGMyVjBNSUdmTUEwR0NTcUdTSWIzRFFFQkFRVUFBNEdOQURDQmlRS0JnUUNmNlgwcFQvaDUwNlNFCjg1UVgvWVowaktGdnRDOHFDNHhEbG1XYnRGdXAxeHYwM2NEQXdBcU4xTlJBZDdQbjJwZVoybWpLQ0g2Nzd4bysKZURJQXRSbVh6YWZpbjE4MnhSWUpVUFZYVVYzdXBkNUpoRys1Qi9YL0dQMlNvRGZXVlU5SytVVXM3U0JTZnZoUAp0VjE0b2pYN2dYVGdpMmZzK2F1RXcxK0Q3ZUwwTndJREFRQUJvNEdOTUlHS01Bd0dBMVVkRXdRRk1BTUJBZjh3CkN3WURWUjBQQkFRREFnTDBNRHNHQTFVZEpRUTBNRElHQ0NzR0FRVUZCd01CQmdnckJnRUZCUWNEQWdZSUt3WUIKQlFVSEF3TUdDQ3NHQVFVRkJ3TUVCZ2dyQmdFRkJRY0RDREFSQmdsZ2hrZ0JodmhDQVFFRUJBTUNBUGN3SFFZRApWUjBPQkJZRUZGNmc1WGxMeGRUSkdMZEVrZVlPMmJKaDl4WHJNQTBHQ1NxR1NJYjNEUUVCQlFVQUE0R0JBQ0R2CkJaQkZYSHpnaW1aVmVPMFhxcy82aUcxaHJvRTE3TGVwM2pKZnN4elZXOWJrUEJ2TUdVSTMrdm53U25lM2U5TzYKNmpLdlRpcU1zNmMxc2xMYkZtbU0zQXRYNUp6WGkwVHdZYlVkTnpzSGJiUHZ5Z0toaXY2OWlybzVwL3lVUGFBeAo3VjI3MXRMN0xJRm5DUloyWWtvTE9XbXA1UG43Yk42SGNBaUdoK0JhCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K",
    "success": true
  });
});

console.log('TokenCSR : ' + tokenCSR);
app.listen(3000);
console.log('Running on localhost:3000');
