// src/utils/notifications.ts

// 🔔 Permission request
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("Browser does not support notifications");
    return;
  }

  const permission = await Notification.requestPermission();
  return permission;
};

// 🔔 Send notification
export const sendNotification = (title: string, body: string) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/logo.png", // optional
    });
  }
};