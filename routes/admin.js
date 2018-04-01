var express = require('express');
var path = require('path');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var sess = req.session;
  var loginUser = sess.loginUser;
  var isLogined = !!loginUser;
   if(isLogined){
    res.sendFile(path.resolve('views/admin.html' ));
   }else{
    res.redirect('/auth/login')
   }
});

module.exports = router;