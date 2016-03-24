# koa-combo-answer

a middleware for koa. parse combo url for seajs-combo.

## install

```javascript
npm install koa-combo-answer --save
```

## eg.

```javascript
const path = require('path');
const app = require('koa')();
const comboAnswer = require('koa-combo-answer');

app.use(comboAnswer({
    miniCSS: true,
    comboSyntax: ['?', '&'],
    base: path.resolve(__dirname, './htdocs')
}));

```

## params

### miniCSS(boolean)

Is compress css, default for `false`

### base(string)

static files dir.

## then

```javascript
URL: http://www.example.com/js/lib/??a.js,b.js,c.js
URL: http://www.example.com/js/lib/?a.js&b.js&c.js

Request: http://www.example.com/js/lib/a.js
		 http://www.example.com/js/lib/b.js
		 http://www.example.com/js/lib/c.js
```