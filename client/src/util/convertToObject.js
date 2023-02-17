import { Ballet } from "./ballets";

// Converts the array of json into an array of vote objects ./vote
export default function convertToObj(arr) {
    const newArr = [];
    for (let vote of arr) {
        newArr.push(new Ballet(vote['First Choice'], vote['Second Choice'], vote['Third Choice'], vote['VoterID']))
    }

    return newArr;
}