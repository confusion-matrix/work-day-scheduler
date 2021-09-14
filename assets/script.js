// $("#timer").html(moment().format("dddd MMMM DD YYYY HH:mm:ss"));

function time() {
    console.log("Start Time");
    var timer = setInterval(function() {
        console.log("...")
        $("#headerDate").html(moment().format("dddd MMMM DD"));
    }, 1000);
}
time();
var plannerData = [];
var plannerDay = {
    date: "",
    // initialize empty array of length 24
    hour: Array.apply(null, Array(24)).map(function () {}),
    text: Array.apply(null, Array(24)).map(function () {})
}
console.log(plannerDay.hour.length);

var currentDay = "";

// Main function - Call this when the page first loads or when the
// user switches to a new day
$(function() {
    // Fix this
    console.log("Ready!");
    currentDay = moment().format("MMMM DD YYYY")
    console.log("Todays date: " + currentDay);
    createHTML();
    populateHours();

});

// 1. First call create HTML
// 2. Then call populateHours, here we check if there is already text stored
// 3. Run other code


function createHTML() {
    for (var i = 0; i < 24; i++) {
        // Create the container for each hour
        $("<div/>", {
            id: "hour" + i,
            class: "hour"
        }).appendTo("#day");
        // Create the hour label
        $("<div/>", {
            id: "hourShow" + i,
            class: "hourChild hourShow"
        }).appendTo("#hour" + i);
        $("<p/>", {
            id: "hourShowText" + i
        }).appendTo("#hourShow" + i);   
        if (i === 0)
            $("#hourShowText" + i).text("12am");
        else if (i < 12)
            $("#hourShowText" + i).text(i + "am");
        else if (i === 12)
            $("#hourShowText" + i).text(i + "pm");
        else
            $("#hourShowText" + i).text((i - 12) + "pm");
        
        // Create the text area
        $("<div/>", {
            id: "hourText" + i,
            class: "hourChild hourText"
        }).appendTo("#hour" + i);
        $("<textarea/>", {
            id: "textArea" + i,
            rows: "4",
            cols: "160",
            spellCheck: "true"
        }).appendTo("#hourText" + i);
        // Create save button
        $("<button/>", {
            id: "saveButton" + i,
            class: "hourChild hourSave"
        }).appendTo("#hour" + i);
        $("#saveButton" + i).text("Save");
        // Set function to each data
        $("#saveButton" + i).click(setData);
    }
    
}

function setData(event) {
    var index = event.target.id.replace(/\D/g, "");
    var day = findDay();
    console.log("SETTING DATA!");
    console.log("TEXT: " + $("#textArea" + index).val());
    if ($("#textArea" + index).val() === "") {
        console.log("SAVING EMPTY!");
        var data = JSON.parse(localStorage.getItem("plannerData"));
        data[day].hour[index] = false;
        data[day].text[index] = "";

        localStorage.setItem("plannerData", JSON.stringify(data));
        return;
    }
        
    if (localStorage.getItem("plannerData") !== null) {
        // Case when text is empty
        if (day !== null || day) {
            // add data to the day
            var data = JSON.parse(localStorage.getItem("plannerData"));
            data[day].hour[index] = true;
            data[day].text[index] = $("#textArea" + index).val();
            localStorage.setItem("plannerData", JSON.stringify(data));
        } else if (!day) {
            // !!! --- This is when we're adding a new day ... Push HERE
            console.log("Adding new day!");
            var data = JSON.parse(localStorage.getItem("plannerData"));
            plannerDay.date = currentDay
            plannerDay.hour[index] = true;
            plannerDay.text[index] = $("#textArea" + index).val();
            data.push(plannerDay);
            localStorage.setItem("plannerData", JSON.stringify(data));
        }
    } else {
        // Creates brand new data object
        plannerDay.date = currentDay;
        plannerDay.hour[index] = true;
        plannerDay.text[index] = $("#textArea" + index).val();
        localStorage.setItem("plannerData", JSON.stringify([plannerDay]));
    }
    return;
}

function getData(data, hour) {
    console.log("data.text[hour]: " + data.text[hour]);
     $("#textArea" + hour.toString()).val(data.text[hour]);
     return;
}

function populateHours() {
    var data = JSON.parse(localStorage.getItem("plannerData"));
    var day = findDay();
    if (day !== null) {
        for (var i = 0; i < data[day].hour.length; i++) {
            if (data[day].hour[i] === true) {
                getData(data[day], i)
            }
                
        }
    }
    return;
}

function findDay() {
    var data = JSON.parse(localStorage.getItem("plannerData"));
    if (data === null)
        return null;
    for (var i = 0; i < data.length; i++) {
        if (data[i].date === currentDay) {
            return i;
        }
    }
    // This means the data object exists but the day hasn't been added
    return false;
}