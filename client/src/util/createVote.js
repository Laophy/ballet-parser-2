export default function Vote(round, vote, id){
    this.round = round;
    this.vote = vote;
    this.id = id;

    this.getRound = () =>{
        return this.round;
    }
    this.getVote = () =>{
        return this.vote;
    }
    this.getId = () =>{
        return this.id;
    }
};