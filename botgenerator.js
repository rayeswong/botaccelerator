const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');

const dialogUtils = require('./utils/dialogUtils.js');
const strUtils = require('./utils/strUtils.js');
var SETTINGS = require('./utils/config.js');

function oc() {
    this.level = 0,
    this.name = '',
    this.codename = '';
    this.label = '',
    this.type = '';
    this.content = '';
    this.utterance = '';
    this.imageURL = '';
    this.videoURL = '';
    this.children = [];
    this.childrenId = [];
    this.parent = '';
    this.parentId = -1;
    this.codename = '';
}

function field() {
    this.name = '',
    this.content = '',
    this.action = '',
    this.fields = [],
    this.form = '',
    this.mandatory = false
}

function form() {
    this.name = '',
    this.fields = [];
}



function generateMetadata() {
    var metadata = new dialogUtils.metadata();
    metadata.version = SETTINGS.METADATA.PLATFORM_VERSION;
    metadata.name = SETTINGS.METADATA.FLOW_NAME;
    return metadata.compile();
}

function generateContext(_forms) {
    var ctx = new dialogUtils.context();
    var intentV = new dialogUtils.variable();
    intentV.name = SETTINGS.INTENT_STATE.VARIABLE;
    intentV.type = "nlpresult";
    ctx.variables.push(intentV);
    if(SETTINGS.LANGUAGE.TRANSLATE){
        var translateV = new dialogUtils.variable();
        translateV.name = SETTINGS.LANGUAGE.VARIABLE;
        translateV.type = "string";
        ctx.variables.push(translateV);
    }
    for (i in _forms) {
        for (j in _forms[i].fields) {
            var v = new dialogUtils.variable();
            v.name = _forms[i].fields[j].name;
            v.type = "string";
            ctx.variables.push(v);
        }
    }
    return ctx.compile();
}

function generateTranslate() {
    var detect = new dialogUtils.detectLanguage();
    detect.name = detect.codename = SETTINGS.LANGUAGE.DETECT_STATE;
    var translateInput = new dialogUtils.translateInput();
    translateInput.name = translateInput.codename = SETTINGS.LANGUAGE.TRANSLATE_STATE;
    translateInput.variable = SETTINGS.LANGUAGE.VARIABLE;
    return detect.compile() + translateInput.compile();
}

function generateIntent(_navigates) {
    var it = new dialogUtils.intent();
    it.variable = SETTINGS.INTENT_STATE.VARIABLE;
    if(SETTINGS.LANGUAGE.TRANSLATE){
        it.sourceVariable = SETTINGS.LANGUAGE.VARIABLE;
    }
    it.optionsPrompt = SETTINGS.INTENT_STATE.OPTIONSPROMPT;
    it.unresolved = SETTINGS.INTENT_STATE.UNRESOLVED_STATE;
    for (i in _navigates) {
        var j = _navigates[i];
        if (j.utterance == null || j.utterance == '') {
            continue;
        }
        switch (j.type) {
            case 'FORM':
                it.intents.push(j.content);
                break;
            case 'LINK':
            case 'ANSWER':
            case 'FOLDER':
                it.intents.push(j.codename);
                break;
            default:
                //code
        }
    }
    return it.compile();
}

function generateUnresolvedState() {
    var unresolved = new dialogUtils.output();
    unresolved.name = SETTINGS.UNRESOLVED_STATE.NAME;
    unresolved.codename = SETTINGS.UNRESOLVED_STATE.NAME;
    unresolved.text = SETTINGS.UNRESOLVED_STATE.TEXT;
    unresolved.return = true;
    return unresolved.compile();
}

