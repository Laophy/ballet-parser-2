import { useState } from 'react';
import './App.css';
import Papa from 'papaparse'
import convertToObj from './util/convertToObject';
import removeDuplicates from './util/removeDuplicates';

function App() {

  // Data states
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // All vote data objects
  const [votes, setVotes] = useState([]);
  const [voteObj, setVoteObj] = useState([]);

  // Duplicates
  const [duplicates, setDuplicates] = useState([]);

  // Set round
  const [round, setRound] = useState(0);

  const startRound = () => {
    // Move round state to round 1
    setRound(1);
  }

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

    // Load votes when files have been processed
    loadVotes();
  }

  const handleFileEvent = (e) => {
    const gatheredFiles = Array.prototype.slice.call(e.target.files);
    handleFiles(gatheredFiles);
    //console.log(uploadedFiles)
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

    // Remove duplicates and save new vote array of objs
    //setVotes(removeDuplicates(newVotes));
    setVotes(newVotes)

    // Convert the json res data to real objects
    convertObj();

    // Start round after converting
    startRound();
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
    const obj = removeDuplicates(arrObjects);
    setVoteObj(obj.arr)
    setDuplicates(obj.dups)
  }

  return (
    <div className="App">
      <div className='app'>
        <div id="upload-container">
          <h1>Upload Multiple CSV files:</h1>
          <input type="file" name="file" accept=".csv" multiple onChange={handleFileEvent} />
          <button multiple onClick={loadVotes}>Start</button>
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
          <h1>Duplicate ID: </h1>
          {duplicates.map(dup => (
            <ol key={`Duplicate-${dup}`}>
              #{dup}
            </ol>
          ))}
        </div>
        <div>
          <h1>Votes: </h1>
          <table>
          <tbody>
          <tr>
            <th>First Vote</th>
            <th>Second Vote</th>
            <th>Third Vote</th>
            <th>Voter ID</th>
          </tr>
          </tbody>
            {voteObj.map(vote => (
                <tr key={vote.voterID}>
                  <td>{vote.first}</td>
                  <td>{vote.second}</td>
                  <td>{vote.third}</td>
                  <td>{vote.voterID}</td>
                </tr>
              ))}
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
