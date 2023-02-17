// Object to hold a given vote and its data
export function Ballet(first, second, third, voterid) {
    this.first = first;
    this.second = second;
    this.third = third;
    this.voterID = parseInt(voterid);


    // Get first option
    this.getFirst = () => {
        return this.first;
    }

    // Get second option
    this.getSecond = () => {
        return this.second;
    }

    // Get third option
    this.getThird = () => {
        return this.third;
    }

    // Get vote
    this.getVote = () => {
        return this.voterID;
    }

    return this;
}