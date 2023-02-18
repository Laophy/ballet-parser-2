import { useState, useEffect } from "react";
import "./App.css";
import Papa from "papaparse";
import convertToObj from "./util/convertToObject";
import removeDuplicates from "./util/removeDuplicates";
import getUniqueNames from "./util/getUniqueNames";
import convertVote from "./util/votes";
import processVoteData from "./util/processRounds";

function App() {
  // Data states
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // All vote data objects
  const [ballet, setBallets] = useState([]);
  const [newBallet, setNewBallet] = useState([]);

  // Duplicates
  const [duplicates, setDuplicates] = useState([]);

  // Unique canidates
  const [canidates, setCanidates] = useState([]);
  const [votes, setVotes] = useState([]);

  // Set round
  const [round, setRound] = useState(0);

  const startRound = async () => {
    // Move round state to round 1
    setRound(1);

    // Get unique names of voters
    setCanidates(getUniqueNames(newBallet));

    // Convert the ballets into vote objects {"first": VOTE, "id": ID}
    setVotes(convertVote(newBallet));

    // Start the round process when votes are cleaned
    processVoteData(convertVote(newBallet), canidates, 'first');
  };

  // Grab the input data (allows for multiple CSV files)
  const handleFiles = (files) => {
    // Reset old files first due to new ballet
    const uploaded = [...uploadedFiles];

    files.some((file) => {
      //uploaded.push(file);
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
      }
    });

    setUploadedFiles(uploaded);
  };

  const handleFileEvent = (e) => {
    const gatheredFiles = Array.prototype.slice.call(e.target.files);
    handleFiles(gatheredFiles);
  };

  const loadVotes = async () => {
    const newVotes = [];

    uploadedFiles.forEach((file) => {
      Papa.parse(file, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (res) {
          newVotes.push(res.data);
        },
      });
    });

    // Remove duplicates and save new vote array of objs
    setBallets(newVotes);

    // Convert the json res data to real objects
    await convertObj();

    // Start round after converting
    await startRound();
  };

  const convertObj = async () => {
    const voteCopy = [...ballet];
    const voteJSON = [];

    for (let arr of voteCopy) {
      for (let i in arr) {
        // Current vote JSON out of our array of arrays (array of file data)
        const curVote = arr[i];
        voteJSON.push(curVote);
      }
    }

    // Convert the json to js objects
    const arrObjects = await convertToObj(voteJSON);
    const obj = removeDuplicates(arrObjects);
    setNewBallet(obj.arr);
    setDuplicates(obj.dups);
  };

  return (
    <div className="App">
      <h1 style={{ textAlign: "center", fontSize: 55 }}>
        PreAssessment Ranked Ballots
      </h1>
      <hr></hr>
      <div id="upload-container">
        <h1>Upload Multiple CSV files:</h1>
        <input
          type="file"
          name="file"
          accept=".csv"
          multiple
          onChange={handleFileEvent}
        />
        <br />
        <h3 style={{textAlign: 'center'}}>
          (It may take around 3-4 button clicks to load all the data due to a
          state issue i did not have the time to fix.)
        </h3>
        <button
          className="button-82-pushable"
          multiple
          onClick={loadVotes}
          style={{ margin: 15 }}
        >
          <span className="button-82-shadow"></span>
          <span className="button-82-edge"></span>
          <span className="button-82-front text">Start</span>
        </button>
      </div>
      <div>
        <h1>Files: </h1>
        <table style={{ width: 500 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Size</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file) => (
              <tr>
                <td key={file.name}>{file.name}</td>
                <td>{file.size}</td>
                <td>{file.lastModifiedDate.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br></br>
      <div>
        <table style={{ width: 350 }}>
          <thead>
            <tr>
              <th>Duplicate IDS</th>
            </tr>
          </thead>
          <tbody>
            {duplicates.map((dup) => (
              <tr>
                <td key={dup}>{dup}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br></br>
      <div>
        <table style={{ width: 350 }}>
          <thead>
            <tr>
              <th>Canidates</th>
            </tr>
          </thead>
          <tbody>
            {canidates.map((canidate, i) => (
              <tr>
                <td key={"canidate-" + i}>{canidate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h1>Votes Entered</h1>
        <table style={{ width: 500 }}>
          <thead>
            <tr>
              <th>Vote Round</th>
              <th>Canidate</th>
              <th>Voter ID</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((vote, i) => (
              <tr key={i}>
                <td>{vote.getRound()}</td>
                <td>{vote.getVote()}</td>
                <td>{vote.getId()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
