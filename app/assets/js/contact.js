var email   = require("emailjs");

var server  = email.server.connect({
   user:    "mvrt@mvrt.com",
   password:"mvrt115",
   host:    "smtp.secureserver.net",
   tls: {ciphers: "SSLv3"}
});

var message = {
   text:    document.getElementById('usermessage').value;,
   from:    document.getElementById('name').value + " " + <document.getElementById('useremail').value>,
   to:      "MVRT <mvrt@mvrt.com>",
   subject: subject,
};

function email() {
  server.send(message, function(err, message) { console.log(err || message); });
}
