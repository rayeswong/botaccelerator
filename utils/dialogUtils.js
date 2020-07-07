module.exports.variable = function () {
    this.name = '',
    this.type = '';
}

module.exports.action = function () {
    this.label = '',
    this.value = '';
}

module.exports.responseItem = function () {
    this.label = "";
    this.action = "";
    this.url = "";
    this.type = "";
}

module.exports.metadata = function () {
    this.version = '';
    this.name = '';
    this.YAML;
    this.compile = function () {
        var s = "metadata:\n"
            + "  platformVersion: \"" + this.version + "\"\n"
            + "main: true\n"
            + "name: " +  this.name + "\n";
        this.YAML = s;
        return s;
    }
}

module.exports.context = function () {
    this.variables = [];
    this.YAML;
    this.compile = function () {
        var s = "";
        s += "context:\n"
           + "  variables: \n";
        for (i in this.variables) {
            s += "    " + this.variables[i].name + ": \"" +  this.variables[i].type + "\"\n";
        }
        this.YAML = s;
        return s;
    }
}

module.exports.intent = function () {
    this.name = "";
    this.codename = "";
    this.component = "System.Intent";
    this.sourceVariable = "";
    this.optionsPrompt = "";
    this.variable = "";
    this.unresolved = "";
    this.intents = [];
    this.YAML;
    this.compile = function () {
        var s = "";
        s += "  Intent:\n"
           + "    component: \"" + this.component + "\"\n"
           + "    properties:\n"
           + "      variable: \"" + this.variable + "\"\n";
        if(this.sourceVariable != ""){
            s += "      sourceVariable: \"" + this.sourceVariable + "\"\n";
        }
        if(this.optionsPrompt != ""){
            s += "      optionsPrompt: \"" + this.optionsPrompt + "\"\n";
        }
        s += "    transitions:\n"
           + "      actions:\n"
           + "        unresolvedIntent: \"" + this.unresolved + "\"\n";   
        if (this.intents.length > 0) {
            for (i in this.intents) {
                s += "        " + this.intents[i] + ": \"" + this.intents[i] + "\"\n";
            }
        }
        this.YAML = s;
        return s;
    }
}

module.exports.detectLanguage = function () {
    this.name = "";
    this.codename = "";
    this.component = "System.DetectLanguage";
    this.YAML;
    this.compile = function () {
        var s = "";
        s += "  " + this.codename + ":\n"
           + "    component: \"" + this.component + "\"\n";
        this.YAML = s;
        return s;
    }
}

module.exports.translateInput = function () {
    this.name = "";
    this.codename = "";
    this.component = "System.TranslateInput";
    this.variable = "";
    this.YAML;
    this.compile = function () {
        var s = "";
        s += "  " + this.codename + ":\n"
           + "    component: \"" + this.component + "\"\n"
           + "    properties:\n"
           + "      variable: \"" + this.variable + "\"\n";
        this.YAML = s;
        return s;
    }
}

module.exports.output = function () {
    this.name = "";
    this.codename = "";
    this.component = "System.Output";
    this.text = "";
    this.keepTurn = false;
    this.return = false;
    this.YAML;
    this.compile = function () {
        var s = "";
        s += "  " + this.codename + ":\n"
           + "    component: \"" + this.component + "\"\n"
           + "    properties:\n"
           + "      text: \"" + this.text + "\"\n";
        if(this.return == true){
            s += "    transitions:\n"
               + "      return: \"" + this.codename + "\"\n";   
        }
        this.YAML = s;
        return s;
    }
}

module.exports.text = function () {
    this.name = "";
    this.codename = "";
    this.component = "System.Text";
    this.prompt = "";
    this.variable = "";
    this.YAML;
    this.compile = function () {
        var s = "";
        s += "  " + this.codename + ":\n"
           + "    component: \"" + this.component + "\"\n"
           + "    properties:\n"
           + "      prompt: \"" + this.prompt + "\"\n"
           + "      variable: \"" + this.variable + "\"\n"
           + "    transitions: {}\n";
        this.YAML = s;
        return s;
    }
}

module.exports.list = function () {
    this.name = "";
    this.codename = "";
    this.component = "System.List";
    this.prompt = "";
    this.variable = "";
    this.options = [];
    this.YAML;
    this.compile = function () {
        var s = "";
        s += "  " + this.codename + ":\n"
           + "    component: \"" + this.component + "\"\n"
           + "    properties:\n"
           + "      prompt: \"" + this.prompt + "\"\n"
           + "      options:\n";
        for(i in this.options){
            var option = this.options[i];
            s += "      - label: \"" + option + "\"\n"
               + "        value: \"" + option + "\"\n";
        }
        s += "      variable: \"" + this.variable + "\"\n"
           + "    transitions: {}\n";
        this.YAML = s;
        return s;
    }
}

