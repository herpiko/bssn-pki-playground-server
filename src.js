const axios = require('axios');

var login = function() {
  axios.post('http://localhost:3000/oauth/token',
    { username : 'admin', password : 'admin' })
  .then(function(result){
    document.getElementById("tokenAccess").innerHTML = result.data.access_token;
    console.log(document.getElementById("tokenAccess").innerHTML);
  })
  .catch(function(err) {
    console.log(err);
    alert('failed to login');
  });
}

var generateAndSendCSR = function() {
  var extid = document.getElementById('extid').value;
  var tokenAccess = document.getElementById("tokenAccess").innerHTML;
  var tokenCSR = document.getElementById("tokenCSR").value;
  var passphrase = document.getElementById("passphrase").value;
  chrome.runtime.sendMessage(extid, {action:'generateAndSendCSR', tokenAccess : tokenAccess, tokenCSR : tokenCSR, passphrase : passphrase }, function(response) {
    console.log('csr request to extension has been sent');
  });
}

var downloadCertAndPackP12 = function(){
  var extid = document.getElementById('extid').value;
  var tokenAccess = document.getElementById("tokenAccess").innerHTML;
  var tokenCSR = document.getElementById("tokenCSR").value;
  var passphrase = document.getElementById("passphrase").value;
  chrome.runtime.sendMessage(extid, {action:'downloadCertAndPackP12', tokenAccess : tokenAccess, passphrase : passphrase }, function(response) {
    console.log('cert request to extension has been sent');
  });
}

window.bssn = {
  login : login,
  generateAndSendCSR : generateAndSendCSR,
  downloadCertAndPackP12 : downloadCertAndPackP12,
  
}
