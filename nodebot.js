var phantom=require('node-phantom');
phantom.create(start, {});



function start (err, phantom) {
 // var page = require('webpage').create();

  return phantom.createPage(function(err, page) {

    console.log('Tick');

    page.onConsoleMessage = function(msg) {
        console.log(msg);
    };


    page.open("http://studentcenter.cornell.edu", function(err, status) {
      console.log('Tick' + status);

        if ( status === "success" ) {
          console.log('Tick');

            page.evaluate(function() {
                  // console.log(document.documentElement.innerHTML);

                  document.querySelector("input[name='netid']").value    = "netid";
                  document.querySelector("input[name='password']").value = "password";
                  document.querySelector("form[name='login']").submit();

                  console.log("Login submitted!");

                  page.render('github.png');


                  // document.getElementById("DERIVED_SSS_SCL_LINK_ADD_ENRL").click();
                  


                  page.render('github.png');
            });
            console.log('Tick');


            setTimeout(function () {
              console.log('Tick');

              page.render('screen.png');
              phantom.exit();
            }, 5000);
       }
    });
  });
  
}