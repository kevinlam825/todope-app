class User {
    // name: String,
    // password: String
    constructor(_id, name, email, password, role) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

}

module.exports = User;