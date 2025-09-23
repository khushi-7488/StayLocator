const user = require("../models/user") 

module.exports.signup = (req, res) => {
    res.render("users/signup.ejs")
} 

module.exports.signupValidate = async (req, res) => {
    try {

        let { username, email, password } = req.body;
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "user was registered")
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.login = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.loginValidate = async (req, res) => {
    req.flash("success", "welcome to wandurlust! You are logged in!")
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl)

}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "you are logged out")
        res.redirect("/listings")
    })
}