function generateAllNavigates(_navigates) {
    var s = "";
    for (i in _navigates) {
        var j = _navigates[i];
        if (j.type == 'FORM') {
            continue;
        }
        var c = new dialogUtils.commonresponse();
        c.codename = j.codename;
        c.name = j.name;
        c.imageURL = j.imageURL;
        c.videoURL = j.videoURL;
        if(SETTINGS.LANGUAGE.TRANSLATE){
            c.textReceived = SETTINGS.LANGUAGE.DETECT_STATE;
        }
        else{
            c.textReceived = SETTINGS.INTENT_STATE.NAME;
        }
        if (j.type == 'LINK') 
            c.content = "Here is the <a href='" + j.content + "' target='_blank'>link</a> of " + j.label;
        else 
            c.content = j.content;
        if(j.childrenId.length > 0){
            for (k in j.childrenId) {
                var childId = j.childrenId[k];
                var respItem = new dialogUtils.responseItem();
                respItem.label = _navigates[childId].label;
                switch (_navigates[childId].type) {
                    case 'FORM':
                        respItem.type = 'postback';
                        respItem.action = strUtils.convertToCodeName(_navigates[childId].content);
                        break;
                    case 'LINK':
                        respItem.type = 'url';
                        respItem.url = _navigates[childId].content;
                        break;
                    case 'ANSWER':
                    case 'FOLDER':
                        respItem.type = 'postback';
                        respItem.action = _navigates[childId].codename;
                    default:
                }
                c.responseItems.push(respItem);
            }
        }
        // else{
        //     c.processUserMessage = false;
        //     c.return = true;
        // }
        if (SETTINGS.BACK.GENERATE && j.parentId > -1) {
            var back = new dialogUtils.responseItem();
            //back.label = SETTINGS.BACK.LABEL;
            back.label = "[" + _navigates[j.parentId].label + "]";
            back.type = 'postback';
            back.action = _navigates[j.parentId].codename;
            c.responseItems.push(back);
        }
        s += c.compile();
    }
    return s;
}

function generateAllForms(_forms) {
    var s = "";
    for (i in _forms) {
        var form = _forms[i];
        // State to reset form variables
        var reset = new dialogUtils.resetVariables();
        reset.name = form.name;
        reset.codename = form.name;
        var save_form_codename = "SAVE" + form.name;
        var save_form_success_codename = "SAVE" + form.name + "SUCCESS";
        var save_form_failure_codename = "SAVE" + form.name + "FAILURE";
        var cancel_form_codename = "CANCEL" + form.name;
        var fieldsYAML = "";
        var summary = "";
        var variables = [];
        for (j in form.fields) {
            var fd = form.fields[j];
            var state;
            reset.variableList += fd.name + ",";
            switch (fd.action) {
                case 'SELECT':
                    variables.push(fd.name);
                    state = new dialogUtils.list();
                    state.prompt = fd.content;
                    state.options = fd.fields;
                    state.name = state.codename = state.variable = fd.name;
                    fieldsYAML += state.compile();
                    summary += fd.content + "\\n" + "${" + fd.name + ".value}\\n";
                    break;
                case 'CONFIRM':
                    state = new dialogUtils.list();
                    state.prompt = summary + "\\n" + fd.content;
                    state.options = fd.fields;
                    state.name = state.codename = state.variable = fd.name;
                    fieldsYAML += state.compile();
                    var swch = new dialogUtils.switch();
                    swch.name = swch.codename = "SWITCH" + fd.name;
                    swch.variable = fd.name;
                    swch.options = fd.fields;
                    if (swch.options.length > 1) {
                        if(SETTINGS.FORM.SAVE_TO_DB){
                            swch.actions.push({ label: swch.options[0], value: save_form_codename });
                        }
                        else{
                            swch.actions.push({ label: swch.options[0], value: save_form_success_codename });
                        }
                        swch.actions.push({ label: swch.options[1], value: cancel_form_codename });
                        swch.actions.push({ label: 'NONE', value: cancel_form_codename });
                    }
                    fieldsYAML += swch.compile();
                    break;
                case 'INPUT':
                    variables.push(fd.name);
                    state = new dialogUtils.text();
                    state.prompt = fd.content;
                    state.name = state.codename = state.variable = fd.name;
                    fieldsYAML += state.compile();
                    summary += fd.content + "\\n" + "${" + fd.name + ".value}\\n";
                    break;
                default:
                // code block
            }
        }
        reset.variableList = reset.variableList.substring(0, reset.variableList.length - 1);
        s += reset.compile();
        s += fieldsYAML;
        // State to call 'dbupdate' to store data to database
        if(SETTINGS.FORM.SAVE_TO_DB){
            var save = new dialogUtils.dbupdate();
            save.name = save.codename = save_form_codename;
            var sql = "INSERT INTO " + form.name + " VALUES (";
            for(i in variables){
                sql += "'${" +  variables[i] + ".value}',"
            }
            sql = sql.substring(0, sql.length -1) + ")";
            save.sql = sql;
            save.success = "SAVE" + form.name + "SUCCESS";
            save.failure = "SAVE" + form.name + "FAILURE";
            s += save.compile();
        }
        // State to reply success
        var save_success = new dialogUtils.output();
        save_success.name = save_success.codename = save_form_success_codename;
        save_success.text = "Your " + form.name + " has been stored successfully.";
        save_success.return = true;
        s += save_success.compile();
        // State to reply failure
        var save_failure = new dialogUtils.output();
        save_failure.name = save_failure.codename = save_form_failure_codename;
        save_failure.text = "Error storing your data. Please try again later.";
        save_failure.return = true;
        s += save_failure.compile();
        // State to cancel current form flow
        var cancel = new dialogUtils.output();
        cancel.name = cancel.codename = cancel_form_codename;
        cancel.text = "Transaction has been canceled";
        cancel.return = true;
        s += cancel.compile();
    }
    return s;
}

