'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('Helper');

logger.setLevel('INFO');

var getLogger = function (moduleName) {
	var logger = log4js.getLogger(moduleName);
	logger.setLevel('INFO');
	return logger;
};

exports.getLogger = getLogger;
