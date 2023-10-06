const bcrypt = require(`bcrypt`);
const salt = 10;

module.exports.hashPasswordGenerator = async (password) => {
    const generatedPassword = await bcrypt.hash(password, salt);
    return `${generatedPassword}`
}

module.exports.comparePassword = async (userPassword, hashPassword) => {
    const isMatched = await bcrypt.compare(userPassword, hashPassword);

    return isMatched;
}