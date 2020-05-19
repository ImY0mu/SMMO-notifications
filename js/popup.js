var settings;
var messagesTemplate;
var debugging = 1;

var variables = [
    { type: "Steps", actual: "%steps%", actual_desc: "Number of steps", cap: "%stepsMax%", cap_desc: "Steps cap number"},
    { type: "Quests", actual: "%quests%", actual_desc: "Number of qp", cap: "%questsMax%", cap_desc: "Quest points cap number"},
    { type: "Energy", actual: "%energy%", actual_desc: "Number of energy", cap: "%energyMax%", cap_desc: "Energy cap number"}
]
var variables2 = [
    { type: "Message", actual: "%messages%", actual_desc: "Number of new messages"},
    { type: "Notifications", actual: "%notifications%", actual_desc: "Number of new notifications"}
]

var variables3 = [
    { type: "Steps", actual: "%steps%", actual_desc: "Number of steps"},
    { type: "StepsMax", actual: "%stepsMax%", actual_desc: "Steps cap number"},
    { type: "Quests", actual: "%quests%", actual_desc: "Number of qp"},
    { type: "QuestsMax", actual: "%questsMax%", actual_desc: "Quest points cap number"},
    { type: "Energy", actual: "%energy%", actual_desc: "Number of energy"},
    { type: "EnergyMax", actual: "%energyMax%", actual_desc: "Energy cap number"},
]

chrome.storage.local.get(['messagesTemplate'], function(result) {
    messagesTemplate = result.messagesTemplate;
    if(debugging == 1){console.log(messagesTemplate)};
});

chrome.storage.local.get(['settings'], function(result) {
    settings = result.settings;
  console.log(settings);
  if(settings.quests == 1){
     $( "#quests").prop( "checked", true );
  }
  if(settings.energy == 1){
    $( "#energy").prop( "checked", true );
 }
 if(settings.steps == 1){
    $( "#steps").prop( "checked", true );
 }
 if(settings.notifications == 1){
    $( "#notifications").prop( "checked", true );
 }
 if(settings.messages == 1){
    $( "#messages").prop( "checked", true );
 }
 if(settings.caps == 1){
    $( "#caps").prop( "checked", true );
    $(".item-hide").addClass("active");
    $("#item-timer").removeClass("hide");
    $("#timer").val(settings.timer/60000);
 }
});


$("#timer").change(function(){
    if($("#timer").val() > 0 && $("#timer").val() < 60) {
        changeTimer( $("#timer").val() * 60000);
    }else{
        $("#timer").val(settings.timer/60000);
    }
});

$('#quests').change(function() {
    if(this.checked) {
        settings.quests = 1;
    }
    else{
        settings.quests = 0;
    }  
    chrome.storage.local.set({settings: settings}, function() {});
});

$('#energy').change(function() {
    if(this.checked) {
        settings.energy = 1;
    }
    else{
        settings.energy = 0;
    }  
    chrome.storage.local.set({settings: settings}, function() {});
});

$('#steps').change(function() {
    if(this.checked) {
        settings.steps = 1;
    }
    else{
        settings.steps = 0;
    }  
    chrome.storage.local.set({settings: settings}, function() {});
});

$('#notifications').change(function() {
    if(this.checked) {
        settings.notifications = 1;
    }
    else{
        settings.notifications = 0;
    }  
    chrome.storage.local.set({settings: settings}, function() {});
});

$('#messages').change(function() {
    if(this.checked) {
        settings.messages = 1;
    }
    else{
        settings.messages = 0;
    }  
    chrome.storage.local.set({settings: settings}, function() {});
});


$('#caps').change(function() {
    if(this.checked) {
        settings.caps = 1;
        $(".item-hide").addClass("active");
        $("#item-timer").removeClass("hide");
        $("#timer").val(settings.timer/60000);
    }
    else{
        settings.caps = 0;
        $(".item-hide").removeClass("active");
        $("#item-timer").addClass("hide");
    }  
    chrome.storage.local.set({settings: settings}, function() {});
});




$( "#check" ).click(function() {
    chrome.runtime.sendMessage({message: "check"}, (response) => {
        //console.log(response.message);
    });
});