module.exports.resetVariables = function () {
    this.name = "";
    this.codename = "";
    this.component = "System.ResetVariables";
    this.variableList = "";
    this.YAML;
    this.compile = function () {
        var s = "";
        s += "  " + this.codename + ":\n"
           + "    component: \"" + this.component + "\"\n"
           + "    properties:\n"
           + "      variableList: \"" + this.variableList + "\"\n";
        this.YAML = s;
        return s;
    }
}

module.exports.resetVariables = function () {
    this.name = "";
    this.codename = "";
    this.component = "System.ResetVariables";
    this.variableList = "";
    this.YAML;
    this.compile = function () {
        var s = "";
        s += "  " + this.codename + ":\n"
           + "    component: \"" + this.component + "\"\n"
           + "    properties:\n"
           + "      variableList: \"" + this.variableList + "\"\n";
        this.YAML = s;
        return s;
    }
}

module.exports.switch = function () {
    this.name = "";
    this.codename = "";
    this.component = "System.Switch";
    this.variable = "";
    this.options = [];
    this.actions = [];
    this.YAML;
    this.compile = function () {
        var s = "";
        s += "  " + this.codename + ":\n"
           + "    component: \"" + this.component + "\"\n"
           + "    properties:\n"
           + "      variable: \"" + this.variable + "\"\n"
           + "      values:\n";
        for(i in this.options){
            var option = this.options[i];
            s += "      - \"" + option + "\"\n";
        }
        s += "    transitions:\n"
          + "      actions:\n";
        for(i in this.actions){
            var action = this.actions[i];
            s += "        " + action.label + ": \"" + action.value + "\"\n";
        }
        this.YAML = s;
        return s;
    }
}

module.exports.commonresponse = function () {
    this.name = "";
    this.codename = "";
    this.content = "";
    this.imageURL = "";
    this.videoURL = "";
    this.responseItems = [];
    this.component = "System.CommonResponse";
    this.processUserMessage = true;
    this.textReceived = "";
    this.return = false;
    this.YAML; 
    this.compile = function () {
        var s = "";
        s += "  " + this.codename + ":\n"
           + "    component: \"" + this.component + "\"\n"
           + "    properties:\n"
           + "      processUserMessage: " + this.processUserMessage + "\n"
           + "      metadata:\n"
           + "        responseItems:\n";
        if (this.imageURL != null && this.imageURL != "") {
            s += "          - type: \"attachment\"\n"
               + "            attachmentType: \"image\"\n"
               + "            name: \"image\"\n"
               + "            attachmentUrl: \"" + this.imageURL + "\"\n";              
        }
        if (this.videoURL != null && this.videoURL != "") {
            s += "          - type: \"attachment\"\n"
               + "            attachmentType: \"video\"\n"
               + "            name: \"video\"\n"
               + "            attachmentUrl: \"" + this.videoURL + "\"\n";              
        }
        s+= "          - type: \"text\"\n"
          + "            text: \"" + this.content + "\"\n"
          + "            separateBubbles: true\n";
        if (this.responseItems.length > 0) {
            s+= "            actions:\n";

            for (i in this.responseItems) {
                var r = this.responseItems[i];
                s+= "            - label: \"" + r.label + "\"\n"
                  + "              type: \"" + r.type + "\"\n"
                  + "              payload:\n";
                if(r.type=='postback'){
                    s+= "                action: \"" + r.action + "\"\n";
                }
                else if(r.type=='url'){
                    s+= "                url: \"" + r.url + "\"\n";
                }
                s+= "              name: \""  + r.label + "\"\n";

            }
        }
        if (this.return){
            s += "    transitions:\n"
               + "      return: \"" + this.codename + "\"\n";         
        }
        else{
            s += "    transitions:\n"
               + "      actions:\n";
            if (this.textReceived != ""){
                s += "        textReceived: \"" + this.textReceived + "\"\n";     
            }
            if (this.responseItems.length > 0) {
                for (i in this.responseItems) {
                    var r = this.responseItems[i];
                    if (r.type == 'postback') {
                        s += "        " + r.action + ": \"" + r.action + "\"\n";
                    }
                }
            }
        }

        this.YAML = s;
        return s;
    }
}

module.exports.dbupdate = function () {
    this.name = "";
    this.codename = "";
    this.component = "dbupdate";
    this.sql = "";
    this.success = "";
    this.failure = "";
    this.YAML;
    this.compile = function () {
        var s = "";
        s += "  " + this.codename + ":\n"
           + "    component: \"" + this.component + "\"\n"
           + "    properties:\n"
           + "      sql: \"" + this.sql + "\"\n"
           + "    transitions:\n"
           + "      actions:\n"
           + "        success: \"" + this.success + "\"\n" 
           + "        failure: \"" + this.failure + "\"\n";   
        this.YAML = s;
        return s;
    }
}

