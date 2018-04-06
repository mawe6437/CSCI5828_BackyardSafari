var mongoose = require('mongoose');
var Schema = mongoose.Schema;

detailSchema = new Schema( {
	unique_id:Number,
	Name: String,
	image1:String,
	added_date:{
		type: Date,
		default: Date.now
	}
}),
Detail = mongoose.model('images', detailSchema);

module.exports = Detail;