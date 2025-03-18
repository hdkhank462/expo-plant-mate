import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {
  NotificationContentInput,
  NotificationTriggerInput,
} from "expo-notifications";
import { Platform } from "react-native";
import { CARE_TYPES, DEFAULT, WEEKDAYS } from "~/constants/values";

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("myNotificationChannel", {
      name: "A channel is needed for the permissions prompt to appear",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export async function schedulePushNotification(
  content: NotificationContentInput,
  trigger: NotificationTriggerInput
) {
  return await Notifications.scheduleNotificationAsync({
    content,
    trigger,
  });
}

// export async function scheduleAlarmNotification(alarm: AlarmInterface) {
//   const timeTill = getTimeTillAlarm(alarm);
//   const seconds = timeTill.hour * 3600 + timeTill.minute * 60;
//   schedulePushNotification(
//     { title: "PlantMate" },
//     {
//       seconds: seconds === 0 ? 30 : seconds,
//       type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//     }
//   );
// }

export async function scheduleWeeklyNotification(plantCare: UserPlantCare) {
  console.log("Tạo thông báo hàng tuần cho", plantCare.id);

  const hours = plantCare.time.split(":")[0];
  const minutes = plantCare.time.split(":")[1];
  const plantName = plantCare.user_plant_detail.plant_detail.name;
  const typeLabel = CARE_TYPES.filter((type) => type.value == plantCare.type)[0]
    .label;

  const weekdays = WEEKDAYS.filter((day) =>
    plantCare.repeat.includes(day.value as WeekDay)
  ).map((day) => day.number);

  let temp = [];

  for (const weekday of weekdays) {
    const identifier = await schedulePushNotification(
      {
        title: "PlantMate",
        body: `Đã đến giờ ${typeLabel} cho ${plantName} rồi đó!`,
        data: { id: `${DEFAULT.ALARMS_ID_PREFIX}-${plantCare.id}` },
      },
      {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        hour: Number(hours),
        minute: Number(minutes),
        weekday,
      }
    );

    temp.push(identifier);
  }

  return temp;
}

export async function findNotificationsById(id: string) {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();

  return notifications.filter(
    (notification) =>
      notification.content.data.id === `${DEFAULT.ALARMS_ID_PREFIX}-${id}`
  );
}

export async function updateNotificationsById(
  id: string,
  plantCareLocal: UserPlantCare
) {
  console.log("Cập nhật thông báo cho", plantCareLocal);

  await cancelNotificationsById(id);
  await scheduleWeeklyNotification(plantCareLocal);
}

export async function cancelNotificationsById(id: string) {
  const notifications = await findNotificationsById(id);
  for (const notification of notifications) {
    await Notifications.cancelScheduledNotificationAsync(
      notification.identifier
    );
  }

  console.log("Hủy thông báo cho", id);
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
