var mongoose = require('mongoose');

var mongoURL = 'mongodb://localhost:27017/CMM';

mongoose.connect(mongoURL, null, function() {
    console.log('connected');
});

var Schema = mongoose.Schema;
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function(callback) {
    console.log('Successfully Connected to Local MongoDB');
});


var TaskSchema = new Schema({
    text: String,
    isDone: Boolean,
    addedDate: {
        type: Date,
        default: Date.now
    },
});

var Task = mongoose.model('Task', TaskSchema);


var UserSchema = new Schema({
    username: String,
    password: String
});

var User = mongoose.model('User', UserSchema);


module.exports = {
    Task: Task,
    User: User,
    mongoose: mongoose
};
