/* global Log, Module, MM */
/* Magic Mirror
 * Module: MMM-Notes
 *
 * By Borja Igartua
 * GPL-3.0 Licensed.
 */

var Notes;
Module.register( "MMM-Notes", {
	requiresVersion: "2.0.0",

    notes: null,
    self: null,

	defaults: {
	}, 

	start: function() {
        Notes = this;
        self = this;

        Log.info( "Starting module: " + this.name );
        this.sendSocketNotification('NOTE_CONFIG', {});                
    },
    getStyles: function() {
        return ["MMM-Notes.css"]
    },        
    getDom: function() {
        this.sendSocketNotification('CONSOLE_LOG', `Updating DOM`);

        var wrapper = document.createElement("ul")
        wrapper.id = "GSL_WRAPPER"
        var loading = document.createElement("div")
        loading.id = "GSL_LOADING"
        loading.innerHTML = "loading..."
        wrapper.appendChild(loading)
        return wrapper                    
    },
    drawNotes: function() {

        if (this.notes) {

            var wrapper = document.getElementById("GSL_WRAPPER");
            wrapper.innerHTML = ""; 
            this.notes.forEach(note => {
        
                var d = document.createElement("li");
                d.className = "GSL_ITEM";       
        
                var title = document.createElement("span");
                title.innerHTML = note.text;
                d.appendChild(title);        
                wrapper.appendChild(d);
            });
        } 
    },
    socketNotificationReceived: function(notification, payload) {                
        if (notification == "UPDATE_NOTES") {
            Log.info(`payload: ${payload}`);
            this.notes = payload;
            this.drawNotes();                   
        }

        if (notification == "NEW_NOTE") {
            var wrapper = document.getElementById("GSL_WRAPPER")
            var d = document.createElement("li")
            d.className = "GSL_ITEM"                          
            
            var title = document.createElement("span")
            title.innerHTML = payload.text;
            d.appendChild(title)
            
            wrapper.appendChild(d)
        }                
    },
} );
