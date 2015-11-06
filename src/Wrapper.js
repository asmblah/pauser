/*
 * Pauser - Wrapper for optional Pausable usage
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/pauser/
 *
 * Released under the MIT license
 * https://github.com/asmblah/pauser/raw/master/MIT-LICENSE.txt
 */

'use strict';

var _ = require('microdash');

function Wrapper(args, fn, options) {
    this.args = args;
    this.evaluatedAsync = false;
    this.evaluatedSync = false;
    this.asyncReturnValue = null;
    this.fn = fn;
    this.options = options;
    this.syncReturnValue = null;
}

_.extend(Wrapper.prototype, {
    /**
     * Executes wrapper asynchronously via the Pausable library.
     *
     * @param {Pausable} pausable
     * @returns {*}
     */
    async: function (pausable) {
        var args,
            wrapper = this;

        if (wrapper.evaluatedAsync) {
            return wrapper.asyncReturnValue;
        }

        // Recursively transpile any arguments to the function that are themselves Wrappers
        args = _.map(wrapper.args, function (arg) {
            if (arg instanceof Wrapper) {
                return arg.async(pausable);
            }

            return arg;
        });

        wrapper.asyncReturnValue = pausable.executeSync(args, wrapper.fn, wrapper.options);
        wrapper.evaluatedAsync = true;

        return wrapper.asyncReturnValue;
    },

    /**
     * Executes wrapper synchronously when the Pausable library is not available.
     *
     * @returns {*}
     */
    sync: function () {
        var args,
            wrapper = this;

        if (wrapper.evaluatedSync) {
            return wrapper.syncReturnValue;
        }

        // Recursively evaluate any arguments to the function that are themselves Wrappers
        args = _.map(wrapper.args, function (arg) {
            if (arg instanceof Wrapper) {
                return arg.sync();
            }

            return arg;
        });

        wrapper.syncReturnValue = wrapper.fn.apply(null, args);
        wrapper.evaluatedSync = true;

        return wrapper.syncReturnValue;
    }
});

module.exports = Wrapper;
