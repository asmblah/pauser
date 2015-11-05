/*
 * Pauser - Wrapper for optional Pausable usage
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/pauser/
 *
 * Released under the MIT license
 * https://github.com/asmblah/pauser/raw/master/MIT-LICENSE.txt
 */

'use strict';

var pauser = require('../..');

describe('Pauser', function () {
    beforeEach(function () {
        this.args = [];
        this.wrapper = sinon.stub();
        this.options = {};

        this.callPauser = function () {
            return pauser(this.args, this.wrapper, this.options);
        }.bind(this);
    });

    it('should return an object', function () {
        expect(pauser()).to.be.an('object');
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

            this.callPauser().async(this.pausable);

            expect(this.pausable.executeSync).to.have.been.calledWith(this.args, this.wrapper, this.options);
        });

        it('should return the result from Pausable', function () {
            this.pausable.executeSync.returns(123);

            expect(this.callPauser().async(this.pausable)).to.equal(123);
        });
    });

    describe('sync()', function () {
        it('should call the wrapper function', function () {
            this.callPauser().sync();

            expect(this.wrapper).to.have.been.calledOnce;
        });

        it('should use null as the wrapper function\'s thisArg', function () {
            this.callPauser().sync();

            expect(this.wrapper).to.have.been.calledOn(null);
        });

        it('should return the result from the wrapper function', function () {
            this.wrapper.returns('my result');

            expect(this.callPauser().sync()).to.equal('my result');
        });
    });
});
