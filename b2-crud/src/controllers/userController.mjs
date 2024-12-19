import User from '../model/config.mjs';
import bcrypt from 'bcrypt';

const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
        //console.log("worked")
        res.status(200).json(users);
    } catch (error) {
        console.log("error")

        res.status(500).json({ message: error.message });
    }
}

const register = async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    console.log(data)
    // check if exist first 
    const foundUser = await User.findOne({ name: data.name })
    if (foundUser) {
        req.flash('error_msg', 'User name already exists. Try another name!');
        res.redirect('/register');
        //res.send("User name already exists. Try another name!")
    } else {
        try {
            const hashingRounds = 10;
            const hashedPass = await bcrypt.hash(data.password, hashingRounds);
            data.password = hashedPass;

            const userData = new User(data);
            await userData.save();

            req.flash('success_msg', 'You are now registered and now you can log in!');
            res.redirect('/login');
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Something went wrong. Please try again.');
            res.redirect('/register');
        }
    }
};

const login = async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    console.log(data.name)
    console.log(data.password)

    // check if exist first 
    try {
        const foundUser = await User.findOne({ name: data.name })
        if (!foundUser) {
            console.log(data.name)
            console.log("Username not found")
            req.flash('error_msg', 'Username not found');
            return res.redirect('/login');

        }
        // compare password
        const checkMatchingPass = await bcrypt.compare(data.password, foundUser.password);
        if (!checkMatchingPass) {
            console.log(data)

            console.log("wrong Password")
            req.flash('error_msg', 'Wrong password');
            return res.redirect('/login');
        }
        else {

            console.log("LOGGEN IN")
            req.session.username = data.name;
            console.log("Session Username after:", req.session.username);
            req.flash('success_msg', 'You are now logged in');

            res.redirect("home");
        }
    }
    catch (error) {
        console.error("Error:", error);
        req.flash('error_msg', 'An error occurred');
        res.redirect('/login');
    }


}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Session error:", err);
            req.flash('success_msg', 'You have successfully logged out.');

            return res.redirect("/home");

        }
        res.redirect("/");
    });
}


export {
    getUsers, register, login, logout
}