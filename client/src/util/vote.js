export function Vote(first, second, third, voterid) {
    this.first = first;
    this.second = second;
    this.third = third;
    this.voterID = parseInt(voterid);

    return this;
}