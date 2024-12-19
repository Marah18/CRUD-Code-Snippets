import express from "express";
import { getUsers, register, login, logout } from '../controllers/userController.mjs';
import { isAuthenticated } from '../middleware/authentication.mjs';
import User from '../model/config.mjs'
const router = express.Router();


router.get('/allusers', getUsers);

router.get('/', (req, res) => {
  const isAuthenticated = req.session.username !== undefined;
  res.render('home', { isAuthenticated, username: req.session.username });
});


router.get('/403', (req, res) => {
  res.render('page403');
});


router.get('/404', (req, res) => {
  res.render('page404');
});

router.get('/500', (req, res) => {
  res.render('page500');
});

router.get("/login", (req, res) => {
  res.render("login")
})

router.get('/home', (req, res) => {
  const isAuthenticated = req.session.username !== undefined;
  res.render('home', { isAuthenticated, username: req.session.username });
});

router.get("/register", (req, res) => {
  res.render("register")
})

router.post("/register", register)

router.post("/login", login)

router.get("/logout", isAuthenticated, logout);


export default router;
