/*
* jQuery UI Combify
* A jQuery UI plugin to change any HTML select into a combobox where the user can enter data that isn't in the select list
*
* Copyright (c) October 2012 Tom Mooney
* licensed under the MIT license, http://www.opensource.org/licenses/mit-license.php
*/

(function ($) {
    $.widget("ui.combify", {
        options: {
            capitalizeInput: false
        },
        _create: function () {
            var self = this,
                select = self.element,
                options = self.options,
                id = select.attr('id'),
                inputSelector = "#" + id,
                name = select.attr('name'),
                selectedValue = select.find(':selected').text(),
                //selectedValue = select.find(':selected').val(),
                selectOptions = select.find('option'),
                optionArray = new Array();

            //Hide the original select
            select.hide();

            //Insert new HTML for a text input and a button to trigger the dropdown
            select.before('<div>' +
						   '<span class="ui-combobox">' +
						   '<input type="text" id="' + id + '" name="' + name + '" class="ui-combobox-input" value="' + selectedValue + '">' +
						   '<a class="ui-combobox-toggle"></a>' +
						   '</span></div>');

            //Remove the the id and name from the original select since they are now on the text input so that posted forms will get the correct value
            select.removeAttr('id');
            select.removeAttr('name');
            select.on('change', function (event) {
                event.stopPropagation();
            });

            //Get all the options from the select list and put them in an array for use in the autocomplete data source
            selectOptions.each(function (i) {
                optionArray.push($(this).text());
                //optionArray.push($(this).val());
            });

            //Add autocomplete to the new input
            $(inputSelector).autocomplete({
                source: optionArray,
                select: function (event, ui) {
                    //For some reason selecting a value doesn't automatically trigger the change event on the input, so trigger it here
                    this.value = ui.item.value;
                    $(this).trigger('change');
                }
            });

            //Convert entered values to upper case if capitalizeInput option is true
            if (options.capitalizeInput) {
                var input = $(inputSelector);
                input.css("text-transform", "uppercase").data('val', input.val()).on('keyup', function () {
                    //Make the value upper case if it has changed
                    var theInput = $(this);
                    if (theInput.data('val') != this.value) {
                        theInput.change(function () { this.value.toUpperCase(); });
                    }
                    //Store the current value for comparison on next change
                    theInput.data('val', this.value);

                    theInput = null;
                });

                input = null;
            }

            //Attach a change event to the select list to put the selected value in the new text input
            select.on('change', function () {
                input = $(this).prev().find(".ui-combobox-input").first();
                // how to get the display text here?
                var options = $(this)[0].options;
                var selectedIndex = $(this)[0].selectedIndex;
                var content = options[selectedIndex].text;
                //var content = $(this).val();
                input.val(content);
                input.trigger('change');
            });

            //Add the button to trigger the dropdown
            var button = select.prev().first().find(".ui-combobox-toggle");
            button.button({
                icons: {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            });

            //Attach the click event to the button to trigger the dropdown.
            button.click(function (event) {
                event.stopPropagation();
                var minWidth = $(this).prev().first().width();
                ExpandSelectList($(this), event, minWidth);
            });

            //Attach an event to expand the select list if the user presses Alt + DownArrow
            $(inputSelector).keydown(function (event) {
                var list = $(this).parent().parent().next();

                if (event.which === 40 && event.altKey) {
                    //If the list is already visible then just hide it
                    if (list.is(":visible")) {
                        list.hide();
                    }
                    else {
                        if (options.capitalizeInput) {
                            this.value = this.value.toUpperCase();
                        }
                        list.autocomplete("close");
                        ExpandSelectList($(this), event, $(this).width());
                    }
                }
            });

            //Attach an event to close the list after a selection is made
            var list = select.prev().first().find(".ui-combobox-list");
            list.change(function () {
                $(this).hide();
            });

            //private methods
            function ExpandSelectList(element, event, minWidth) {
                var list = element.parent().parent().next();

                //If the list is already open or the autocomplete list is open then close the list.
                if (list.is(":visible") || $(inputSelector).autocomplete("widget").is(":visible")) {
                    list.hide();
                }
                else {
                    //Set the length of the select list to either the number of items in the list or 30, whichever is smaller
                    var size;
                    if (optionArray.length <= 30) {
                        size = optionArray.length;
                    }
                    else {
                        size = 30;
                    }

                    $(list)[0].selectedIndex = -1;
                    list.css({ "width": "auto",
                        "position": "absolute",
                        "z-index": "1"
                    }) //Puts the list on top of all other elements
                    	    .attr("size", size) //changes the select list to a listbox so that it will "expand"
                    	    .show();
                    if (minWidth > list.width()) {
                        list.css("width", minWidth);
                    }

                    //Attach a one-time event to the document to close the list if the user clicks anywhere else on the page.
                    $(document).one("click", function () {
                        list.hide();
                    });

                    function nextItem(event) {
                        var down = "down",
                            up = "up"

                        //If the user presses up arrow move to the previous item in the list
                        if (event.which === 38 && list.is(":visible")) {
                            move(up);
                            return;
                        }

                        //If user presess down arrow move to the next item in the list
                        if (event.which === 40 && list.is(":visible")) {
                            move(down);
                            return;
                        }

                        //if the user presses enter trigger the change event on the input to set it's value to the selected value
                        if (event.which === 13 && list.is(":visible")) {
                            event.preventDefault();
                            list.trigger("change");
                            list.hide();
                            return;
                        }

                        if (list.is(":visible")) {
                            list.hide();
                        }

                        function move(direction) {
                            event.preventDefault();
                            var selected = list.find(":selected");
                            if (direction === down) {
                                var nextItem = selected.next();
                            }
                            if (direction === up) {
                                var nextItem = selected.prev();
                            }
                            selected.attr('selected', false);
                            nextItem.attr('selected', true);
                        }
                    }

                    //Attach an event to move through the list with the arrow keys
                    $(document).off("keydown.combifySelect");
                    $(document).on("keydown.combifySelect", nextItem);
                }
            }
        },

        destroy: function () {
            var select = this.element
            select.off('change');
            select.prev().remove();
            select.show();
        }
    });
})(jQuery);