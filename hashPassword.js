const bcrypt = require('bcryptjs');

function hashPasswordSync(password) {
  return bcrypt.hashSync(password, 12);
}

function verifyPasswordSync(password, hashed) {
  return bcrypt.compareSync(password, hashed);
}

module.exports = {
    hashPasswordSync,
    verifyPasswordSync
}
