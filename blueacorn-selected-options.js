Product.Config.prototype.configureElement = Product.Config.prototype.configureElement.wrap
(
    function(originalCall, element) {

        console.clear();

        //Is current element valid?
        var validate = Validation.validate(element);

        // Get current and previous values and validation for element
        console.log(element);
        console.log("Value = " + element.selectedIndex + " Last Value = " + element.lastIndex);
        console.log("Valid = " + validate + " Last Value = " + element.lastValidated);

        //Are all elements valid?
        var allOptionsSelected = spConfig.settings.every(function(attrEls) {
            return Validation.validate(attrEls);
        });

        // If the user has selected a different option and both the current and previous options are valid, confirm the change
        if (validate && element.selectedIndex != element.lastIndex)
        {
            // Assign this (the current instance of Product.Config) to a variable so that it may be referenced inside of the dialog. (Otherwise,
            // invoking this will refer to the window.)
            var productConfig = this;

            Dialog.confirm("Are you sure you want to change your configuration?",
                {
                    width       :   300,
                    okLabel     :   "OK",
                    buttonClass :   "myButtonClass",
                    id          :   "myDialogId",
                    onCancel    :   function() {
                                        element.selectedIndex = element.lastIndex;
                                        productConfig.printSummaryString(allOptionsSelected);
                                        },
                    onOk        :   function() {
                                        element.lastIndex = element.selectedIndex;
                                        productConfig.printSummaryString(allOptionsSelected);
                                        return true;
                                        }
                });
        }
        else
        {
            // Set current value and validation as 'last' values for next change
            element.lastIndex = element.selectedIndex;
            element.lastValidated = validate;

            // If all options have been selected, display a summary
            this.printSummaryString(allOptionsSelected);
        }
    }
);

Product.Config.prototype.printSummaryString = function(allOptionsSelected) {

    if (allOptionsSelected == true) {

        var cfgsum = $('config-summary');

        if (cfgsum != null) { cfgsum.remove(); }

        // Create element for the existing div containing Quantity and Add To Cart button
        var addcart = $$("div.product-options-bottom")[0];

        // Create new <span> element containing selection summary; this will display inside the Add To Cart div if all options are selected
        var summary = new Element('span', {id: "config-summary", style: 'color: blue;'});

        // Insert <span> element at the top of the 'Add To Cart' div
        addcart.insert({top: summary});

        var confirm_string = 'Your Selected Options: ';

        spConfig.settings.each(function (attrEls) {
            confirm_string += attrEls.options[attrEls.selectedIndex].innerHTML + ", ";
        });

        $(summary).update(confirm_string.slice(0, -2));

    } else {
        if ($('config-summary') != null) { $('config-summary').remove() };
    }


};


