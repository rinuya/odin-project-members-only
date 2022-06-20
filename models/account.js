var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AccountSchema = new Schema(
    {
        email: {type: mongoose.SchemaTypes.Email, required: true, correctTld: true},
        username: {type: String, required: true},
        password: {type: String, required: true},
        member: {type: Boolean, required: true},
    }
)

AccountSchema
.virtual("url")
.get(function(){
    return "/account/" + this._id;
});

module.exports = mongoose.model ("Account", AccountSchema);