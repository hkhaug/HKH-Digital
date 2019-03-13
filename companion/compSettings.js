import * as messaging from "messaging";
import { settingsStorage } from "settings";

export function initialize() {
  settingsStorage.addEventListener("change", evt => {
    if (evt.oldValue !== evt.newValue) {
      sendValue(evt.key, JSON.parse(evt.newValue).values[0].value);
    }
  });
}

function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: val
    });
  }
}

function sendSettingData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}
