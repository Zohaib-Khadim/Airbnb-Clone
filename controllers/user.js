const User = require("../models/user.js")

module.exports.getSignup= (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.postSignup = async(req, res) => {
    try {
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        const userRegistred = await User.register(newUser, password)
        // console.log(userRegistred);
        req.login(userRegistred, (error) => {
            if (error) {
                return next(error)
            }
            req.flash("success", "you are logged in!")
            res.redirect(req.session.redirectUrl);
            console.log(req.session.redirectUrl);
        })
    } catch (error) {
        req.flash("failure", error.message)
        res.redirect("/signup")
    }
}

module.exports.getLogin = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.postLogin = async (req, res) => {
    req.flash('success', 'Welcome to Wanderlust');
    // if(res.locals.redirectUrl===""){
    //     res.redirect("/listings")
    // }
    // else{
    //     res.redirect(res.locals.redirectUrl)
    // }
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((error) => {
        if (error) {
            return next(error)
        }
        req.flash("success", "you are logged out!")
        res.redirect("/listings");
    })
}