var debugging = 1;

chrome.runtime.onInstalled.addListener(function() {
  var settings = {
    "quests": 1,
    "energy": 1,
    "steps": 1,
    "messages": 1,
    "notifications": 1
  }
  //console.log(settings);
  chrome.storage.local.set({notifications: settings}, function() {
    check();
  });
});

var notificationSettings = null;
var number = 0;



async function check() {
  chrome.storage.local.get(['notifications'], function(result) {
    if(debugging == 1){console.log(result.notifications)};
    notificationSettings = result.notifications;
    if(debugging == 1){console.log(notificationSettings)};
  });  
  var id = console.log(Math.floor(Math.random() * Math.floor(10000000)));
  var notifications = [];
  let promise = new Promise((resolve, reject) => {
      $.get("https://web.simple-mmo.com/api/extension", function(data, status) {
          setTimeout(() => resolve(data), 1000)
          if(debugging == 1){console.log(data)};
      });
  });

  let promise2 = new Promise((resolve, reject) => {
    $.get("https://web.simple-mmo.com/mobapi", function(data, status) {
        setTimeout(() => resolve(data), 1000)
        if(debugging == 1){console.log(data)};
    });
});


  let result = await promise; 
  let result2 = await promise2; 

  //console.log(result);
  //console.log(result2);

  number = 0;
  if(result.questPoints == result.maximumQuestPoints){
    if(notificationSettings.quests == 1){
      notifications.push({ title: "Quests", message: "full (" + result.questPoints + "/" + result.maximumQuestPoints + ")"});
      number++;
    }
  }
  if(result.steps == result.stepsMax){
    if(notificationSettings.steps == 1){
      notifications.push({ title: "Steps", message: "full (" + result.steps + "/" + result.stepsMax + ")"});
      number++;
    }
  }
  if(result2.energy == result2.max_energy){
    if(notificationSettings.energy == 1){
      notifications.push({ title: "Energy", message: "full (" + result2.energy + "/" + result2.max_energy + ")"});
      number++;
    }
  }

  if(result2.events > 0){
    if(notificationSettings.notifications == 1){
      notifications.push({ title: "Notifications", message: result2.events + " new"});
      number++;
    } 
  }

  if(result2.messages > 0){
    if(notificationSettings.messages == 1){
      notifications.push({ title: "Messages", message: result2.messages + " new"});
      number++;
    } 
  }
  if(debugging == 1){console.log(number)};
  if(number == 5){
    notifications = [];
    notifications.push({ title: "Full Caps", message: "S" + result.steps + "/" + result.stepsMax + ", E" + result2.energy + "/" + result2.max_energy + ", Q" + result.questPoints + "/" + result.maximumQuestPoints});
    notifications.push({ title: "Notifications", message: result2.events + " new"});
    notifications.push({ title: "Messages", message: result2.messages + " new"});
    console.log(notifications);
    notify(id, notifications);
  }
  else if(number > 0){
    notify(id, notifications);
  }
  else{
    console.log("Nothing to notify");
  }
    
}


var autoUpdate = setInterval(function() { check(); }, 300*1000);


function notify(id, data){
  var myNotificationID = null;
  var opt = {
    type: "list",
    title: "SimpleMMO",
    message: "",
    iconUrl: "img/simplemmo-swords.png",
    items: data,
    buttons: [{
      title: "Open SMMO"
    },{
      title: "Close"
    }]
  }
  chrome.notifications.create(id, opt,function(id) {
      myNotificationID = id;
  });
  
    /* Respond to the user's clicking one of the buttons */
  chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    if (notifId === myNotificationID) {
        if (btnIdx === 0) {
            window.open("https://web.simple-mmo.com/");
        } else if (btnIdx === 1) {
            saySorry();
        }
    }
  });

  /* Add this to also handle the user's clicking 
  * the small 'x' on the top right corner */
  chrome.notifications.onClosed.addListener(function() {
    saySorry();
  });

  /* Handle the user's rejection 
  * (simple ignore if you just want to hide the notification) */
  function saySorry() {
    //alert("Sorry to bother you !");
  }
}



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "check")
      check();
      sendResponse({message: "checked"});
  });