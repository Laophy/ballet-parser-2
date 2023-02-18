// Process the rounds given the votes array
export default function processVoteData(votes, canidates, round){
    // Process the first round of votes
    let totals = [];
    canidates.forEach(canidate => {
        totals.push({"name": canidate, "votes": 0})
    })
    let inProgress = true;
    votes.forEach((vote, index) => {
        if(vote.getRound() === round){
            // Add votes the the canidates in round 1
            if(canidates.includes(vote.getVote())){
                // If a unique canidate is found lets add them a vote!
                totals.filter(function(canidate){
                    if(canidate.name === vote.getVote()){
                        canidate.votes++;
                        return true
                    }
                    return false
                })
            }
        }// End of first round
    });

    // Check if anyone has more than 50%
    // Check if anyone had 0 votes from our unique list
    let res = onCheckRemovals(totals);
    totals = res.newTotals;
    inProgress = res.inProgress;
    let elemed = res.elemed;
    let winner = res.winner;
    

    // Debug our winner
    console.log(totals);
    alert("Voting totals " + JSON.stringify(totals))
    console.log(elemed);
    alert("Eliminated " + elemed)
    console.log(winner, 'winner');

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    while(inProgress){
        // Update round
        let newRound = 'first';
        if(round === 'first')
            newRound = 'second'
        else if(round === 'second')
            newRound = 'third'
        round = newRound;


        votes.forEach((vote, index) => {
            if(vote.getRound() === round){
                // Add votes the the canidates in round 1
                if(canidates.includes(vote.getVote())){
                    // If a unique canidate is found lets add them a vote!
                    totals.filter(function(canidate){
                        if(canidate.name === vote.getVote()){
                            canidate.votes++;
                            return true
                        }
                        return false
                    })
                }
            }// End of first round
        });
    
        // Check if anyone has more than 50%
        // Check if anyone had 0 votes from our unique list
        res = onCheckRemovals(totals);
        totals = res.newTotals;
        inProgress = res.inProgress;
        elemed = res.elemed;
        winner = res.winner;
        
        if(!inProgress){
           return {totals, elemed, winner, inProgress};
        }
    
        // Debug our winner
        console.log(totals);
        alert("Voting totals " + JSON.stringify(totals))
        console.log(elemed);
        alert("Eliminated " + elemed)
        console.log(winner, 'winner');
    }
}

function onCheckRemovals(totals){
    let newTotals = []
    let elemed = [];
    let winner = false;
    let inProgress = true;
    // Check for 0 votes
    totals.forEach(canidate => {
        // Remove anyone with 0 votes
        if(canidate.votes === 0){
            //alert('Removed canidate ' + canidate.name + " for having 0 votes this round!")
            elemed.push(canidate.name)
        }else{
            newTotals.push(canidate)
        }
    })
    // Remove the lowest voted canidate
    let lowestVoter = newTotals[0];
    newTotals.forEach((canidate, i) => {
        if(canidate.votes < lowestVoter.votes){
            lowestVoter = canidate
        }
    })
    elemed.push(lowestVoter.name)
    //alert('Removed canidate ' + lowestVoter.name + " for having the lowest votes!")
    newTotals = newTotals.filter((elm)=>{if(elm.name !== lowestVoter.name)return true})
    

    // Check for > 50% of votes to show a winner!
    let totalVotes = 0;
    newTotals.forEach(canidate => {totalVotes += canidate.votes})
    newTotals.forEach(canidate => {
        let percentage = canidate.votes / totalVotes * 100;
        canidate.percentage = parseFloat(percentage);

        if(percentage >= 50){
            // We have a winner with the given totals data
            console.log(`${canidate.name} has won the majority vote! ${percentage}%`)
            alert(`${canidate.name} has won with ${canidate.votes} votes!`)
            winner = canidate;
            inProgress = false;
        }
    })
    return {newTotals, elemed, winner, inProgress};
}