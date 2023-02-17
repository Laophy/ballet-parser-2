import Vote from "./createVote";

// Converts the array of ballets into an array of arrays of votes
export default function convertVote(arr) {
    let firstVotes = [];  // All first votes {"first": john, "ID": 1000}
    let secondVotes = []; // ...
    let thirdVotes = [];  // ...

    // For every ballet push all three votes into their own object array
    arr.forEach(i => {
        firstVotes.push(createVoteObj("first", i.getFirst(), i.getVote()))
        secondVotes.push(createVoteObj("second", i.getSecond(), i.getVote()))
        thirdVotes.push(createVoteObj("third", i.getThird(), i.getVote()))
    });

    // Return the combined votes
    return [...firstVotes, ...secondVotes, ...thirdVotes]
}

const createVoteObj = (round, vote, id) => {
    return new Vote(round, vote, id);
}