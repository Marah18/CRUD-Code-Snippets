// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.username) {
        // go to the route handler
        return next();
    }

    // Check if the URL is for htis protected routes
    if (req.originalUrl.includes("/addSnippet") ||
        req.originalUrl.includes("/showUserSnippet") ||
        req.originalUrl.includes("/editSnippet") ||
        req.originalUrl.includes("/deleteSnippet")
    ) {
        console.log(req.originalUrl);

        return res.status(403).render("page403");
    }

    else {

        res.redirect("/login");
    }

}

export { isAuthenticated };
