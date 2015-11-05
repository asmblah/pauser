/*
 * Pauser - Wrapper for optional Pausable usage
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/asmblah/pauser/
 *
 * Released under the MIT license
 * https://github.com/asmblah/pauser/raw/master/MIT-LICENSE.txt
 */

'use strict';

module.exports = function (args, wrapper, options) {
    return {
        /**
         * Executes wrapper asynchronously via the Pausable library.
         *
         * @param {Pausable} pausable
         * @returns {*}
         */
        async: function (pausable) {
            return pausable.executeSync(args, wrapper, options);
        },

        /**
         * Executes wrapper synchronously when the Pausable library is not available.
         *
         * @returns {*}
         */
        sync: function () {
            return wrapper.apply(null, args);
        }
    };
};
