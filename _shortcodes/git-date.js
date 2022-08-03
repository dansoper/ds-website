const moment = require('moment');

async function gitLastCommitDate() {
    const git = require('git-last-commit');
    return new Promise((resolve, reject) => {
        git.getLastCommit(function(err, commit) {
            if (err != null) reject(err);
            const d = new Date(Number(commit.committedOn + "000"));
            const str = moment(d).format("dddd Do MMMM YYYY HH:mm");
            resolve(str);
        });
    });
}
  
module.exports = gitLastCommitDate;
