/*
 * Pauser - Wrapper for optional Pausable usage
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/pauser/
 *
 * Released under the MIT license
 * https://github.com/asmblah/pauser/raw/master/MIT-LICENSE.txt
 */

'use strict';

var Wrapper = require('../../src/Wrapper');

describe('Wrapper', function () {
    beforeEach(function () {
        this.args = [];
        this.fn = sinon.stub();
        this.options = {};

        this.createWrapper = function () {
            return new Wrapper(this.args, this.fn, this.options);
        }.bind(this);
    });

    describe('async()', function () {
        beforeEach(function () {
            this.pausable = {
                executeSync: sinon.stub()
            };
        });

        it('should call the wrapper via Pausable', function () {
            this.args.push(1, 2, 3);
            this.options.strict = true;

            this.createWrapper().async(this.pausable);

            expect(this.pausable.executeSync).to.have.been.calledWith(this.args, this.fn, this.options);
        });

        it('should return the result from Pausable', function () {
            this.pausable.executeSync.returns(123);

            expect(this.createWrapper().async(this.pausable)).to.equal(123);
        });
    });

    describe('sync()', function () {
        it('should call the wrapper function', function () {
            this.createWrapper().sync();

            expect(this.fn).to.have.been.calledOnce;
        });

        it('should use null as the wrapper function\'s thisArg', function () {
            this.createWrapper().sync();

            expect(this.fn).to.have.been.calledOn(null);
        });

        it('should return the result from the wrapper function', function () {
            this.fn.returns('my result');

            expect(this.createWrapper().sync()).to.equal('my result');
        });
    });
});
