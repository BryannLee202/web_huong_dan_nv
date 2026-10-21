// RMSA Academy - Service Worker for Background Device Push Notifications
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: 'Thông báo RMSA', message: event.data.text() };
    }
  }

  const title = data.title || 'RMSA Academy • Thông báo mới';
  const options = {
    body: data.message || 'Bạn có thông báo mới từ Học viện RMSA.',
    icon: '/mascot-running-rin.jpg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    tag: data.id || 'rmsa-notification-' + Date.now(),
    renotify: true,
    data: {
      url: data.link || '/',
      timestamp: Date.now()
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if (targetUrl && client.navigate) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});