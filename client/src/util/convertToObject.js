import { Vote } from "./vote";

// Converts the array of json into an array of vote objects ./vote
export default function convertToObj(arr) {
    const newArr = [];
    for (let vote of arr) {
        newArr.push(new Vote(vote['First Choice'], vote['Second Choice'], vote['Third Choice'], vote['VoterID']))
    }

    return newArr;
}