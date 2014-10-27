var io;

module.exports = {
    listen: listen,
    questionAdded: questionAdded,
    questionDeleted: questionDeleted,
    voteAdded: voteAdded
};

//////////

function listen(server){
    io = require('socket.io')(server);
    module.exports.listen = function(){}; // only listen once
}

function questionAdded(question) {
    io.sockets.emit('questionAdded', question);
    console.log('Notifier#questionAdded: '+question._id);
}

function questionDeleted(question) {
    io.sockets.emit('questionDeleted', question._id);
    console.log('Notifier#questionDeleted: '+question._id);
}

function voteAdded(question){
    var msg = {
        qid: question._id,
        voteCount: question.voteCount,
        vote: question.votes[question.votes.length - 1]
    };

    io.sockets.emit('voteAdded', msg);
    console.log('Notifier#voteAdded: '+JSON.stringify(msg));
}