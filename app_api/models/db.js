var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/Loc8r';
if(process.env.NODE_ENV === 'production'){
  dbURI = process.env.MONGODB_URI;
}

mongoose.connect(dbURI, { useNewUrlParser: true });

//#region Connection event handlers
mongoose.connection.on('connected', function () {
console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
console.log('Mongoose disconnected');
});
//#endregion

//Function to shutdown the db connection
var gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
};

//#region Node process events 
//nodemon will fire 'SIGUSR2' in the sys for
process.once('SIGUSR2', function () {
    gracefulShutdown('nodemon restart', function () {
      process.kill(process.pid, 'SIGUSR2');
  });
});

//'SIGINT' will be fired when the app is closed
//But it's only for Linux sys(including OS X), for window
//We need a emulator using readline
process.on('SIGINT', function () {
    gracefulShutdown('app termination', function () {
      process.exit(0);
  });
});

//Obviously, for heroku sys process termination signals
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app shutdown', function () {
      process.exit(0);
  });
});

//#endregion

require('./location');