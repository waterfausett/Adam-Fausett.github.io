(function (window) {
  'use strict';


function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


  //Push notification button
  var fabPushElement = document.querySelector('.fab__push');
  var fabPushImgElement = document.querySelector('.fab__image');

  //To check `push notification` is supported or not
  function isPushSupported() {
    //To check `push notification` permission is denied by user
    if (Notification.permission === 'denied') {
      alert('User has blocked push notification.');
      return;
    }

    //Check `push notification` is supported or not
    if (!('PushManager' in window)) {
      alert('Sorry, Push notification isn\'t supported in your browser.');
      return;
    }

    //Get `push notification` subscription
    //If `serviceWorker` is registered and ready
    navigator.serviceWorker.ready
      .then(function (registration) {
        registration.pushManager.getSubscription()
        .then(function (subscription) {
          //If already access granted, enable push button status
          if (subscription) {
            changePushStatus(true);
          }
          else {
            changePushStatus(false);
          }
        })
        .catch(function (error) {
          console.error('Error occurred while enabling push ', error);
        });
      });
  }

  // Ask User if he/she wants to subscribe to push notifications and then 
  // ..subscribe and send push notification
  function subscribePush() {
    navigator.serviceWorker.ready.then(function(registration) {
      if (!registration.pushManager) {
        alert('Your browser doesn\'t support push notification.');
        return false;
      }

const applicationServerKey = urlB64ToUint8Array('BEJk7KDNycfPJf1QiyeoMRVbD03S7TZVZbISa4N1zMdWs7FKunqNy9OjzuN-NbHKVwP9GYyhwmIWREkb1K9zuZs');
      //To subscribe `push notification` from push manager
      registration.pushManager.subscribe({
        userVisibleOnly: true //Always show notification when received
        ,applicationServerKey: applicationServerKey
      })
      .then(function (subscription) {
        alert('Subscribed successfully.');
        console.info('Push notification subscribed.');
        console.log(subscription);

        console.log(JSON.stringify(subscription));

        document.querySelector('.push-endpoint-data').textContent = JSON.stringify(subscription);

        //saveSubscriptionID(subscription);
        changePushStatus(true);
      })
      .catch(function (error) {
        changePushStatus(false);
        console.error('Push notification subscription error: ', error);
      });
    })
  }

  // Unsubscribe the user from push notifications
  function unsubscribePush() {
    navigator.serviceWorker.ready
    .then(function(registration) {
      //Get `push subscription`
      registration.pushManager.getSubscription()
      .then(function (subscription) {
        //If no `push subscription`, then return
        if(!subscription) {
          alert('Unable to unregister push notification.');
          return;
        }

        //Unsubscribe `push notification`
        subscription.unsubscribe()
          .then(function () {
            alert('Unsubscribed successfully.');
            console.info('Push notification unsubscribed.');
            console.log(subscription);
            //deleteSubscriptionID(subscription);
            changePushStatus(false);
          })
          .catch(function (error) {
            console.error(error);
          });
      })
      .catch(function (error) {
        console.error('Failed to unsubscribe push notification.');
      });
    })
  }

  //To change status
  function changePushStatus(status) {
    fabPushElement.dataset.checked = status;
    fabPushElement.checked = status;
    if (status) {
      fabPushElement.classList.add('active');
      fabPushImgElement.src = '../images/push-on.png';
    }
    else {
     fabPushElement.classList.remove('active');
     fabPushImgElement.src = '../images/push-off.png';
    }
  }

  //Click event for subscribe push
  fabPushElement.addEventListener('click', function () {
    var isSubscribed = (fabPushElement.dataset.checked === 'true');
    if (isSubscribed) {
      unsubscribePush();
    }
    else {
      subscribePush();
    }
  });

  isPushSupported(); //Check for push notification support
})(window);