$( ".bar a" ).click(function() {
    switch($(this).attr("id")){
        case "options":
            $("#optionsPanel").addClass("active");
            $("#customPanel").removeClass("active");
            $("#options").addClass("active");
            $("#custom").removeClass("active");
            break;
        case "custom":
            $("#customPanel").addClass("active");
            $("#optionsPanel").removeClass("active");
            $("#custom").addClass("active");
            $("#options").removeClass("active");
            break;
        default:
            break;
    }
});

$( "#backBtn" ).click(function() {
    $("#customPanel").removeClass("active");
    $("#customPanel").removeClass("edit");
    $("#optionsPanel").addClass("active");
    $( "#check" ).removeClass("hide");
    $( "#backBtn" ).addClass("hide");
});

$( ".editIcon" ).click(function() {
        $("#customPanel").addClass("active");
        $("#customPanel").addClass("edit");
        $("#optionsPanel").removeClass("active");
        $( "#check" ).addClass("hide");
        $( "#backBtn" ).removeClass("hide");
        switch($(this).attr("id")){
            case "stepsMessage":
                $("#updateBtn").attr("target", "steps");
                $("#defaultBtn").attr("target", "steps");
                $("#whatMessage").text(Object.values(variables[0])[0]);
                $("#editMessage").val(messagesTemplate[0].message);
                $("#tableContent").html("<tr><td>" + Object.values(variables[0])[1] + "</td><td>" + Object.values(variables[0])[2] + "</td></tr><tr><td>" + Object.values(variables[0])[3] + "</td><td>" + Object.values(variables[0])[4] + "</td></tr>");
                break;
            case "questMessage":
                $("#updateBtn").attr("target", "quests");
                $("#defaultBtn").attr("target", "quests");
                $("#whatMessage").text(Object.values(variables[1])[0]);
                $("#editMessage").val(messagesTemplate[1].message);
                $("#tableContent").html("<tr><td>" + Object.values(variables[1])[1] + "</td><td>" + Object.values(variables[1])[2] + "</td></tr><tr><td>" + Object.values(variables[1])[3] + "</td><td>" + Object.values(variables[1])[4] + "</td></tr>");
                break;
            case "energyMessage":
                $("#updateBtn").attr("target", "energy");
                $("#defaultBtn").attr("target", "energy");
                $("#whatMessage").text(Object.values(variables[2])[0]);
                $("#editMessage").val(messagesTemplate[2].message);
                $("#tableContent").html("<tr><td>" + Object.values(variables[2])[1] + "</td><td>" + Object.values(variables[2])[2] + "</td></tr><tr><td>" + Object.values(variables[2])[3] + "</td><td>" + Object.values(variables[2])[4] + "</td></tr>");
                break;
            case "messageMessage":
                $("#updateBtn").attr("target", "messages");
                $("#defaultBtn").attr("target", "messages");
                $("#whatMessage").text(Object.values(variables2[0])[0]);
                $("#editMessage").val(messagesTemplate[3].message);
                $("#tableContent").html("<tr><td>" + Object.values(variables2[0])[1] + "</td><td>" + Object.values(variables2[0])[2] + "</td></tr>");
                break;
            case "notificationMessage":
                $("#updateBtn").attr("target", "notifications");
                $("#defaultBtn").attr("target", "notifications");
                $("#whatMessage").text(Object.values(variables2[1])[0]);
                $("#editMessage").val(messagesTemplate[4].message);
                $("#tableContent").html("<tr><td>" + Object.values(variables2[1])[1] + "</td><td>" + Object.values(variables2[1])[2] + "</td></tr>");
                break;
             case "autoMessage":
                $("#updateBtn").attr("target", "autoMessage");
                $("#defaultBtn").attr("target", "autoMessage");
                $("#whatMessage").text("Everything");
                $("#editMessage").val(messagesTemplate[5].message);
                $("#tableContent").html("<tr><td>" + Object.values(variables3[0])[1] + "</td><td>" + Object.values(variables3[0])[2] + "</td></tr><tr><td>" + Object.values(variables3[1])[1] + "</td><td>" + Object.values(variables3[1])[2] + "</td></tr><tr><td>" + Object.values(variables3[2])[1] + "</td><td>" + Object.values(variables3[2])[2] + "</td></tr><tr><td>" + Object.values(variables3[3])[1] + "</td><td>" + Object.values(variables3[3])[2] + "</td></tr><tr><td>" + Object.values(variables3[4])[1] + "</td><td>" + Object.values(variables3[4])[2] + "</td></tr><tr><td>" + Object.values(variables3[5])[1] + "</td><td>" + Object.values(variables3[5])[2] + "</td></tr>");
                break;
            default:
                break;
        }
});


