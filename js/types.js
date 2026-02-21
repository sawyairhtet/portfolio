/**
 * @typedef {Object} FileNode
 * @property {'file'} type
 * @property {string} content
 */

/**
 * @typedef {Object} DirNode
 * @property {'dir'} type
 * @property {string[]} children
 */

/**
 * @typedef {FileNode | DirNode} FileSystemNode
 */

/**
 * @typedef {Object.<string, FileSystemNode>} FileSystem
 */

/**
 * @typedef {Object} StickyNote
 * @property {string} text
 * @property {'yellow'|'pink'|'blue'|'green'} color
 * @property {number} rotation
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {'desktop'|'tablet'|'mobile'} DeviceType
 */

/**
 * @typedef {Object} WindowState
 * @property {string} top
 * @property {string} left
 * @property {string} width
 * @property {string} height
 */

export {};
