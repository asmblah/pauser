/*
 * Pauser - Wrapper for optional Pausable usage
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/pauser/
 *
 * Released under the MIT license
 * https://github.com/asmblah/pauser/raw/master/MIT-LICENSE.txt
 */

'use strict';

var pauser = require('../..'),
    Wrapper = require('../../src/Wrapper');

describe('API', function () {
    it('should export a function', function () {
        expect(pauser).to.be.a('function');
    });

    describe('the exported function', function () {
        it('should return an instance of Wrapper', function () {
            expect(pauser()).to.be.an.instanceOf(Wrapper);
        });
    });
});
