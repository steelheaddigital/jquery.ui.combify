jQuery UI Combify
==================================
Combify is a jQuery UI plugin that transforms any select input to a combo box where a user can enter values not present in the select list.  It also includes autocomplete and key navigation support through the list with up/down arrows. Like many plugins, this was done for a specific project because I couldn't find anything that fit my requirements. I am putting it out here in the hopes that maybe someone else will also find it useful.

Dependencies
----------------
*     jQuery 1.7+
*     jQuery UI 1.8+

Setup and Usage
-----------------

Add the CSS file to the HEAD tag

    <link rel="stylesheet" type="text/css" href="jquery.ui.combify.css"


	
Load the JavaScript file in the HEAD tag

    <script type="text/javascript" src="jquery.ui.combify.js"></script>
	
To use, simply call combify on a select input

    <select id="SomeSelect"></select>
    $("#SomeSelect").combify()

Options
==================================

###capitalizeInput

Automatically capitalizes all input as user types.

Default: false

Usage: 

           $("#SomeSelect").combify({capitalizeInput: true})

###maxLength

Locks the input field to a maximum length of characters

Default: 0 or disabled

Usage: 

           $("#SomeSelect").combify({maxLength: 10})

