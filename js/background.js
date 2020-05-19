/* 
%steps%
%stepsMax% 
%quests% 
%questsMax%
%energy%
%energyMax%
%notifications%
%messages%
*/

var settings;
var autoUpdate;
var time;
var start = 0;

var agent = navigator.userAgent + " | CHROME EXTENSION - notifications";

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(info) {
      var headers = info.requestHeaders;
      headers.forEach(function(header, i) {
        if (header.name.toLowerCase() == 'user-agent') {
          header.value = agent;
        }
      });
      return {requestHeaders: headers};
    },
    {
      urls: [
        "https://web.simple-mmo.com/*"
      ],
      types: ["main_frame", "sub_frame", "xmlhttprequest"]
      },
      ["blocking", "requestHeaders"]
);

chrome.runtime.onInstalled.addListener(function() {
  var settings = {
    "quests": 1,
    "energy": 1,
    "steps": 1,
    "messages": 1,
    "notifications": 1,
    "caps": 0,
    "timer": 60000,
    "debug": 1
  }
  
  var messagesTemplateDefault = [
    { title: "Steps", message: "Your steps are full [%steps%/%stepsMax%]"},
    { title: "Quest points", message: "Your quest points are full [%quests%/%questsMax%]"},
    { title: "Energy", message: "Your energy is full [%energy%/%energyMax%]"},
    { title: "Messages", message: "%messages% new message(s)."},
    { title: "Notifications", message: "%notifications% new notification(s)."},
    { title: "[AM]", message: "Steps: [%steps%/%stepsMax%]; Quest points: [%quests%/%questsMax%]; Energy: [%energy%/%energyMax%]"}
  ];


  var messagesTemplate;

  chrome.storage.local.set({messagesTemplateDefault: messagesTemplateDefault}, function() {
    chrome.storage.local.set({settings: settings}, function() {
      userAuth();
      chrome.storage.local.set({messagesTemplate: messagesTemplateDefault}, function() {});
    });
  });
});


chrome.runtime.onStartup.addListener(function() {
    userAuth();
})




function startTimer(time){
  try {
    clearInterval(autoUpdate);
  } catch (error) {
    console.log("Started for the first time")
  }
  console.time("autoUpdate");
  autoUpdate = setInterval(function() { 
    chrome.storage.local.get(['userAuth'], function(result) {
      if(result.userAuth == true){
        check(); 
      }
    }) 
  }, time);
}



function firstCheck(){
  if(settings.debug == 1){console.log('User logged in')};
  settings = null;
  messagesTemplate = null;
    chrome.storage.local.get(['settings'], function(result) {
      settings = result.settings;
      time = null;
      if(settings.caps == 0){time = 60000;}
      else {time = settings.timer}
      startTimer(time);
      chrome.storage.local.get(['messagesTemplate'], function(result) {
        messagesTemplate = result.messagesTemplate;
        if(settings.debug == 1){console.log(messagesTemplate)};
        if(settings.debug == 1){console.log(settings)};
        update();
      });
    }); 
}

function check() {
  settings = null;
  messagesTemplate = null;
    chrome.storage.local.get(['settings'], function(result) {
      settings = result.settings;
      time = null;
      if(settings.caps == 0){time = 60000;}
      else {time = settings.timer}
      console.timeEnd("autoUpdate");  
      startTimer(time);
      chrome.storage.local.get(['messagesTemplate'], function(result) {
        messagesTemplate = result.messagesTemplate;
        if(settings.debug == 1){console.log(messagesTemplate)};
        if(settings.debug == 1){console.log(settings)};
        update();
      });
    }); 
}



function userAuth(){
  chrome.storage.local.get(['settings'], async function(result) {
    settings = result.settings;
    let promise = new Promise((resolve, reject) => {
      $.get("https://web.simple-mmo.com/mobapi", function(data, status) {
          setTimeout(() => resolve(data), 1000)
          if(settings.debug == 1){console.log(data)};
      });
    });
    let result1 = await promise; 
  
    if(result1.loggedin == "true"){
      chrome.storage.local.set({userAuth: true}, function() {});
      firstCheck();
    }
    else{
      chrome.storage.local.set({userAuth: false}, function() {});
    }
  })
}

function userAuthConfirmation(){
  chrome.storage.local.get(['settings'], async function(result) {
    settings = result.settings;
    let promise = new Promise((resolve, reject) => {
      $.get("https://web.simple-mmo.com/mobapi", function(data, status) {
          setTimeout(() => resolve(data), 1000)
          if(settings.debug == 1){console.log(data)};
      });
    });
    let result1 = await promise; 
  
    if(result1.loggedin == "true"){
      chrome.storage.local.set({userAuth: true}, function() {});
    }
    else{
      chrome.storage.local.set({userAuth: false}, function() {});
    }
  })
  
}


