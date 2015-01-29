'use strict';
var Browser = require("zombie")
var table2json = require('table2json');
var nodemailer = require("nodemailer");
var creds = require('./creds.json');

var netid = creds.netid;
var pass = creds.password;
var notify_at = "mr.kev@me.com";
var url = "https://selfservice.adminapps.cornell.edu/psc/cuselfservice/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_ADD.GBL?Page=SSR_SSENRL_ADD&Action=A"

var transport = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
        user: "keh222@cornell.edu",
        pass: pass
    }
});

var browser = new Browser({ debug: true });




function notify (clss) {
  transport.sendMail({
      from: "Checker <foo@blurdybloop.com>", // sender address
      to: notify_at, // list of receivers
      subject: clss['Class'] + " " + clss['Status'], // Subject line
      text: url, // plaintext body
      html:'<a href="' + url + '">' + url + '</a>'
  }, console.error);
}


function check_classes (bwsr) {

  console.log('checking classes')

  var table = bwsr.query(".PSLEVEL1GRIDWBO");

  if (!table) {
    console.log('Not logged in?')
    return [];
  }

  var classes = table2json.parse(table).map(function (clss) {

    delete clss['Delete'];

    var keys = Object.keys(clss);

    for (var i = 0; i < keys.length; i++) {
      if (keys[i] === 'Status') {
        clss['Status'] = clss[keys[i]]
          .indexOf('/cs/cuselfservice/cache/PS_CS_STATUS_CLOSED_ICN_1.gif') > -1 ? 'CLOSED' : 'OPEN';
        continue;
      }
      clss[keys[i]] = clss[keys[i]].replace(/(<([^>]+)>)/ig,"");
      clss[keys[i]] = clss[keys[i]].replace(/(\r\n|\n|\r)/gm,"");
    };
    return clss;
  });

  return classes;
}


function do_the_thing (browser) {
  var classes = check_classes(browser);
  
  for (var i = classes.length - 1; i >= 0; i--) {
    if (classes[i]['Status'] === 'OPEN') notify(classes[i]);
  };

  setTimeout(function () {
    browser.reload(function () {
      do_the_thing(browser);
    });
  }, 10000);
}


browser.visit(url, function () {

  // Login
  browser.fill('netid', netid).fill('password', pass);
  browser.pressButton('input[type=submit]', function() {
    do_the_thing(browser); 
  });
});
