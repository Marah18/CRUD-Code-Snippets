import express from "express";
import { addSnippet, showUserSnippets, showAllSnippets, showEditForm, updateSnippet, deleteSnippet, showSnippetsByUser } from '../controllers/snippetsController.mjs';
import { isAuthenticated } from '../middleware/authentication.mjs';
import User from '../model/config.mjs';

const router = express.Router();
router.get('/editSnippet/:id', isAuthenticated, showEditForm);

router.post('/editSnippet/:id', isAuthenticated, updateSnippet);

router.get("/addSnippet", isAuthenticated, async (req, res) => {
    try {
        const foundUser = await User.findOne({ name: req.session.username });

        if (!foundUser) {
            req.flash('error_msg', 'YOU must log in first!');

            res.redirect("/login")
        }

        const snippets = foundUser.snippets || [];
        res.render("addSnippet", {
            username: foundUser.name,
            snippets,
            isAuthenticated: true
        });

    } catch (error) {
        res.status(500).render("500");
    }
});

router.get("/showUserSnippet", isAuthenticated, showUserSnippets);

router.post("/addSnippet", isAuthenticated, addSnippet);

router.post('/deleteSnippet/:id', isAuthenticated, deleteSnippet)

router.get("/showAllSnippets", showAllSnippets);

// route to show snippets by a specific user
// query
router.get('/showSnippetsByUser', showSnippetsByUser);
// username
router.get('/showSnippetsByUser/:username', showSnippetsByUser);

export default router;
