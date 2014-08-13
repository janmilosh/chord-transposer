//
//Declare global variables
//
var i, len, inputChordString, inputKey, outputKey, halfSteps, inputMode;
var slash = [];
var inputChordArray =[];
var startNoteArray = [];
var startMiddleArray = [];
var startSlashArray = [];
var endNoteArray = [];
//var endMiddleArray = [];
var endSlashArray = [];
var outputChordArray = [];
//
//Function to collect form inputs
//
function getFormValues() {
	inputChordString = document.transposerInputs.inputChords.value;
	inputChordString = inputChordString.replace(/\s/g, "");
	inputKey = document.transposerInputs.inputKey.value;
	inputKey = inputKey.replace(/\s/g, "");
	if(inputKey.length === 2) {
		inputKey = inputKey.substr(0, 1).toUpperCase() + inputKey.substr(1);
	}
	if (inputKey.length === 1) {
		inputKey = inputKey.toUpperCase();
	}
	halfSteps = document.transposerInputs.halfSteps.value;
	halfSteps = parseInt(halfSteps, 10);
	var radios = document.getElementsByName('mode');
	for (i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			inputMode = radios[i].value;
			break;
		} else {
			inputMode = "";
		}
	}
	if (inputKey === "") {
		alert("Please input your song's key.");
	}
	if (inputMode === "") {
		alert("Please select either Major or minor.");
	}
	if (inputChordString === "") {
		alert("Please input your chords.");
	}
	if ((halfSteps === "") || (isNaN(halfSteps/1) === true)) {
		alert("Please input number of half steps to transpose by.");
	}	
}
//
//Function to convert input chord string to arrays of chords and get corresponding numerical values
//
function makeChordArrays() {
	var sharpOrFlat;
	//
	//Split input chord string into an array
	//
	inputChordArray = inputChordString.split(",");
	len = inputChordArray.length;
	//
	//Convert notes to numerical values
	//
	function convertInputNotes(note) {
		var inputNoteNum;
		switch (note) {
			case 'B#': inputNoteNum = 1;
				break;
			case 'C': inputNoteNum = 1;
				break;
			case 'C#': inputNoteNum = 2;
				break;
			case 'Db': inputNoteNum = 2;
				break;
			case 'D': inputNoteNum = 3;
				break;
			case 'D#': inputNoteNum = 4;
				break;
			case 'Eb': inputNoteNum = 4;
				break;
			case 'E': inputNoteNum = 5;
				break;
			case 'E#': inputNoteNum = 6;
				break;
			case 'Fb': inputNoteNum = 5;
				break;			
			case 'F': inputNoteNum = 6;
				break;
			case 'F#': inputNoteNum = 7;
				break;
			case 'Gb': inputNoteNum = 7;
				break;
			case 'G': inputNoteNum = 8;
				break;
			case 'G#': inputNoteNum = 9;
				break;
			case 'Ab': inputNoteNum = 9;
				break;
			case 'A': inputNoteNum = 10;
				break;
			case 'A#': inputNoteNum = 11;
				break;
			case 'Bb': inputNoteNum = 11;
				break;
			case 'B': inputNoteNum = 12;
				break;
			case 'Cb': inputNoteNum = 12;
				break;
		}
		inputNoteNum = parseInt(inputNoteNum, 10);
		return inputNoteNum;
	}
	//
	//get the note and sharp or flatted values: white for main note, fill arrays
	//
	for (i = 0; i < len; i++) {
		//
		//start by putting full-up chords in the startMiddleArray
		//
		startMiddleArray[i] = inputChordArray[i];
		//
		//find the white key note for the chord and make it uppercase
		//
		var whiteNote = inputChordArray[i].substr(0, 1);
		startNoteArray[i] = whiteNote.toUpperCase();
		//
		//Slice the white note from the chord
		//
		startMiddleArray[i] = startMiddleArray[i].slice(1);
		//
		//Is it a sharp or flat?
		//		
		if (inputChordArray[i].substr(1, 1) === "b") {
			sharpOrFlat = "b";
			//
			//slice off the b, then add it to the startNoteArray
			//
			startMiddleArray[i] = startMiddleArray[i].slice(1);
			startNoteArray[i] = startNoteArray[i] + sharpOrFlat;
		}
		if (inputChordArray[i].substr(1, 1) === "#") {
			sharpOrFlat = "#";
			//
			//slice off the #, then add it to the startNoteArray
			//
			startMiddleArray[i] = startMiddleArray[i].slice(1);
			startNoteArray[i] = startNoteArray[i] + sharpOrFlat;
		}
		//
		//Take care of the slash chords too!
		//
		//look for a slash
		//
		if (inputChordArray[i].match(/\//)) {
			slash[i] = true; 
			//
			//find index of the slash
			//
			var n = startMiddleArray[i].lastIndexOf("/");
  			//
			//Pull off the slash cord into it's own array: startSlashArray
			//
  			startSlashArray[i] = startMiddleArray[i].substr(n+1);
  			//
			//Remove slash part from middle of chord for final startMiddleArray values
			//
  			startMiddleArray[i] = startMiddleArray[i].substr(0, n + 1);
			//
			//Convert slash chord names to upper case
			//
		
			if(startSlashArray[i].length === 2) {
				startSlashArray[i] = startSlashArray[i].substr(0, 1).toUpperCase() + startSlashArray[i].substr(1);
			}
			if (startSlashArray[i].length === 1) {
				startSlashArray[i] = startSlashArray[i].toUpperCase();
			}
			//
			//Convert Slash Chords to numbers
			//
			startSlashArray[i] = convertInputNotes(startSlashArray[i]);
		}
		//
		//Convert notes to numbers
		//
		startNoteArray[i] = convertInputNotes(startNoteArray[i]);
	}
	//
	//Convert key to a number
	//
	inputKey = convertInputNotes(inputKey);
}
//
//Put it all together: transpose chords and output values to webpage
//
function transposeChords() {
	getFormValues();
	makeChordArrays();
//	alert("Front end array: " + startNoteArray);
//	alert("Middle array: " + startMiddleArray);
//	alert("Slash array: " + startSlashArray);
//	alert("input key: " + inputKey);
//	alert("input mode: " + inputMode);
	//
	//The function for converting the song key signature in a major key
	//
	function convertKeyMajor(note) {
		var outputNote;
		switch (note) {
			case 1: outputNote = 'C';
				break;
			case 2: outputNote = 'Db';
				break;
			case 3: outputNote = 'D';
				break;
			case 4: outputNote = 'Eb';
				break;
			case 5: outputNote = 'E';
				break;
			case 6: outputNote = 'F';
				break;
			case 7: outputNote = 'Gb';
				break;
			case 8: outputNote = 'G';
				break;
			case 9: outputNote = 'Ab';
				break;
			case 10: outputNote = 'A';
				break;
			case 11: outputNote = 'Bb';
				break;
			case 12: outputNote = 'B';
				break;
		}
		return outputNote;
	}
	//
	//The function for converting the song key signature in a minor key
	//
	function convertKeyMinor(note) {
		var outputNote;
		switch (note) {
			case 1: outputNote = 'C';
				break;
			case 2: outputNote = 'C#';
				break;
			case 3: outputNote = 'D';
				break;
			case 4: outputNote = 'Eb';
				break;
			case 5: outputNote = 'E';
				break;
			case 6: outputNote = 'F';
				break;
			case 7: outputNote = 'F#';
				break;
			case 8: outputNote = 'G';
				break;
			case 9: outputNote = 'G#';
				break;
			case 10: outputNote = 'A';
				break;
			case 11: outputNote = 'Bb';
				break;
			case 12: outputNote = 'B';
				break;
		}
		return outputNote;
	}
	//
	//The function for converting chords when in a sharp key
	//
	function convertOutputSharps(note) {
		var outputNote;
		switch (note) {
			case 1: outputNote = 'C';
				break;
			case 2: outputNote = 'C#';
				break;
			case 3: outputNote = 'D';
				break;
			case 4: outputNote = 'D#';
				break;
			case 5: outputNote = 'E';
				break;
			case 6: outputNote = 'F';
				break;
			case 7: outputNote = 'F#';
				break;
			case 8: outputNote = 'G';
				break;
			case 9: outputNote = 'G#';
				break;
			case 10: outputNote = 'A';
				break;
			case 11: outputNote = 'A#';
				break;
			case 12: outputNote = 'B';
				break;
		}
		return outputNote;
	}
	//
	//The function for converting chords when in a flat key
	//
	function convertOutputFlats(note) {
		var outputNote;
		switch (note) {
			case 1: outputNote = 'C';
				break;
			case 2: outputNote = 'Db';
				break;
			case 3: outputNote = 'D';
				break;
			case 4: outputNote = 'Eb';
				break;
			case 5: outputNote = 'E';
				break;
			case 6: outputNote = 'F';
				break;
			case 7: outputNote = 'Gb';
				break;
			case 8: outputNote = 'G';
				break;
			case 9: outputNote = 'Ab';
				break;
			case 10: outputNote = 'A';
				break;
			case 11: outputNote = 'Bb';
				break;
			case 12: outputNote = 'Cb';
				break;
		}
		return outputNote;
	}
	//
	//Perform numerical transposition, add or subtract 12 if needed to normalize note
	//Convert arrays back into alpha notation (dependent upon mode and key)
	//
	outputKey = inputKey + halfSteps;
	if (outputKey < 1) {
		outputKey = outputKey + 12;
	}
	if (outputKey > 12) {
		outputKey = outputKey - 12;
	}
	for (i = 0; i < len; i++) {
		endNoteArray[i] = startNoteArray[i] + halfSteps;
		if (endNoteArray[i] > 12) {
			endNoteArray[i] = endNoteArray[i] - 12;
		}
		if (endNoteArray[i] < 1) {
			endNoteArray[i] = endNoteArray[i] + 12;
		}
		var num = endNoteArray[i];
		if ((inputMode === 'major') && ((outputKey === 1) || (outputKey === 3) || (outputKey === 5) || (outputKey === 8) || (outputKey === 10) || (outputKey === 12))) {
			endNoteArray[i] = convertOutputSharps(num);
		}
		if ((inputMode === 'major') && ((outputKey === 2) || (outputKey === 4) || (outputKey === 6)|| (outputKey === 7) || (outputKey === 9) || (outputKey === 11))) {
			endNoteArray[i] = convertOutputFlats(num);
		}
		if ((inputMode === 'minor') && ((outputKey === 2) || (outputKey === 5) || (outputKey === 7) || (outputKey === 9) || (outputKey === 10) || (outputKey === 12))) {
			endNoteArray[i] = convertOutputSharps(num);
		}
		if ((inputMode === 'minor') && ((outputKey === 1) || (outputKey === 3) || (outputKey === 4) || (outputKey === 6) || (outputKey === 8) || (outputKey === 11))) {
			endNoteArray[i] = convertOutputFlats(num);
		}
		if (slash[i] === true) {
			endSlashArray[i] = startSlashArray[i] + halfSteps;
			if (endSlashArray[i] > 12) {
				endSlashArray[i] = endSlashArray[i] - 12;
			}
			if (endSlashArray[i] < 1) {
				endSlashArray[i] = endSlashArray[i] + 12;
			}
			var num2 = endSlashArray[i];
			if ((inputMode === 'major') && ((outputKey === 1) || (outputKey === 3) || (outputKey === 5) || (outputKey === 8) || (outputKey === 10) || (outputKey === 12))) {
				endSlashArray[i] = convertOutputSharps(num2);
			}
			if ((inputMode === 'major') && ((outputKey === 2) || (outputKey === 4) || (outputKey === 6)|| (outputKey === 7) || (outputKey === 9) || (outputKey === 11))) {
				endSlashArray[i] = convertOutputFlats(num2);
			}
			if ((inputMode === 'minor') && ((outputKey === 2) || (outputKey === 5) || (outputKey === 7) || (outputKey === 9) || (outputKey === 10) || (outputKey === 12))) {
				endSlashArray[i] = convertOutputSharps(num2);
			}
			if ((inputMode === 'minor') && ((outputKey === 1) || (outputKey === 3) || (outputKey === 4) || (outputKey === 6) || (outputKey === 8) || (outputKey === 11))) {
				endSlashArray[i] = convertOutputFlats(num2);
			}
		}
		//
		//Re-assemble transposed chord parts
		//
		if (slash[i] === true) {
			outputChordArray[i] = endNoteArray[i] + startMiddleArray[i] + endSlashArray[i];
		} else {
			outputChordArray[i] = endNoteArray[i] + startMiddleArray[i];
		}
	}
	if (inputMode === 'major') {
		outputKey = convertKeyMajor(outputKey);
		outputKey = outputKey + ' Major';
	}
	if (inputMode === 'minor') {
		outputKey = convertKeyMinor(outputKey);
		outputKey = outputKey + ' Minor';
	}
	document.getElementById('transposed-key').innerHTML = outputKey;
	document.getElementById('transposed-chords').innerHTML = outputChordArray;
	slash = [];
	inputChordArray =[];
	startNoteArray = [];
	startMiddleArray = [];
	startSlashArray = [];
	endNoteArray = [];
	endSlashArray = [];
	outputChordArray = [];
}
//
//Just for fun, a function to change background color
//
function changeIt() {

	// generate random rgb numbers
	var red = Math.floor(Math.random() * 255);
	var green = Math.floor(Math.random() * 255);
	var blue = Math.floor(Math.random() * 255);
	//
	// create rgb string
	//
	var bodyColor = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
	var pageBody = document.getElementById("changeBackground");
	pageBody.style.backgroundColor = bodyColor;
}										  