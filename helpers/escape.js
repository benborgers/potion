/* Excape HTML */

module.exports = text => text
                          .replace(/</g, "&lt;")
                          .replace(/>/g, "&gt;")