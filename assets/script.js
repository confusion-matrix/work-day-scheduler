// !!! --- TODO --- !!!
// Done.

var plannerDay = {
    date: "",
    hour: new Array(24).fill(false),
    text: Array.from("".repeat(24))
}
var currentDay = "";
var selectedDay = "";

// Main function - Call this when the page first loads or when the
// user switches to a new day
$(function() {
    $("#calendar").datepicker({
        showOn: "button",
        buttonText: "Change Date",
        dateFormat: "MM dd yy",
        onSelect: function(dateText) {
            currentDay = dateText;
            $("#headerDate").html(moment(currentDay, "MMMM DD YYYY").format("dddd MMMM DD"));
            populateHours();
        }
    })
    console.log("Ready!");
    currentDay = moment().format("MMMM DD YYYY")
    createHTML();
    populateHours();
    setColors();
});

function createHTML() {
    $("#headerDate").html(moment().format("dddd MMMM DD"));
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
    if (localStorage.getItem("plannerData") !== null) {
        if ($("#textArea" + index).val() === "") {
            var data = JSON.parse(localStorage.getItem("plannerData"));
            data[day].hour[index] = false;
            data[day].text[index] = "";
            localStorage.setItem("plannerData", JSON.stringify(data));
        } else if (Number.isInteger(day)) {
            var data = JSON.parse(localStorage.getItem("plannerData"));
            data[day].hour[index] = true;
            data[day].text[index] = $("#textArea" + index).val();
            localStorage.setItem("plannerData", JSON.stringify(data));
        } else {
            var data = JSON.parse(localStorage.getItem("plannerData"));
            plannerDay.date = currentDay
            plannerDay.hour[index] = true;
            plannerDay.text[index] = $("#textArea" + index).val();
            data.push(plannerDay);
            localStorage.setItem("plannerData", JSON.stringify(data));
        }
    } else {
        plannerDay.date = currentDay;
        plannerDay.hour[index] = true;
        plannerDay.text[index] = $("#textArea" + index).val();
        localStorage.setItem("plannerData", JSON.stringify([plannerDay]));
    }
    return;
}

function getData(data, hour) {
    $("#textArea" + hour).val(data.text[hour]);
    return;
}

function populateHours() {
    var data = JSON.parse(localStorage.getItem("plannerData"));
    var day = findDay();
    console.log("DAY: " + day)
    if (Number.isInteger(day)) {
        for (var i = 0; i < data[day].hour.length; i++) {
            if (data[day].hour[i] === true) {
                getData(data[day], i)
            } else {
                $("#textArea" + i).val("");
            }     
        }    
    } else if (!day) {
        for (var i = 0; i < 24; i++) {
            $("#textArea" + i).val("");
        }
    }
    return;
}

function setColors() {
    var currentHour = moment().format("HH");
    for (var i = 0; i < 24; i++) {
        if (i < currentHour) {
            $("#textArea" + i).css("background-color", "gray");
            $("#hourText" + i).css("background-color", "gray");
        } else if (i == currentHour) {
            $("#textArea" + i).css("background-color", "red");
            $("#hourText" + i).css("background-color", "red");
        } else {
            $("#textArea" + i).css("background-color", "green");
            $("#hourText" + i).css("background-color", "green");
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
    return false;
}