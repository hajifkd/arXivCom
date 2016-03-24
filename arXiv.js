'use strict';

let browser = chrome;

let templateDir = 'templates/';
let templateNames = ['comment', 'comment_box'];
let templateExtension = '.html';
let templates = {};

const AID_REGEXP = /abs\/([a-z\-\.]+\/[0-9]+|[0-9]{4}\.[0-9]{4,5})/;

const BASE_URL = 'http://192.168.56.100:8000/';
const LIST_COMMENT = 'list/';
const SEND_COMMENT = 'comment/';
const USER_INFO = 'user_info/';
const LOGIN = 'accounts/login/'

function _start() {
  // Add css
  let style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.href = browser.extension.getURL('css/arXiv_style.css');
  (document.head||document.documentElement).appendChild(style);
  
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

function renewComments(aid, commentArea) {
  $.get(BASE_URL + LIST_COMMENT + aid).then(
    (comments) => {
      for (let comment of comments) {
        // maybe we can search inspire by orcid and set the profile page
        let commentHTML = templates['comment'].render(comment);
        commentArea.append(commentHTML);
      }
    },
    () => {
      // jump to the login page?
    }
  );
}

function main() {
  let title = $('h1.title')[0].innerText;
  let authors = $('div.authors')[0].innerText.split(',');
  let aid = AID_REGEXP.exec(location.href)[1];
  
  let commentBox = templates['comment_box'];
  $("div.endorsers").after(commentBox.render({title: title}));
  
  let commentTextArea = $('textarea#comment_text');
  let commentArea = $('div#comments');
  let commentForm = $('form#send_comment');
  
  commentForm.submit(() => {
    
    let comment = commentTextArea.val();
    if (!comment) return false;
    
    commentTextArea.val('');
    let data = {text: comment};
    
    $.ajax({
      type: 'POST',
      url: BASE_URL + SEND_COMMENT + aid,
      contentType: 'application/json',
      dataType : 'JSON',
      data: JSON.stringify(data)
    }).then(
      () => {
        commentArea.html('');
        renewComments(aid, commentArea);
      },
      () =>{
        // jump to the login page?
      }
    );
    
    return false;
  });
  
  renewComments(aid, commentArea);
}

$(_start);