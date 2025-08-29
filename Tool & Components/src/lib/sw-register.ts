// Service Worker Registration
export const registerServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.log('Service Worker registered successfully:', registration)

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, show update notification
            showUpdateNotification(registration)
          }
        })
      }
    })

    // Handle controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller changed')
      // Reload page to get new content
      window.location.reload()
    })

    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
  }
}

// Show update notification
const showUpdateNotification = (registration: ServiceWorkerRegistration) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification('Update Available', {
      body: 'A new version of the site is available. Click to update.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'update-notification',
      requireInteraction: true,
    })

    notification.addEventListener('click', () => {
      notification.close()
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' })
    })
  }
}

// Request notification permission
export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    return false
  }

  try {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  } catch (error) {
    console.error('Failed to request notification permission:', error)
    return false
  }
}

// Send message to service worker
export const sendMessageToSW = (message: any) => {
  if (typeof window === 'undefined' || !navigator.serviceWorker.controller) {
    return
  }

  navigator.serviceWorker.controller.postMessage(message)
}

// Check if app is installed
export const isAppInstalled = () => {
  if (typeof window === 'undefined') return false
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

// Install prompt handling
export const handleInstallPrompt = () => {
  let deferredPrompt: any

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt = e
    
    // Show install button or prompt
    showInstallPrompt(deferredPrompt)
  })

  window.addEventListener('appinstalled', () => {
    console.log('App was installed')
    deferredPrompt = null
  })
}

// Show install prompt
const showInstallPrompt = (deferredPrompt: any) => {
  // You can customize this to show a custom install button
  const installButton = document.createElement('button')
  installButton.textContent = 'Install App'
  installButton.className = 'install-button'
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    padding: 12px 24px;
    background: #3B82F6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  `

  installButton.addEventListener('click', async () => {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    deferredPrompt = null
    installButton.remove()
  })

  document.body.appendChild(installButton)

  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (installButton.parentNode) {
      installButton.remove()
    }
  }, 10000)
}

// Initialize PWA features
export const initializePWA = () => {
  registerServiceWorker()
  handleInstallPrompt()
  
  // Request notification permission on user interaction
  const requestPermission = () => {
    requestNotificationPermission()
    document.removeEventListener('click', requestPermission)
  }
  
  document.addEventListener('click', requestPermission, { once: true })
}

// Export for use in components
export default {
  registerServiceWorker,
  requestNotificationPermission,
  sendMessageToSW,
  isAppInstalled,
  handleInstallPrompt,
  initializePWA,
}
