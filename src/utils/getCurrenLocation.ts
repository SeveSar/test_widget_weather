export default function getPosition(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      // Prompt user for permission to access their location
      navigator.geolocation.getCurrentPosition(
        // Success callback function
        (position) => {
          // Get the user's latitude and longitude coordinates
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          console.log(`Latitude: ${lat}, longitude: ${lon}`)
          return resolve({ lat, lon })
          // Do something with the location data, e.g. display on a map
        },
        // Error callback function
        (error) => {
          // Handle errors, e.g. user denied location sharing permissions
          console.error('Error getting user location:', error)
          return reject(new Error('Error getting user location'))
        }
      )
    } else {
      // Geolocation is not supported by the browser
      return reject(new Error('Geolocation is not supported by this browser.'))
    }
  })
}