function generateStates(_navigates, _forms) {
    var s = "states:\n";
    if(SETTINGS.LANGUAGE.TRANSLATE){
        s += generateTranslate();
    }
    s += generateIntent(_navigates);
    s += generateUnresolvedState();
    s += generateAllNavigates(_navigates);
    s += generateAllForms(_forms);
    return s;
}

function generateAllYAML(_navigates, _forms, _yamlFile) {

    var s = "";
    s += generateMetadata();
    s += generateContext(_forms);
    s += generateStates(_navigates, _forms);
    fs.writeFile(_yamlFile, s, (err) => {
        if (err) throw err;
        console.log('Dialogflow saved!');
    });
    return s;
}

function generateIntentCSV(_navigates, _csvFile) {
    var s = "query,topIntent,conversationName,answer\n";
    for (i in _navigates) {
        var j = _navigates[i];
        if (j.utterance == null || j.utterance == '') {
            continue;
        }
        var utterances = j.utterance.split("\r\n"); 
        for(k in utterances){
            var ut = utterances[k];
            switch (j.type) {
                case 'FORM':
                    s += "\"" + ut + "\",\"" + j.content + "\",\"" + j.label + "\",\n";
                    break;
                case 'LINK':
                case 'ANSWER':
                case 'FOLDER':
                    s += "\"" + ut + "\",\"" + j.codename + "\",\"" + j.label + "\",\n";
                    break;
                default:
                    //code
            }
        }
    }
    fs.writeFile(_csvFile, s, (err) => {
        if (err) throw err;
        console.log('Intents CSV saved!');
    });
    //console.log(s);
}

function loadNavigate(_navigates, _rows) {
    // `rows` is an array of rows
    // each row being an array of cells.
    //   
    // 0-LEVEL 1
    // 1-LEVEL 2
    // 2-LEVEL 3
    // 3-LEVEL 4
    // 4-LABEL
    // 5-TYPE
    // 6-Content
    // 7-Utterance
    // 8-imageURL
    // 9-videoURL

    var current_o = [0, 0, 0, 0];
    var index = 0;

    for (i in _rows) {
        if (i < (SETTINGS.DATA.NAVIGATE_FIRST_DATA_ROW - 1)) continue;
        var n = new oc();
        if (_rows[i][0] != null && _rows[i][0] != '') n.level = 1;
        if (_rows[i][1] != null && _rows[i][1] != '') n.level = 2;
        if (_rows[i][2] != null && _rows[i][2] != '') n.level = 3;
        if (_rows[i][3] != null && _rows[i][3] != '') n.level = 4;
        if(n.level < 1) continue;
        n.name = _rows[i][n.level - 1];
        n.codename = strUtils.convertToCodeName(n.name);
        if (n.level > 1) {
            n.parent = _navigates[current_o[n.level - 2]].codename;
            n.parentId = current_o[n.level - 2];
            n.codename = n.parent + n.codename;
            _navigates[current_o[n.level - 2]].children.push(n.codename);
            _navigates[current_o[n.level - 2]].childrenId.push(index);
        }
        n.label = _rows[i][4];
        n.type = _rows[i][5].toUpperCase();
        n.content = strUtils.normalizeString(_rows[i][6]);
        n.utterance = _rows[i][7];
        n.imageURL = _rows[i][8];
        n.videoURL = _rows[i][9];
        _navigates.push(n);
        current_o[n.level - 1] = index;
        index++;
    } // end for
}

