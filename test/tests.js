var Tests = (function () {
    tests = {};

    module('ApplicationTest', {
        setup: function () {
					$("#MySelect").combify();
        },
        teardown: function () {
            
        }
    });

    test("Creates hidden input with correct ID, name, and value", function () {
        //Act
        var input = $("input[type=hidden]").first("#MySelect");

        //Assert
        ok(input);
        deepEqual(input.attr('name'), 'My.Select');
        deepEqual(input.val(), 'Some Option');
    });
    
    test("Creates autocomplete with correct source", function () {
        //Act
        var autoCompleteDataSource = $("#CombifyInput-MySelect").autocomplete( "option", "source" );
        
        //Assert
        deepEqual(autoCompleteDataSource.length, 2);
        deepEqual(autoCompleteDataSource[0], 'Some Option');
        deepEqual(autoCompleteDataSource[1], 'Some Other Option');
    });
    
    test("Selecting a value from dropdown changes input value", function () {
				//Arrange
				var selectList = $("select").first();
				var option = selectList.find('option')[1]
				
        //Act
        $(option).attr('selected', 'selected');
        selectList.trigger('change');
        
        //Assert
        deepEqual($("#MySelect").val(), $(option).val());
    });

    return tests;
}());

