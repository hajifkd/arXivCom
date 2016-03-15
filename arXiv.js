'use strict';

var browser = chrome;

var template = `<p>%s</p>`;

$(function() {
  var title = $('h1.title')[0].innerText;
  var authors = $('div.authors')[0].innerText.split(',');
  $("div.endorsers").after(`<div class='comment metatable'>
  <h3>Comments on <span class='ctitle'>${title}</span></h3>
  <form>
    <textarea>some text</textarea>
  </form>
</div>`);
console.log($("div.endorsers"));
  console.log(title);
  console.log(authors);
});