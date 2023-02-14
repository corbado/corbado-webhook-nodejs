class UserDatabase {
    // Constructor to initialize the database connection or anything else you need.
    constructor() {
        // Your database connection or initialization logic.
    }

    /**
     * Checks if user exists on your side/in your database.
     *
     * !!! MUST BE IMPLEMENTED BY YOU !!!
     *
     * @param {string} username
     * @return {string}
     */
    async getUserStatus(username) {
        /////////////////////////////////////
        // Implement your logic here!
        ////////////////////////////////////

        // Example
        if (username === 'existing@existing.com') {
            return 'exists';
        }

        return 'not_exists';
    }

    /**
     * Verify given username and password.
     *
     * !!! MUST BE IMPLEMENTED BY YOU !!!
     *
     * @param {string} username
     * @param {string} password
     * @return {boolean}
     */
    async verifyPassword(username, password) {
        /////////////////////////////////////
        // Implement your logic here!
        ////////////////////////////////////

        // Example
        return username === 'existing@existing.com' && password === 'supersecret';
    }
}

module.exports = UserDatabase;