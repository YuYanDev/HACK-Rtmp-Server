var express = require('express');
var path = require('path');
var crypto = require('crypto');
var router = express.Router();
var users = require('../jsondata/user').items;
var identityKey = 'YuYanSession';

function alculateHmac(passwd){
  var key = "laosao13391226"
  
  var hmac = crypto.createHmac('sha1', key);
  hmac.update(passwd);
  return hmac.digest('hex');
}

var findUser = function(name, password){
  return users.find(function(item){
      // return item.name === name && item.password === password;
      return item.name === name && item.password === alculateHmac(password);
  });
};

router.get('/', function(req, res, next) {
  var sess = req.session;
  var loginUser = sess.loginUser;
  var isLogined = !!loginUser;
   if(isLogined){
    res.redirect('/admin')
   }else{
    res.redirect('/auth/login')
   }
});

router.get('/login',function(req,res,next){
  res.sendFile(path.resolve('views/login.html' ));
})

router.post('/login',function(req,res,next){
  var sess = req.session;
  var user = findUser(req.body.name, req.body.password);
  if(user){
    req.session.regenerate(function(err) {
      if(err){
        return res.json({ret_code: 2, ret_msg: '登录失败'});                
      }
      req.session.loginUser = user.name;
      res.json({ret_code: 0, ret_msg: '登录成功'});                           
    });
  }else{
    res.json({ret_code: 1, ret_msg: '账号或密码错误'});
  }
})

router.post('/logout',function(req,res,next){
  req.session.destroy(function(err) {
    if(err){
      res.json({ret_code: 2, ret_msg: '退出登录失败'});
      return;
    }
    res.clearCookie(identityKey);
    res.redirect('/auth/login');
  });
})

router.get('/logout',function(req,res,next){
  req.session.destroy(function(err) {
    if(err){
      res.json({ret_code: 2, ret_msg: '退出登录失败'});
      return;
    }
    res.clearCookie(identityKey);
    res.redirect('/auth/login');
  });
})

router.get('/islogin',function(req,res,next){
  var sess = req.session;
  var loginUser = sess.loginUser;
  var isLogined = !!loginUser;
   if(isLogined){
    res.json({ret_login_status: true});
   }else{
    res.json({ret_login_status: false});
   }
})

module.exports = router;
