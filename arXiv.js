'use strict';

var browser = chrome;

var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = browser.extension.getURL('css/arXiv_style.css');
(document.head||document.documentElement).appendChild(style);

var templateDir = 'templates/';
var templateNames = ['comment', 'comment_box'];
var templateExtension = '.templ';
var templates = {};

function _start() {
  let promiseList = [];
  
  for (let t of templateNames) {
    let url = browser.extension.getURL(templateDir + t + templateExtension);
    let key = t;
    let promise = Promise.resolve($.get(url)).then(data => {
      templates[key] = Hogan.compile(data);
    });
    promiseList.push(promise);
  }
  
  Promise.all(promiseList).then(main);
}

function main() {
  let title = $('h1.title')[0].innerText;
  let authors = $('div.authors')[0].innerText.split(',');
  let commentBox = templates['comment_box'];
  $("div.endorsers").after(commentBox.render({title: title}));
}

$(_start);