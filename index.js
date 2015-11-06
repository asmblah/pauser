/*
 * Pauser - Wrapper for optional Pausable usage
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/pauser/
 *
 * Released under the MIT license
 * https://github.com/asmblah/pauser/raw/master/MIT-LICENSE.txt
 */

'use strict';

var Wrapper = require('./src/Wrapper');

module.exports = function (args, wrapper, options) {
    return new Wrapper(args, wrapper, options);
};
