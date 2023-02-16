import { useState } from 'react';
import './App.css';
import Papa from 'papaparse'
import convertToObj from './util/convertToObject';

function App() {

  // Data states
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // All vote data objects
  const [votes, setVotes] = useState([]);

  // Current round
  const [round, setRound] = useState(1);

  // Grab the input data (allows for multiple CSV files)
  const handleFiles = files => {
    // Reset old files first due to new votes
    const uploaded = [...uploadedFiles]

    files.some((file) => {
      //uploaded.push(file);
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
      }
    })

    setUploadedFiles(uploaded);
  }

  const handleFileEvent = (e) => {
    const gatheredFiles = Array.prototype.slice.call(e.target.files);
    handleFiles(gatheredFiles);
    //console.log(uploadedFiles)
  }

  const startRound = () => {
    // Load votes when files have been processed
    loadVotes();

    // Set round state to 1
    setRound(1);
  }

  const loadVotes = () => {
    const newVotes = [];

    uploadedFiles.forEach(file => {
      Papa.parse(file,
        {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: function (res) {
            newVotes.push(res.data);
          }
        })
    })

    setVotes(newVotes);

    // Convert the json res data to real objects
    convertObj();
  }

  const convertObj = async () => {
    const voteCopy = [...votes]
    const voteJSON = []
    
    for(let arr of voteCopy){
      for(let i in arr){
        // Current vote JSON out of our array of arrays (array of file data)
        const curVote = arr[i];
        voteJSON.push(curVote);
      }
    }

    // Convert the json to js objects
    const arrObjects = await convertToObj(voteJSON);
    console.log(arrObjects)
  }

  return (
    <div className="App">
      <div className='app'>
        <div id="upload-container">
          <h1>Upload Multiple CSV files:</h1>
          <input type="file" name="file" accept=".csv" multiple onChange={handleFileEvent} />
          <button multiple onClick={startRound}>Start</button>
        </div>
        <div>
          <h1>Loaded Files: </h1>
          {uploadedFiles.map(file => (
            <ol key={file.name}>
              {file.name}
            </ol>
          ))}
        </div>
        <div>
          <h1>Votes: </h1>
          {votes.map(vote => (
            <div key={vote.VoterID}>
              {vote.VoterID}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
