// Converts the array of ballets into an array of arrays of votes
export default function convertVote(arr) {
    //arr[0] == first second third id

    let firstVotes = [];
    let secondVotes = [];
    let thirdVotes = [];

    // For ballet of ballet array
    arr.forEach(i => {
        firstVotes.push({"first": i.getFirst(), "id": i.getVote()})
        secondVotes.push({"second": i.getSecond(), "id": i.getVote()})
        thirdVotes.push({"third": i.getThird(), "id": i.getVote()})
    });

    // Return the combined votes
    return [...firstVotes, ...secondVotes, ...thirdVotes]
}