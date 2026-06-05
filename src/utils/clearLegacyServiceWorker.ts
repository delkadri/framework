export async function clearLegacyServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return

  const registrations = await navigator.serviceWorker.getRegistrations()
  const hadController = Boolean(navigator.serviceWorker.controller)

  if (!registrations.length && !hadController) return

  await Promise.all(registrations.map((registration) => registration.unregister()))

  if ('caches' in window) {
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
  }

  if (hadController && !sessionStorage.getItem('gameshelf.sw.cleaned')) {
    sessionStorage.setItem('gameshelf.sw.cleaned', 'true')
    window.location.reload()
  }
}
