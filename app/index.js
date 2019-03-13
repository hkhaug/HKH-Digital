import { me as device } from "device";
import { locale } from "user-settings";
import { preferences } from "user-settings";
import { units } from "user-settings";
import { charger, battery } from "power";
import { today } from "user-activity";
import { HeartRateSensor } from "heart-rate";
import clock from "clock";
import document from "document";
import * as messaging from "messaging";
import * as util from "../common/utils";
import * as devSettings from "./devSettings";

const batteryIcon = document.getElementById("batteryIcon");
const batteryPercentage = document.getElementById("batteryPercentage");
const weekData = document.getElementById("weekData");
const dateData = document.getElementById("dateData");
const clockData = document.getElementById("clockData");
const caloriesData = document.getElementById("caloriesData");
const distanceData = document.getElementById("distanceData");
const stepsData = document.getElementById("stepsData");
const heartbeatsData = document.getElementById("heartbeatsData");
const activeMinutesData = document.getElementById("activeMinutesData");
const floorsData = document.getElementById("floorsData");

let dayNames, weekWord;
setLanguage("*");

function setLanguage(languageCode) {
  if(languageCode == "*") {
    languageCode = locale.language;
    if(languageCode.length > 2) languageCode = languageCode.slice(0, 2);
  }
if(languageCode == "de") { dayNames = ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"]; weekWord = "woche"; }
else if(languageCode == "dk") { dayNames = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"]; weekWord = "uge"; }
else if(languageCode == "es") { dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]; weekWord = "semana"; }
else if(languageCode == "fi") { dayNames = ["Sun", "Maa", "Tii", "Kes", "Tor", "Per", "Lau"]; weekWord = "viikko"; }
else if(languageCode == "fr") { dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]; weekWord = "semaine"; }
else if(languageCode == "it") { dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]; weekWord = "settimana"; }
else if(languageCode == "nl") { dayNames = ["Zon", "Maa", "Din", "Woe", "Don", "Vri", "Zat"]; weekWord = "week"; }
else if(languageCode == "no") { dayNames = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"]; weekWord = "uke"; }
else if(languageCode == "sv") { dayNames = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"]; weekWord = "vecka"; }
else { dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; weekWord = "week"; }
}

let distanceDivider;
setDistance("*");

function setDistance(distanceCode) {
  if(distanceCode == "*") {
      distanceCode = units.distance;
    }
  if(distanceCode == "us") distanceDivider = 1609.344; else distanceDivider = 1000;
}

let timeFormat;
setTimeFormat("*");

function setTimeFormat(fmt) {
  if(fmt == "*") {
    fmt = preferences.clockDisplay;
  }
  timeFormat = fmt;
}

let dateFormat;
setDateFormat('dmy.');

function setDateFormat(fmt) {
  dateFormat = fmt;
}

/* -------- SETTINGS -------- */
function settingsCallback(data) {
  if (!data) {
    return;
  }
  if (data.language) {
    setLanguage(data.language);
  }
  if (data.distance) {
    setDistance(data.distance);
  }
  if(data.time) {
    setTimeFormat(data.time);
  }
  if(data.date) {
    setDateFormat(data.date);
  }
}
devSettings.initialize(settingsCallback);

if (!device.screen) device.screen = { width: 348, height: 250 };

clock.granularity = "seconds";

let hrm = new HeartRateSensor();
hrm.start();

batteryIcon.href = calcBatteryImage();

battery.onchange = (charger, ev) => {
  batteryIcon.href = calcBatteryImage();
  let batteryPst = Math.floor(battery.chargeLevel);
  batteryPercentage.text = batteryPst+"%";
}

function calcBatteryImage()
{
  let ratio = Math.floor(battery.chargeLevel/5);
  return "icons/Battery"+ratio+".png";
}

clock.ontick = (evt) => {
  let currentTime = evt.date;
  if(timeFormat == "12h")
    {
      let hrs = currentTime.getHours();
      if(hrs == 0)
        {
          hrs = 12;
        }
      else if(hrs > 12)
        {
          hrs = hrs - 12;
        }
      let hours = util.zeroPad(hrs);
    }
  else
    {
      let hours = util.zeroPad(currentTime.getHours());
    }
  let minutes = util.zeroPad(currentTime.getMinutes());
  let weekdayNo = currentTime.getDay();
  let weekdayName = dayNames[weekdayNo];
  let year = currentTime.getFullYear();
  let month = util.zeroPad(1 + currentTime.getMonth());
  let date = util.zeroPad(currentTime.getDate());
  let weekNumber = util.getWeek(currentTime);
  let calories = today.adjusted.calories;
  let meters = today.adjusted.distance;
  let steps = today.adjusted.steps;
  let beats = hrm.heartRate;
  let activeMinutes = today.adjusted.activeMinutes;
  let floors = today.adjusted.elevationGain;

  weekData.text = `${weekdayName} ${weekWord} ${weekNumber}`;
  if(dateFormat == 'mdy/') {
    dateData.text = `${month}/${date}/${year}`;
  }
  else if(dateFormat == 'mdy.') {
    dateData.text = `${month}.${date}.${year}`;
  }
  else if(dateFormat == 'dmy/') {
    dateData.text = `${date}/${month}/${year}`;
  }
  else {
    dateData.text = `${date}.${month}.${year}`;
  }
  clockData.text = `${hours}:${minutes}`;
  caloriesData.text = calories;
  distanceData.text = Number(meters / distanceDivider).toFixed(2);
  stepsData.text = steps;
  heartbeatsData.text = beats;
  activeMinutesData.text = activeMinutes;
  floorsData.text = floors;
}
