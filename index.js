/*
 * Author: qubaoming@gmail.com
 */

"use strict";

const path = require('path');
const url = require('url');
const qs = require('querystring');
const bluebird = require('bluebird');
const fs = require('co-fs-extra');
const mime = require('mime');
const util = require('./lib/util');
const compressCSS = require('./lib/compress-css');
const debug = require('debug')('koa-combo-parse');

module.exports = function(opts) {
    return function *(next){
        // opts.comboSyntax = ['?', ',']

        var comboSyntax = opts.comboSyntax || ['?', ',']
        var parsedURL = url.parse(this.url);
        var pathname = parsedURL.pathname;
        
        var queryObj = {q: (parsedURL.query ? parsedURL.query.replace(/\s/g, '') : '')}

        
        // var queryObj = util.queryHandler(parsedURL.query ? parsedURL.query.replace(/\s/g, '') : '');
        debug('query: %o', queryObj);
        debug('pathname: %s', pathname);

        if(comboSyntax[1] == '&' && queryObj.q) {
            queryObj.q = '?' + queryObj.q;
        }

        var sourceList = queryObj.q.replace(comboSyntax[0], '').split(comboSyntax[1]);
        var extname = path.extname(sourceList[0]) || '.html';
        var codes = [];

        /* URL格式校验, 禁止包含'..' */
        if(/^\?/.test(queryObj.q) && !/\.\./g.test(this.url)) {
            this.set('content-type', mime.lookup(extname));

            debug("extname: %s, mime: %s", extname, mime.lookup(extname));
            for(var j = 0, l = sourceList.length; j < l; j++) {
                var sourceItem = sourceList[j];
                sourceItem = sourceItem.replace(/\?.*/, '')
                try {
                    var code = yield fs.readFile(path.join((opts.base || ''), pathname, sourceItem));
                } catch(e) {
                    continue;
                }

                codes.push(new Buffer(code).toString());
            }
        };

        if(codes.length > 0) {
            var sourceCode = codes.join('\n');
            if(extname == '.css' && (opts.miniCSS || queryObj.m)) {
                this.body = yield compressCSS(sourceCode);
            } else {
                this.body = sourceCode;
            }
        } else {
            yield next;
        }
    }
}
