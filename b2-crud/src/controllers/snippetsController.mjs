import User from '../model/config.mjs';

// add a new snippet to a loged in user
const addSnippet = async (req, res) => {
    try {
        const { title, content } = req.body;
        const username = req.session.username;
        const foundUser = await User.findOne({ name: username });

        if (!foundUser) {
            req.flash('error_msg', 'User not found.');
            return res.redirect('/addSnippet');
        }

        foundUser.snippets.push({ title, content });
        await foundUser.save();

        req.flash('success_msg', 'Snippet added successfully!');
        res.redirect("/addSnippet");
    } catch (error) {
        req.flash('error_msg', 'Something went wrong. Please try again.');
        res.redirect('/addSnippet');
    }
};

// show a user snippet according to the username
const showUserSnippets = async (req, res) => {

    try {
        const foundUser = await User.findOne({ name: req.session.username });

        if (!foundUser) {
            return res.status(404).render("page404");
        }
        const snippets = foundUser.snippets || [];
        // console.log(snippets)
        res.render("showUserSnippet", {
            username: foundUser.name,
            snippets,
            isAuthenticated: true
        });

    } catch (error) {
        res.status(500).render("500");
    }
};

// show all snippets in the user database schema in mongodb
const showAllSnippets = async (req, res) => {
    try {
        const users = await User.find({});
        const snippets = users.flatMap(user =>
            user.snippets.map(snippet => ({
                ...snippet._doc,
                username: user.name
            }))
        );
        //console.log(snippets)
        res.render("showSnippets", { snippets });
    } catch (error) {
        console.error("Error :", error);
        res.status(500).render("page500");
    }
}


const showEditForm = async (req, res) => {
    try {
        const snippetId = req.params.id;
        const foundUser = await User.findOne({
            name: req.session.username,
            'snippets._id': snippetId
        });
        if (!foundUser) {
            return res.status(404).render("page404");
        }
        const snippet = foundUser.snippets.id(snippetId);
        res.render("editSnippet", {
            username: foundUser.name,
            snippet,
            isAuthenticated: true
        });
    } catch (error) {
        res.status(500).render("page500");
    }
};

// update a user snippet according to the username, 
const updateSnippet = async (req, res) => {
    try {
        const snippetId = req.params.id;
        const { title, content } = req.body;
        const foundUser = await User.findOneAndUpdate(
            { 'snippets._id': snippetId, name: req.session.username },
            {
                $set: {
                    'snippets.$.title': title,
                    'snippets.$.content': content
                }
            },
            { new: true }
        );
        if (foundUser) {
            req.flash('success_msg', 'Snippet updated!');
            res.redirect('/showUserSnippet');
        } else {
            req.flash('error_msg', 'Snippet could not found.');
            res.redirect('/showUserSnippet');
        }
    } catch (error) {
        console.error("Error when updating the snippet:", error);
        res.status(500).send("Error when updating the snippet.");
    }
};


const deleteSnippet = async (req, res) => {
    try {
        const snippetId = req.params.id;
        await User.findOneAndUpdate(
            { 'snippets._id': snippetId },
            { $pull: { snippets: { _id: snippetId } } }
        );
        req.flash('success_msg', 'Snippet deleted!');
        res.redirect('/showUserSnippet');
    } catch (error) {
        console.error("Error with deleting snippet:", error);
        req.flash('error_msg', 'Error with deleting snippet.');
        res.redirect('/showUserSnippet');
    }
};

const showSnippetsByUser = async (req, res) => {
    try {
        const username = req.query.username;
        const users = await User.find({});
        if (!username || username === '') {
            return res.render('showSnippetsByUser', { users, snippets: [], selectedUser: '' });
        }
        const foundUser = await User.findOne({ name: username });
        if (!foundUser) {
            req.flash('error_msg', 'User not found.');
            return res.redirect('/showAllSnippets');
        }
        const snippets = foundUser.snippets || [];
        res.render('showSnippetsByUser', { snippets, users, selectedUser: username });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('page500');
    }
};


export {
    addSnippet, showUserSnippets, showAllSnippets, showEditForm,
    updateSnippet, deleteSnippet, showSnippetsByUser
}