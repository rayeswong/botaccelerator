var SETTINGS = {
    METADATA: {
        PLATFORM_VERSION: '1.0',
        FLOW_NAME: 'Selene'
    },
    OUTPUT: {
        PATH: 'output/',
        FILE_PREFIX: '',
    },
    DATA: {
        FILE: 'templates/vfj/Remote Workers - Accelerated Deployment Methodology for Oracle Digital Assistant - IT.xlsx',
        NAVIGATE_SHEET_NAME: 'Navigate',
        NAVIGATE_FIRST_DATA_ROW: 2,
        FORMS_SHEET_NAME: 'Forms',
        FORMS_FIRST_DATA_ROW: 2
    },
    INTENT_STATE: {
        NAME: 'Intent',
        VARIABLE: 'iResult',
        OPTIONSPROMPT: 'Could you pick the topic you are asking?',
        UNRESOLVED_STATE: 'Menu'
    },
    UNRESOLVED_STATE: {
        NAME: 'Unresolved',
        TEXT: 'I am sorry. I don\'t understand what you said. You can type \'Menu\' to get the list of services that I can support.'
    },
    BACK: {
        GENERATE: true,
        LABEL: '< Back'
    },
    FORM: {
        SAVE_TO_DB: true
    },
    LEVEL: 4,
    LANGUAGE: {
        TRANSLATE: false,
        SOURCE: 'ko',
        VARIABLE: 'translated',
        DETECT_STATE: 'DetectLanguage',
        TRANSLATE_STATE: 'TranslateInput'
    }
}

module.exports = SETTINGS;