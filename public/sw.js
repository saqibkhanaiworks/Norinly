self.addEventListener('push', function (event) {
  let payload = {
    title: "Someone's waiting!",
    body: "A practice partner just joined. Tap to connect now."
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      const text = event.data.text();
      if (text) {
        payload.body = text;
      }
    }
  }

  const options = {
    body: payload.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: '/connect'
    }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || "Norinly", options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // Focus if connect tab is already open
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.includes('/connect') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new tab
      if (clients.openWindow) {
        return clients.openWindow('/connect');
      }
    })
  );
});
