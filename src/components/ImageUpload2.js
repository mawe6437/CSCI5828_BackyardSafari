var express = require('express');
var multer = require('multer'),
bodyParser = require('body-parser'),
path = require('path');
var mongoose = require('mongoose');
var Detail = require('./models/detail');
mongoose.connect('mongodb://admin:5828@ds123499.mlab.com:23499/backed_safari_db', { useMongoClient: true });


var upload = multer({storage: multer.diskStorage({

  destination: function (req, file, callback) 
  { callback(null, './uploads');},
  filename: function (req, file, callback) 
  { callback(null, file.fieldname +'-' + Date.now()+path.extname(file.originalname));}

}),

fileFilter: function(req, file, callback) {
  var ext = path.extname(file.originalname)
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return callback(/*res.end('Only images are allowed')*/ null, false)
  }
  callback(null, true)
}
});

var app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('uploads'));

app.get('/', function(req, res){
  console.log("app.get");
  Detail.find({}, function(err,data){
    if(err){
      console.log(err);
    }else{
      console.log("rendering...");
      res.render('index',{data:data});
    }
  })
  
});

app.post('/', upload.any(), function(req,res){
  
  console.log("req.body"); //form fields
  console.log(req.body);
  console.log("req.file");
  console.log(req.files); //form files
  
  if(!req.body && !req.files){
    res.json({success: false});
  } else {    
    var c;
    Detail.findOne({},function(err,data){
      console.log("into detail");

      if (data) {
        console.log("if");
        c = data.unique_id + 1;
      }else{
        c=1;
      }

      var detail = new Detail({

        unique_id:c,
        Name: req.body.title,
        image1:req.files[0].filename,
      });

      detail.save(function(err, Person){
        if(err)
          console.log(err);
        else
          res.redirect('/');

      });

    }).sort({_id: -1}).limit(1);

  }
});

app.post('/delete',function(req,res){

   Detail.findByIdAndRemove(req.body.prodId,function(err, data) {

    console.log(data);

   })
  res.redirect('/');
});

var port = 3000;
app.listen( port, function(){ console.log('listening on port '+port); } );
//export default withRouter( connect( mapStateToProps )(ImageUpload) )
