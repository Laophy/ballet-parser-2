function onlyUnique(value, index, array) {
    if(array.indexOf(value) === index){
        if(value === ""){
            return false;
        } 
        return true
    }else{
        return false
    }
  }

// Returns only unique canidates in 3 choices
export default function getUniqueNames(votes) {
    const uniqueFirst = [...new Set(votes.map(vote => vote.getFirst()))];
    const uniqueSecond = [...new Set(votes.map(vote => vote.getSecond()))];
    const uniqueThird = [...new Set(votes.map(vote => vote.getThird()))];

    const full = [...uniqueFirst, ...uniqueSecond, ...uniqueThird];

    return full.filter(onlyUnique);
}