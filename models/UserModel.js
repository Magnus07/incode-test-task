var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  password: String,
  subordinates: Array,
  salt: String,
});

UserSchema.plugin(require("mongoose-role"), {
  roles: ["public", "boss", "user", "admin"],
  accessLevels: {
    public: ["public", "user", "admin"],
    anon: ["public"],
    user: ["user", "admin", "boss"],
    boss: ["admin", "boss"],
    admin: ["admin"],
  },
});

module.exports = mongoose.model("User", UserSchema);