function loadForms(_forms, _rows) {
    // `_rows` is an array of rows
    // each row being an array of cells.
    // 
    // Form Names
    // Sequence
    // Field Names
    // Content
    // Action
    // Fields
    // Mandatory?

    var fo = null;
    for (i in _rows) {
        if (i < (SETTINGS.DATA.FORMS_FIRST_DATA_ROW - 1)) {
            continue;
        }
        if (_rows[i][0] != null && _rows[i][0] != '') {
            if (fo != null) _forms.push(fo);
            fo = new form();
            fo.name = strUtils.convertToCodeName(_rows[i][0]);
        }
        var fd = new field();
        fd.name = strUtils.convertToCodeName(fo.name + _rows[i][2]);
        fd.content = _rows[i][3];
        fd.action = _rows[i][4].toUpperCase();
        switch (fd.action) {
            case 'SELECT':
                fd.fields = strUtils.parseValueList(_rows[i][5]);
                break;
            case 'INPUT':
                break;
            case 'CONFIRM':
                fd.fields = strUtils.parseValueList(_rows[i][5]);
                break;
            default:
            // code block
        }
        fd.mandatory = (_rows[i][6].toUpperCase() == 'YES');
        fo.fields.push(fd);
    } // end for
    if (fo != null) _forms.push(fo);
}

function generateBotFromXlsx() {
    readXlsxFile(SETTINGS.DATA.FILE, { sheet: SETTINGS.DATA.NAVIGATE_SHEET_NAME })
    .then((rows) => {
        var navigates = [];
        var forms = [];
        loadNavigate(navigates, rows);
        readXlsxFile(SETTINGS.DATA.FILE, { sheet: SETTINGS.DATA.FORMS_SHEET_NAME }).then((rows) => {
            loadForms(forms, rows);
            var yamlFile = SETTINGS.OUTPUT.PATH + SETTINGS.OUTPUT.FILE_PREFIX + SETTINGS.METADATA.FLOW_NAME + '_dialogflow.yaml';
            generateAllYAML(navigates, forms, yamlFile);
            var csvFile = SETTINGS.OUTPUT.PATH + SETTINGS.OUTPUT.FILE_PREFIX + SETTINGS.METADATA.FLOW_NAME + '_intents.csv';
            generateIntentCSV(navigates, csvFile);
        })
    })
}

module.exports.generateBotOffline = function(){
    SETTINGS.OUTPUT.FILE_PREFIX = Date.now() + '-';
    generateBotFromXlsx(); 
}

module.exports.generateBot = function(options){
    if(options.file!=null){
        SETTINGS.DATA.FILE = options.file;
        console.log('set file to: ' + SETTINGS.DATA.FILE);
    }
    if(options.name!=null){
        SETTINGS.METADATA.FLOW_NAME = options.name;
        console.log('set name to: ' + SETTINGS.METADATA.FLOW_NAME);
    }
    if(options.version!=null){
        SETTINGS.METADATA.PLATFORM_VERSION = options.version;
        console.log('set version to: ' + SETTINGS.METADATA.PLATFORM_VERSION);
    }
    if(options.translate!=null){
        SETTINGS.LANGUAGE.TRANSLATE = options.translate;
        console.log('set translate to: ' + SETTINGS.LANGUAGE.TRANSLATE);
    }
    if(options.prefix!=null){
        SETTINGS.OUTPUT.FILE_PREFIX = options.prefix;
        console.log('set prefix to: ' + SETTINGS.OUTPUT.FILE_PREFIX);
    }
    else{
        SETTINGS.OUTPUT.FILE_PREFIX = Date.now() + '-';
    }
    generateBotFromXlsx(); 
    var host = 'http://140.238.18.99/botartifacts/' 
    var result = {
        template: host + options.filename,
        dialog: host + SETTINGS.OUTPUT.FILE_PREFIX + SETTINGS.METADATA.FLOW_NAME + '_dialogflow.yaml',
        intent: host + SETTINGS.OUTPUT.FILE_PREFIX + SETTINGS.METADATA.FLOW_NAME + '_intents.csv'
    }
    return result; 
}



// readXlsxFile('uploads/oda design template v1.3.2.xlsx-1590386724983-266523749', { sheet: SETTINGS.DATA.NAVIGATE_SHEET_NAME })
// .then((rows) => {
//     var navigates = [];
//     var forms = [];
//     loadNavigate(navigates, rows);
//     readXlsxFile(SETTINGS.DATA.FILE, { sheet: SETTINGS.DATA.FORMS_SHEET_NAME }).then((rows) => {
//         loadForms(forms, rows);
//         generateAllYAML(navigates, forms);
//         generateIntentCSV(navigates);
//     })
//     return "success";
// })
