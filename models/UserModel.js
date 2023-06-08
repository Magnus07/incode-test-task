var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  parent: { type: Schema.Types.ObjectId, ref: "User" },
  subordinates: [
    { type: Schema.Types.ObjectId, ref: "User", autopopulate: true },
  ],
});

UserSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("User", UserSchema);
