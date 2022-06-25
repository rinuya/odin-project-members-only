const { DateTime } = require('luxon');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema(
    {
        title: {type: String, required: true},
        content: {type: String, required: true},
        date: {type: Date, required: true},
        author: {type: Schema.Types.ObjectId, ref: "Account", required: true},
    }
);

PostSchema
.virtual("shortDate")
.get(function (){
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
})

module.exports = mongoose.model ("Post", PostSchema);