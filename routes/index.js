var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/',function(req,res){
    var pathac = path.join(__dirname, '../index2.html');
    res.sendFile(pathac);
});
router.get('/about',(req,res) => {
    var pathac2 = path.join(__dirname, '../about.html');
    res.sendFile(pathac2);    
});
router.get('/contact',(req,res) => {
    var pathac3 = path.join(__dirname, '../contact.html');
    res.sendFile(pathac3);    
});
router.get('/blog-post',(req,res) => {
    var pathac4 = path.join(__dirname, '../blog-post.html');
    res.sendFile(pathac4);    
});
router.get('/blog-post2',(req,res) => {
    var pathac5 = path.join(__dirname, '../blog-post2.html');
    res.sendFile(pathac5);    
})
;

module.exports = router;