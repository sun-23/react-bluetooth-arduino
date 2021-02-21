import Blockly from 'blockly';
import 'blockly/javascript';

Blockly.Blocks['forward'] = {
    init: function () {
        this.appendValueInput("DISTANCE")
            .setCheck('Number')
            .appendField('move forward distance');
        this.setOutput(true, null);
    }
};

Blockly.JavaScript['forward'] = function (block) {
    var distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ADDITION) || '0'
    console.log(distance);
    var code = 'move_forward(' + distance + ')';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['backward'] = {
    init: function () {
        this.appendValueInput("DISTANCE")
            .setCheck('Number')
            .appendField('move backward distance');
        this.setOutput(true, null);
    }
};

Blockly.JavaScript['backward'] = function (block) {
    var distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ADDITION) || '0'
    console.log(distance);
    var code = 'move_backward(' + distance + ')';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['left'] = {
    init: function () {
        this.appendValueInput("DEGREE")
            .setCheck('Number')
            .appendField('turn left degree');
        this.setOutput(true, null);
    }
};

Blockly.JavaScript['left'] = function (block) {
    var degree = Blockly.JavaScript.valueToCode(block, 'DEGREE', Blockly.JavaScript.ORDER_ADDITION) || '0'
    console.log(degree);
    var code = 'left(' + degree + ')';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['right'] = {
    init: function () {
        this.appendValueInput("DEGREE")
            .setCheck('Number')
            .appendField('turn right degree');
        this.setOutput(true, null);
    }
};

Blockly.JavaScript['right'] = function (block) {
    var degree = Blockly.JavaScript.valueToCode(block, 'DEGREE', Blockly.JavaScript.ORDER_ADDITION) || '0'
    console.log(degree);
    var code = 'right(' + degree + ')';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['async_function'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("async function")
            .appendField(new Blockly.FieldTextInput("Function_Name"), "Name");
        this.appendStatementInput("Content")
            .setCheck(null);
        this.setInputsInline(true);
        this.setColour('#eb596e');
        this.setNextStatement(true, 'Action');
        this.setPreviousStatement(true, 'Action');
    }
};

Blockly.JavaScript['async_function'] = function (block) {
    var text_name = block.getFieldValue('Name');
    var statements_content = Blockly.JavaScript.statementToCode(block, 'Content');
    var code = 'const ' + text_name + ' =  async () => {\n' + statements_content + '}\n';
    return code;
};

Blockly.Blocks['call_async_function'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("call async function")
            .appendField(new Blockly.FieldTextInput("Function_Name"), "Name");
        this.setColour('#eb596e');
        this.setNextStatement(true, 'Action');
        this.setPreviousStatement(true, 'Action');
    }
};

Blockly.JavaScript['call_async_function'] = function (block) {
    var text_name = block.getFieldValue('Name');
    var code = text_name + '(); \n';
    return code;
};

Blockly.Blocks['await'] = {
    init: function () {
        this.setColour('#eb596e');
        this.setNextStatement(true, 'Action');
        this.setPreviousStatement(true, 'Action');
        this.appendValueInput("CODE")
            .setCheck('String')
            .appendField('await');
    }
};

Blockly.JavaScript['await'] = function(block){
    var code = Blockly.JavaScript.valueToCode(block, 'CODE', Blockly.JavaScript.ORDER_ADDITION) || 'console.log("");'
    return "await "+code+"\n";
}

Blockly.Blocks['print'] = {
  init: function() {
    this.appendValueInput("value")
        .setCheck(null)
        .appendField("print");
    this.setOutput(true, "String");
    this.setColour(210);
    this.setTooltip('');
    this.setHelpUrl('http://www.example.com/');
  }
};

Blockly.JavaScript['print'] = function(block) {
  var value = Blockly.JavaScript.valueToCode(block, 'value', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'console.log('+ value + ')';
  return [code, Blockly.JavaScript.ORDER_NONE];
};


