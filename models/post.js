var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema(
    {
        title: {type: String, required: true},
        content: {type: String, required: true},
        date: {type: Date, required: true},
        author: {type: Schema.Types.ObjectId, ref: "Account", required: true},
        index: {type: Number, required: true}
    }
);

module.exports = mongoose.model ("Post", PostSchema);