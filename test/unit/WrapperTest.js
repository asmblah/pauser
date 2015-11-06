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
        this.pausable = {
            executeSync: sinon.stub()
        };

        this.createWrapper = function () {
            return new Wrapper(this.args, this.fn, this.options);
        }.bind(this);
    });

    describe('async()', function () {
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

        it('should map any args that are instances of Wrapper to their async versions', function () {
            var otherWrapper = sinon.createStubInstance(Wrapper);
            otherWrapper.async.returns('my other exports');
            this.args.push(otherWrapper);

            this.createWrapper().async(this.pausable);

            expect(this.pausable.executeSync).to.have.been.calledWith(['my other exports']);
        });

        it('should cache the result from fn for future calls', function () {
            var result1,
                result2,
                wrapper;

            this.pausable.executeSync = function (args, fn) {
                return fn.apply(null, args);
            };
            this.fn.onFirstCall().returns('first');
            this.fn.onSecondCall().returns('second');
            wrapper = this.createWrapper();

            result1 = wrapper.async(this.pausable);
            result2 = wrapper.async(this.pausable);

            expect(result2).to.equal(result1);
            expect(result1).to.equal('first');
        });

        it('should cache the result from fn for future calls when null', function () {
            var result1,
                result2,
                wrapper;

            this.pausable.executeSync = function (args, fn) {
                return fn.apply(null, args);
            };
            this.fn.onFirstCall().returns(null);
            this.fn.onSecondCall().returns('second');
            wrapper = this.createWrapper();

            result1 = wrapper.async(this.pausable);
            result2 = wrapper.async(this.pausable);

            expect(result2).to.equal(result1);
            expect(result1).to.be.null;
        });
    });

    describe('sync()', function () {
        beforeEach(function () {
            delete this.pausable;
        });

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

        it('should map any args that are instances of Wrapper to their sync versions', function () {
            var otherWrapper = sinon.createStubInstance(Wrapper);
            otherWrapper.sync.returns('my other exports');
            this.args.push(otherWrapper);

            this.createWrapper().sync();

            expect(this.fn).to.have.been.calledWith('my other exports');
        });

        it('should cache the result from fn for future calls', function () {
            var result1,
                result2,
                wrapper;

            this.fn.onFirstCall().returns('first');
            this.fn.onSecondCall().returns('second');
            wrapper = this.createWrapper();

            result1 = wrapper.sync();
            result2 = wrapper.sync();

            expect(result2).to.equal(result1);
            expect(result1).to.equal('first');
        });

        it('should cache the result from fn for future calls when null', function () {
            var result1,
                result2,
                wrapper;

            this.fn.onFirstCall().returns(null);
            this.fn.onSecondCall().returns('second');
            wrapper = this.createWrapper();

            result1 = wrapper.sync();
            result2 = wrapper.sync();

            expect(result2).to.equal(result1);
            expect(result1).to.be.null;
        });
    });

    describe('async() and sync()', function () {
        it('should not share exports between each other', function () {
            var result1,
                result2,
                wrapper;

            this.pausable.executeSync = function (args, fn) {
                return fn.apply(null, args);
            };
            this.fn.onFirstCall().returns('first');
            this.fn.onSecondCall().returns('second');
            wrapper = this.createWrapper();

            result1 = wrapper.async(this.pausable);
            result2 = wrapper.sync();

            expect(result1).to.equal('first');
            expect(result2).to.equal('second');
        });
    });
});
