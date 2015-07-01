//sw.js
//importScripts("/push/sw/jquery.min.js");


self.addEventListener('push', function(e) {
  console.log('push received');

  //Get the notification data, then display notification
  // fetchNotDataJSONP();
  fetchNotData();
});


function fetchNotDataJSONP() {
  console.log('fetching JSONP...');
  //uses jquery
   // var url = 'http://mobiforge.com/m/subscribe.php';
  $.getJSON("http://mobiforge.com/m/latest.php?callback=?", function(result){
    //response data are now in the result variable
    console.log(result);
    showNotification(result);
  });
}


function fetchNotData() {
  fetch("http://mobiforge.com/m/latest.php", {mode:"cors"}).then(function(res) {
    res.json().then(function(data) {
          // Show notification
      console.log(data);
          //self.registration.showNotification(data.title, {
          //body: data.body,
          //icon: data.icon,
          //tag: data.tag
        //})
    showNotification(result);
    })
  })
}

function showNotification(notificationData) {
  console.log('setting up notification');
    if(Notification.permission=='granted') {
          var notification = new Notification(notificationData.data.title, {  
            body: notificationData.data.body,
            icon: 'favicon.ico' 
        }); 

     notification.onclick = function() {console.log('click');
    window.open(notificationData.data.url, '_blank');
      //win.focus();
        } 

    }
    else {
      Notification.requestPermission(function(permission) {
      if(permission=='granted') {
        var notification = new Notification(notificationData.data.title, {  
            body: notificationData.data.body,
            icon: 'favicon.ico' 
        });  
        notification.onclick = function() {console.log('click');
    var win = window.open(notificationData.data.url, '_blank');
      win.focus();
        } 
      }          
    });
    }
}