async function update(){
  var notificationMessages = messagesTemplate;
  if(settings.debug == 1){console.log(notificationMessages)};
  let promise = new Promise((resolve, reject) => {
        $.get("https://web.simple-mmo.com/api/extension", function(data, status) {
            setTimeout(() => resolve(data), 1000)
            if(settings.debug == 1){console.log(data)};
        });
  });
  
  let promise2 = new Promise((resolve, reject) => {
      $.get("https://web.simple-mmo.com/mobapi", function(data, status) {
          setTimeout(() => resolve(data), 1000)
          if(settings.debug == 1){console.log(data)};
      });
  });
  
  let result = await promise; 
  let result2 = await promise2; 
  if(settings.debug == 1){console.log("Before " + JSON.stringify(notificationMessages))};

  if(settings.caps == 0){
    if(result.steps == result.stepsMax){
      if(settings.steps == 1){
        var id = "SMMO-steps "; id += (Math.floor(Math.random() * Math.floor(1000)).toString());
        var data = [];
        data.push(notificationMessages[0]);
        var message = data[0].message;
        if(result.steps > result.stepsMax){
          message = message.replace("%steps%", result.stepsMax).replace("%stepsMax%", result.stepsMax); 
        }
        else{
          message = message.replace("%steps%", result.steps).replace("%stepsMax%", result.stepsMax); 
        }
        data[0].message = message;
        if(settings.debug == 1){console.log("After " + JSON.stringify(notificationMessages))};
        if(settings.debug == 1){console.log("Steps id: " + id)};
        notify(id, data, "steps")
      }
    }
  
    if(result.questPoints == result.maximumQuestPoints){
      if(settings.quests == 1){
        var id = "SMMO-quests "; id += (Math.floor(Math.random() * Math.floor(1000)).toString());
        var data = [];
        data.push(notificationMessages[1]);
        var message = data[0].message;
        message = message.replace("%quests%", result.questPoints).replace("%questsMax%", result.maximumQuestPoints); 
        data[0].message = message;
        if(settings.debug == 1){console.log("After " + JSON.stringify(notificationMessages))};
        if(settings.debug == 1){console.log("Quests id: " + id)};
        notify(id, data, "qp")
      }
    }
    
  
    if(result2.energy == result2.max_energy){
      if(settings.energy == 1){
        var id = "SMMO-energy "; id += (Math.floor(Math.random() * Math.floor(1000)).toString());
        var data = [];
        data.push(notificationMessages[2]);
        var message = data[0].message;
        message = message.replace("%energy%", result2.energy).replace("%energyMax%", result2.max_energy); 
        data[0].message = message;
        if(settings.debug == 1){console.log("After " + JSON.stringify(notificationMessages))};
        if(settings.debug == 1){console.log("Energy id: " + id)};
        notify(id, data, "energy")
      }
    }
    
  }
  else{
    var id = "SMMO-autoMessage "; id += (Math.floor(Math.random() * Math.floor(1000)).toString());
    var data = [];
    data.push(notificationMessages[5]);
    var message = data[0].message;
    message = message.replace("%energy%", result2.energy).replace("%energyMax%", result2.max_energy).replace("%quests%", result.questPoints).replace("%questsMax%", result.maximumQuestPoints).replace("%steps%", result.steps).replace("%stepsMax%", result.stepsMax); 
    data[0].message = message;
    if(settings.debug == 1){console.log("After " + JSON.stringify(notificationMessages))};
    if(settings.debug == 1){console.log("Energy id: " + id)};
    notify(id, data, "energy")
  }
  
    if(result2.messages > 0){
      if(settings.messages == 1){
        var id = "SMMO-messages "; id += (Math.floor(Math.random() * Math.floor(1000)).toString());
        var data = [];
        data.push(notificationMessages[3]);
        var message = data[0].message;
        message = message.replace("%messages%", result2.messages); 
        data[0].message = message;
        if(settings.debug == 1){console.log("Message id: " + id)};
        notify(id, data, "message")
      } 
    }
  
    if(result2.events > 0){
      if(settings.notifications == 1){
        var id = "SMMO-notifications "; id += (Math.floor(Math.random() * Math.floor(1000)).toString());
        var data = [];
        data.push(notificationMessages[4]);
        var message = data[0].message;
        message = message.replace("%notifications%", result2.events); 
        data[0].message = message;
        if(settings.debug == 1){console.log("Notification id: " + id)};
        notify(id, data, "notification")
      } 
    }
  
  
  console.log("Updated");

}





function notify(id, data, type){
  if(settings.debug == 1){console.log("Pushed new notification: " + id + "; data: " + data + "; type: " + type)};
  var myNotificationID = null;
  var opt = {
    type: "list",
    title: "SimpleMMO",
    message: "",
    iconUrl: "img/logo.webp",
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
          switch (type) {
            case "steps":
              window.open("https://web.simple-mmo.com/travel");
              break;
            case "qp":
              window.open("https://web.simple-mmo.com/quests/viewall");
              break;
            case "energy":
              window.open("https://web.simple-mmo.com/battlearena");
              break;
            case "notification":
              window.open("https://web.simple-mmo.com/events");
              break;
            case "message":
              window.open("https://web.simple-mmo.com/messages/inbox");
              break;
            case "job":
              window.open("https://web.simple-mmo.com/jobs/viewall");
              break;
            case "worldBoss":
              window.open("https://web.simple-mmo.com/worldbosses");
              break;
            case "autoMessage":
              window.open("https://web.simple-mmo.com/");
              break;
            default:
              break;
          }
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
    if (request.message === "check"){
      check();
      sendResponse({message: "checked"});
    }
    if (request.message === "changeTimer"){
      chrome.storage.local.get(['settings'], function(result) {
        settings = result.settings;
        time = null;
        if(settings.caps == 0){time = 60000;}
        else {time = settings.timer}
        try {
          console.timeEnd("autoUpdate");
        } catch (error) {
          console.log(error);
        }
        startTimer(time);
      })
      sendResponse({message: "Changed."});
    }
    if (request.message === "userAuthConfirm"){
      userAuthConfirmation();
      sendResponse({message: "userAuth"});
    }
    if (request.message === "openGame"){
      window.open("https://web.simple-mmo.com/");
      sendResponse({message: "openGame"});
    }


    
});



function test(){
  chrome.runtime.sendMessage({message: "hi"}, (response) => {
    console.log(response.message);
  });
}
