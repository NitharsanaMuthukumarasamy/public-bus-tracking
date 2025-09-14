// types.js

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'super_admin' | 'admin' | 'driver' | 'user'} role
 * @property {string} [busNumber] - Assigned bus for drivers
 * @property {string} createdAt - ISO string
 */

/**
 * @typedef {Object} BusStop
 * @property {string} id
 * @property {string} name
 * @property {{lat: number, lng: number}} location
 * @property {string} [estimatedArrival] - e.g., "5 mins"
 * @property {number} [distance] - in km
 */

/**
 * @typedef {Object} Bus
 * @property {string} id
 * @property {string} number
 * @property {string} route - e.g., "Perundurai - Karur"
 * @property {string} driver
 * @property {string} driverId
 * @property {{lat: number, lng: number}} currentLocation
 * @property {BusStop[]} stops
 * @property {'active' | 'breakdown' | 'accident' | 'traffic' | 'inactive'} status
 * @property {string} lastUpdated - ISO string
 */

/**
 * @typedef {Object} Alert
 * @property {string} id
 * @property {string} busId
 * @property {string} busNumber
 * @property {'accident' | 'breakdown' | 'traffic'} type
 * @property {string} message
 * @property {string} driverId
 * @property {string} driverName
 * @property {string} timestamp - ISO string
 * @property {boolean} resolved
 * @property {Bus[]} [alternatives]
 */

/**
 * @typedef {Object} Route
 * @property {string} id
 * @property {string} name
 * @property {BusStop[]} stops
 * @property {string[]} buses - Array of bus IDs
 */
