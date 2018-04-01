var express = require('express');
var useragent = require('express-useragent');
var router = express.Router();
var path = require('path');

router.use(useragent.express());

router.get('/',function(req,res,next){
  if(req.useragent.isBot){
    res.sendFile(path.resolve('hexo/public/index.html' ));
  }else{
    //res.sendFile(path.resolve('view/index.html' ));
    res.render('index');
  }
})
router.get('/css/style.css',function(req,res,next){
    res.sendFile(path.resolve('hexo/public/css/style.css'));
})
module.exports = router;