$( "#updateBtn" ).click(function(e) {
    e.preventDefault();
    updateMessage($(this).attr("target"), $("#editMessage").val());
    console.log($(this).attr("target"));
});


$( "#defaultBtn" ).click(function(e) {
    e.preventDefault();
    defaultMessage($(this).attr("target"));
});


$( "#connectBtn" ).click(function(e) {
    e.preventDefault();
    userAuth();
});







function changeTimer(time){
    settings.timer = time;
    chrome.storage.local.set({settings: settings}, function() {
        chrome.runtime.sendMessage({message: "changeTimer"}, (response) => {
            //console.log(response.message);
        });
    });
}


function changeDebug(mode){
    settings.debug = mode;
    chrome.storage.local.set({settings: settings}, function() {});
}

    

function openGame(){
    chrome.runtime.sendMessage({message: "openGame"}, (response) => {
        //console.log(response.message);
    });
}

function updateMessage(type, message){
    switch (type) {
        case "steps":
            messagesTemplate[0].message = message;
            break;
        case "qp":
            messagesTemplate[1].message = message;
            break;
        case "energy":
            messagesTemplate[2].message = message;
            break;
        case "messages":
            messagesTemplate[3].message = message;
            break;
        case "notifications":
            messagesTemplate[4].message = message;
            break;
        case "autoMessage":
            messagesTemplate[5].message = message;
            break;
        default:
            break;
    }
    chrome.storage.local.set({messagesTemplate: messagesTemplate}, function() {});
}


function userAuth(){
    chrome.storage.local.get(['userAuth'], function(result) {
        if(result.userAuth == true){
            $("#optionsPanel").addClass("active");
            $("#loadingPanel").removeClass("active");
            $("#check").removeClass("hide");
            $("#connectBtn").addClass("hide");
        }
        else{
            $("#loadMessage").html("Login <a id='gameLink' href='#'>Here</a>");
            $("#optionsPanel").removeClass("active");
            $("#loadingPanel").addClass("active");
            $("#check").addClass("hide");
            $("#connectBtn").removeClass("hide");
            $( "#gameLink" ).click(function(e) {
                e.preventDefault();
                openGame();
            });
        }
    });
}


window.onload = (event) => {
    chrome.runtime.sendMessage({message: "userAuthConfirm"}, (response) => {
        userAuth();
        setTimeout(() => {
            userAuth()
        }, 2000);
    });
};


function defaultMessage(type){
    chrome.storage.local.get(['messagesTemplateDefault'], function(result) {
        switch (type) {
            case "steps":
                messagesTemplate[0].message = result.messagesTemplateDefault[0].message;
                $("#editMessage").val(messagesTemplate[0].message);
                break;
            case "qp":
                messagesTemplate[1].message = result.messagesTemplateDefault[1].message;
                $("#editMessage").val(messagesTemplate[1].message);
                break;
            case "energy":
                messagesTemplate[2].message = result.messagesTemplateDefault[2].message;
                $("#editMessage").val(messagesTemplate[2].message);
                break;
            case "messages":
                messagesTemplate[3].message = result.messagesTemplateDefault[3].message;
                $("#editMessage").val(messagesTemplate[3].message);
                break;
            case "notifications":
                messagesTemplate[4].message = result.messagesTemplateDefault[4].message;
                $("#editMessage").val(messagesTemplate[4].message);
                break;
            case "autoMessage":
                messagesTemplate[5].message = result.messagesTemplateDefault[5].message;
                $("#editMessage").val(messagesTemplate[5].message);
                break;
            default:
                break;
        }
        chrome.storage.local.set({messagesTemplate: messagesTemplate}, function() {});
    });
}

