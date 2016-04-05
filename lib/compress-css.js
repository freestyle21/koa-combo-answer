/*
 * Author: qubaoming@gmail.com
 */

"use strict";

const qs = require('querystring');
const cleanCSS = require('clean-css');
const bluebird = require('bluebird');
const debug = require('debug')('koa-combo-parse:miniCSS');
const CleanCSSInstance = new cleanCSS({
    advanced: false
});

module.exports = function *(source) {
    return yield new bluebird(function (resolve, reject) {
        CleanCSSInstance.minify(source, function (errors, minified) {
            if(errors) {
                return reject(source);
            }
            return resolve(minified.styles);
        });
    });
};
