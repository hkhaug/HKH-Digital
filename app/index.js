import { me as device } from "device";
import { locale } from "user-settings";
import { preferences } from "user-settings";
import { units } from "user-settings";
import { charger, battery } from "power";
import { today } from "user-activity";
import { HeartRateSensor } from "heart-rate";
import clock from "clock";
import document from "document";
import * as util from "../common/utils";

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

if(preferences.clockDisplay == "12h") let hours12 = true; else let hours12 = false;
if(units.distance === "us") let distanceDivider = 1609.344; else let distanceDivider = 1000;

let languageCode = locale.language;
if(languageCode.length > 2) languageCode = languageCode.slice(0, 2);
if(languageCode == "de") { let dayNames = ["Son", "Mon", "Die", "Mit", "Don", "Fre", "Sam"]; let weekWord = "woche"; }
else if(languageCode == "es") { let dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]; let weekWord = "semana"; }
else if(languageCode == "fr") { let dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]; let weekWord = "semaine"; }
else if(languageCode == "it") { let dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]; let weekWord = "settimana"; }
else if(languageCode == "nl") { let dayNames = ["Zon", "Maa", "Din", "Woe", "Don", "Vri", "Zat"]; let weekWord = "week"; }
else if(languageCode == "sv") { let dayNames = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"]; let weekWord = "vecka"; }
else { let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; let weekWord = "week"; }

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
  if(hours12)
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
  dateData.text = `${date}.${month}.${year}`;
  clockData.text = `${hours}:${minutes}`;
  caloriesData.text = calories;
  distanceData.text = Number(meters / distanceDivider).toFixed(2);
  stepsData.text = steps;
  heartbeatsData.text = beats;
  activeMinutesData.text = activeMinutes;
  floorsData.text = floors;
}
