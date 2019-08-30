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
        var wrapper = document.createElement("ul")
        wrapper.id = "GSL_WRAPPER"
        // var loading = document.createElement("div")
        // loading.id = "GSL_LOADING"
        // loading.innerHTML = "loading..."
        // wrapper.appendChild(loading)
        return wrapper    
	},
    socketNotificationReceived: function(notification, payload) {                
        if (notification == "UPDATE_NOTES") {
        }

        if (notification == "NEW_NOTE") {
        }                
    },
} );
