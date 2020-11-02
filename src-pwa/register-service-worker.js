/*
 * This file is picked up by the build system only
 * when building for PRODUCTION
 */

import { register } from 'register-service-worker'
import { Notify } from 'quasar'
import { i18n } from '../src/boot/i18n'

if (!window.location.origin.includes('bandori.top') && !window.location.origin.includes('localhost')) {
  navigator.serviceWorker.getRegistrations().then((registerations) => {
    registerations.forEach(reg => reg.unregister())
    if (registerations.length) {
      Notify.create({
        message: i18n.t('worker.unregistred'),
        color: 'primary',
        timeout: 5000,
        actions: [
          { label: i18n.t('worker.toNewSite'), color: 'yellow', handler: () => { location.replace('https://bandori.top') } }
        ]
      })
    }
  })
} else {
  register(process.env.SERVICE_WORKER_FILE, {
    ready () {
      console.log('App is being served from cache by a service worker.')
    },
    registered (registration) { // registration -> a ServiceWorkerRegistration instance
      console.log('Service worker has been registered.')
    },
    cached (registration) { // registration -> a ServiceWorkerRegistration instance
      console.log('Content has been cached for offline use.')
    },
    updatefound (registration) { // registration -> a ServiceWorkerRegistration instance
      console.log('New content is downloading.')
      Notify.create({
        message: i18n.t('worker.update-found'),
        color: 'secondary',
        timeout: 2000
      })
    },
    updated (registration) { // registration -> a ServiceWorkerRegistration instance
      console.log('New content is available; please refresh.')
      Notify.create({
        message: i18n.t('worker.updated'),
        color: 'primary',
        timeout: 0,
        actions: [
          { label: i18n.t('common.refresh'), color: 'yellow', handler: () => { location.reload() } }
        ]
      })
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
      Notify.create({
        message: i18n.t('worker.offline'),
        color: 'secondary'
      })
    },
    error (err) {
      console.error('Error during service worker registration:', err)
    }
  })
}

// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
