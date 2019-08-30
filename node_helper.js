
'use strict';

/* global module, require */
const NodeHelper = require( "node_helper" );
const path = require( "path" );
const fs = require( "fs" );
const bodyParser = require( "body-parser" );

module.exports = NodeHelper.create( {

	// Subclass start method.
	start: function() {
		console.log( "Starting node helper for: " + this.name );
		var self = this;
		this.expressApp.use(bodyParser.json());
		var notesPath = path.join( __dirname + "/taskApp/notes.txt" );

		this.getNotes(notesPath, function(err, notes) {
			if (err) return;
			self.sendSocketNotification("UPDATE_NOTES", notes);
		});

		//Send the starting values with the page		
		this.expressApp.get( '/notesApp', function( req, res ) { 
			res.sendFile(path.join(__dirname + '/taskApp/index.html'));
		});

		this.expressApp.get( '/notes', function( req, res ) {			
			self.getNotes(notesPath, function(err, notes) {
				if (err) throw err;

				var response = notes.map(function(note){ return note.text });				
				res.send(response);									
			});
		});
		
		this.expressApp.post('/note', function( req, res ) {
			
			var ts = Math.round((new Date()).getTime() / 1000);
			var line = ts + ':' + req.body.note + '\n';
			fs.appendFile(notesPath, line, function(err) {
				if (err) throw err;

				self.sendSocketNotification("NEW_NOTE", {text: req.body.note, date: ts});
				return res.send('all good!');				
			});		
		});

		this.expressApp.delete('/note',function(req, res) {
			self.getLines(notesPath, function(err, lines) {
				if (err) throw err;

				var text = '';
				var notes = new Array();
				lines.forEach(function(line, index) {
					if (index == req.query.position) return;					
					text += line + '\n';

					var parameters = line.split(":");
					notes.push({text: parameters[1], date: parameters[0]});
				});

				self.writeText(notesPath, text, function(err) { if (err) throw err; });
				self.sendSocketNotification("UPDATE_NOTES", notes);
				res.send();
			});			
	   	});

		// this.expressApp.post('/alert', function( req, res ) {
		// 	self.sendSocketNotification('NEW_ALERT', { alert: req.body.alert });
		// 	res.send('all good!');
		// });
    },    
	socketNotificationReceived: function( notification, payload ) {
		if (notification == 'NOTE_CONFIG') {
			console.log(`Module ${this.name} configured`);		
		}		
	},
	getLines: function(path, callback) {
		fs.readFile(path, 'utf8', function read(err, data) {
			if (err) {
				callback(err, null);
				return
			}
			var lines = data.split("\n");			
			var filtered = lines.filter(function (el) { return (el != null) && (el !== ""); });
			callback(null, filtered);
		});
	},
	getNotes: function(path, callback) {
		this.getLines(path, function(err, lines) {
			if (err) {
				callback(err, null);
				return
			}

			var notes = lines.map(function(line){
				var parameters = line.split(":");
				var date = parameters[0];
				var note = parameters[1];
				return {text: note, date: date};
			});

			callback(null, notes);
		});
	},
	writeText: function(path, text, callback) {
		fs.writeFile(path, text, function(err) {
			if(err) callback(err);
			
			callback(null);				
		});
	}
} );
