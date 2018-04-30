class User {
    // name: String,
    // password: String
    constructor(_id, name, password, role) {
        this._id = _id;
        this.name = name;
        this.password = password;
        this.role = role;
    }

}

module.exports = User;