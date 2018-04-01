var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

const configuretoken = "1";

router.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  if(req.method=="OPTIONS") res.send(200);
  else  next();
});


router.get('/bangumi',function(req,res,next){
  var bangumiData = require('../bangumi');
  res.jsonp(bangumiData)
})

router.get('/hitokoto',function(req,res,next){
  var hitokotoData = require('../jsondata/hitokoto');
  function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
      case 1: 
        return parseInt(Math.random()*minNum+1,10); 
        break; 
      case 2: 
        return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
      default: 
        return 0; 
        break; 
    } 
  }
  var SubHitokoto=0;
  for(var b in hitokotoData){
     if(hitokotoData[b].id){
      SubHitokoto =SubHitokoto+1;
     }  
  }
  var HtokotoId = randomNum(0,SubHitokoto);
  res.jsonp({ hitokoto : unescape(hitokotoData[HtokotoId].hitokoto.replace(/\\u/g, '%u')) , catname:unescape(hitokotoData[HtokotoId].catname.replace(/\\u/g, '%u')) })
});



module.exports = router;
