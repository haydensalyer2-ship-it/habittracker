const MOTIVATIONAL_QUOTES = [
  "Execute the plan. Check in now.",
  "Win the day. No zero days. Log your progress.",
  "Do not break the chain. Time to check in.",
  "Discipline equals freedom. Complete your daily log.",
  "You cannot negotiate with weakness. Execute.",
  "The standard is the standard. Hit your daily target."
];

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      return registration;
    } catch (err) {
      console.error('ServiceWorker registration failed: ', err);
    }
  }
  return null;
}

export async function scheduleLocalNotification(hasCheckedIn: boolean, targetHour: number = 20) {
  if (Notification.permission !== 'granted') return;

  const now = new Date();
  const dateStr = now.toDateString();
  
  // If we already checked in today, don't show the check-in reminder
  if (hasCheckedIn) return;

  // Check if it's past the target hour (e.g. 8 PM / 20:00)
  if (now.getHours() === targetHour) {
    const lastNotified = localStorage.getItem('lastNotificationDate');
    if (lastNotified !== dateStr) {
      showNotification();
      localStorage.setItem('lastNotificationDate', dateStr);
    }
  }
}

export async function showNotification() {
  if (Notification.permission === 'granted') {
    const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('Lock In - Gamify Greatness', {
          body: quote,
          icon: '/icon.svg',
          vibrate: [200, 100, 200]
        } as any);
      });
    } else {
      new Notification('Lock In - Gamify Greatness', {
        body: quote,
        icon: '/icon.svg'
      });
    }
  }
}
