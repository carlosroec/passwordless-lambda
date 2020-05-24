const mongoose = require("mongoose");

const CodeSchema = new mongoose.Schema({
    email: String,
    code: String
});

mongoose.model("Code", CodeSchema);

module.exports = mongoose.model("Code");
