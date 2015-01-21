'use strict';


var express     = require('express'),
    app         = express(),
    fs          = require('fs'),
    browserify  = require('browserify'),
    reactify    = require('reactify'),
    React       = require('react'),
    Router      = require('react-router')
;

require('hbs');
app.set('view engine', 'hbs');

var data = {
  youtube: [
    { id: 'XxVg_s8xAms', title: 'Introduction to React.js' },
    { id: '-DX3vJiqxm4', title: 'Pete Hunt - The Secrets of React\'s Virtual DOM (FutureJS 2014)', },
    { id: 'lAn7GVoGlKU', title: 'Building UIs with ReactJS'},
    { id: 'i__969noyAM', title: 'React and Flux: Building Applications with a Unidirectional Data Flow'}
  ],
  vimeo: [
    { id: '108488724',  title: 'Andres Suarez | Server Rendered Single-Page Apps / Day 1'},
    { id: '97516219',   title: 'Christian Johansen - Functional UI programming with React.JS and ClojureScript'},
    { id: '92687646',   title: 'ReactJS by Adam Solove'},
    { id: '103201888',  title: 'Fire Up React.js'}
  ]
};

require('node-jsx').install({ harmony: true });
var routes = require('./routes')();

app.get('/bundle.js', function(req, res) {
  res.setHeader('content-type', 'application/javascript');
  browserify('./browser')
    .transform({ harmony: true }, reactify)
    .bundle()
    .pipe(res)
  ;
});

// 全routingに対して、reactを使う場合
// var Handlebars  = require('handlebars');
// var template = Handlebars.compile(fs.readFileSync('./index.hbs').toString());
// app.use(function(req, res) {
//   Router.run(routes, req.path, function(Handler) {
//     res.send(template({
//       initialData: JSON.stringify(data),
//       markup: React.renderToString(React.createElement(Handler, {params: {videos: data}}))
//     }));
//   });
// });

app.get(/^\/videos/, function(req, res) {
  console.log('req.path is ', req.path);
  Router.run(routes, req.path, function(Handler) {
    res.render('index', {
      initialData: JSON.stringify(data),
      markup: React.renderToString(React.createElement(Handler, {params: {videos: data}}))
    });
  });
});

app.get('/hoge', function(req, res) {
  res.render('hoge', {
    foo: 'HELLO FOO'
  });
});

var port = process.env.PORT || 5000;
console.log("listening..." + port);
app.listen(port);
