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
    this.fn = fn;
    this.options = options;
}

_.extend(Wrapper.prototype, {
    /**
     * Executes wrapper asynchronously via the Pausable library.
     *
     * @param {Pausable} pausable
     * @returns {*}
     */
    async: function (pausable) {
        var wrapper = this,
            // Recursively transpile any arguments to the function that are themselves Wrappers
            args = _.map(wrapper.args, function (arg) {
                if (arg instanceof Wrapper) {
                    return arg.async(pausable);
                }

                return arg;
            });

        return pausable.executeSync(args, wrapper.fn, wrapper.options);
    },

    /**
     * Executes wrapper synchronously when the Pausable library is not available.
     *
     * @returns {*}
     */
    sync: function () {
        var wrapper = this,
            // Recursively evaluate any arguments to the function that are themselves Wrappers
            args = _.map(wrapper.args, function (arg) {
                if (arg instanceof Wrapper) {
                    return arg.sync();
                }

                return arg;
            });

        return wrapper.fn.apply(null, args);
    }
});

module.exports = Wrapper;
