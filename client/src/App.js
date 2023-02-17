import { useState, useEffect } from 'react';
import './App.css';
import Papa from 'papaparse'
import convertToObj from './util/convertToObject';
import removeDuplicates from './util/removeDuplicates';
import getUniqueNames from './util/getUniqueNames';
import convertVote from './util/votes';

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

	// Set round
	const [round, setRound] = useState(0);
	
	const startRound = () => {
		// Move round state to round 1
		setRound(1);

		// Get unique names of voters
		setCanidates(getUniqueNames(newBallet))

		// Convert the ballets into vote objects {"first": VOTE, "id": ID}
		console.log(convertVote(newBallet))
	}

	// Grab the input data (allows for multiple CSV files)
	const handleFiles = files => {
		// Reset old files first due to new ballet
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
	}

	const loadVotes = async () => {
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
		setBallets(newVotes)

		// Convert the json res data to real objects
		await convertObj();

		// Start round after converting
		await startRound();
	}

	const convertObj = async () => {
		const voteCopy = [...ballet]
		const voteJSON = []

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
		setNewBallet(obj.arr)
		setDuplicates(obj.dups)
	}

	return (
		<div className="App">
			<h1 style={{ textAlign: 'center', fontSize: 32 }}>PreAssessment Ranked Ballots</h1>
			<hr></hr>
			<div id="upload-container">
				<h1>Upload Multiple CSV files:</h1>
				<input type="file" name="file" accept=".csv" multiple onChange={handleFileEvent} /><br />
				<p>(You will need to spam click start a few times... It's a react useState issue i didn't have time to fix.)</p>
				<button className="button-82-pushable" multiple onClick={loadVotes} style={{ margin: 15 }}>
					<span className="button-82-shadow"></span>
					<span className="button-82-edge"></span>
					<span className="button-82-front text">
						Start
					</span>
				</button>
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
				<h1>Uniuqe Votes: </h1>
				{canidates.map(canidate => (
					<ol key={canidate}>
						{canidate}
					</ol>
				))}
			</div>
			<div>
				<h1>Vote Objects: </h1>
				<table>
					<tbody>
						<tr>
							<th>First Vote</th>
							<th>Second Vote</th>
							<th>Third Vote</th>
							<th>Voter ID</th>
						</tr>
					</tbody>
					{newBallet.map(vote => (
						<tr key={vote.getVote()}>
							<td>{vote.getFirst()}</td>
							<td>{vote.getSecond()}</td>
							<td>{vote.getThird()}</td>
							<td>{vote.getVote()}</td>
						</tr>
					))}
				</table>
			</div>
		</div>
	);
}

export default App;
