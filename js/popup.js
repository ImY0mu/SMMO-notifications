var notificationSettings;

chrome.storage.local.get(['notifications'], function(result) {
  notificationSettings = result.notifications;
  if(notificationSettings.quests == 1){
     $( "#quests").prop( "checked", true );
  }
  if(notificationSettings.energy == 1){
    $( "#energy").prop( "checked", true );
 }
 if(notificationSettings.steps == 1){
    $( "#steps").prop( "checked", true );
 }
 if(notificationSettings.notifications == 1){
    $( "#notifications").prop( "checked", true );
 }
 if(notificationSettings.messages == 1){
    $( "#messages").prop( "checked", true );
 }
});

$('#quests').change(function() {
    if(this.checked) {
        notificationSettings.quests = 1;
    }
    else{
        notificationSettings.quests = 0;
    }  
    chrome.storage.local.set({notifications: notificationSettings}, function() {});
});

$('#energy').change(function() {
    if(this.checked) {
        notificationSettings.energy = 1;
    }
    else{
        notificationSettings.energy = 0;
    }  
    chrome.storage.local.set({notifications: notificationSettings}, function() {});
});

$('#steps').change(function() {
    if(this.checked) {
        notificationSettings.steps = 1;
    }
    else{
        notificationSettings.steps = 0;
    }  
    chrome.storage.local.set({notifications: notificationSettings}, function() {});
});

$('#notifications').change(function() {
    if(this.checked) {
        notificationSettings.notifications = 1;
    }
    else{
        notificationSettings.notifications = 0;
    }  
    chrome.storage.local.set({notifications: notificationSettings}, function() {});
});

$('#messages').change(function() {
    if(this.checked) {
        notificationSettings.messages = 1;
    }
    else{
        notificationSettings.messages = 0;
    }  
    chrome.storage.local.set({notifications: notificationSettings}, function() {});
});


$( "#check" ).click(function() {
    chrome.runtime.sendMessage({message: "check"}, (response) => {
        //console.log(response.message);
    });
});

