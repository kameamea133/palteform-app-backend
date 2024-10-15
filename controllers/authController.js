// backend/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'L\'utilisateur existe déjà' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();
    res.status(201).json({ msg: 'Utilisateur enregistré avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Utilisateur non trouvé' });
    }

    console.log("Utilisateur trouvé :", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Mot de passe incorrect' });
    }

    const payload = {
      user: {
        id: user._id,
        role: user.role
      }
    };

    

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      
      res.status(200).json({ 
        msg: 'Connexion réussie',
        user: {
          id: user._id,
          role: user.role,
          name: user.name
        }
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

exports.logout = (req, res) => {
    try {
      res.clearCookie('auth-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
  
      res.status(200).json({ msg: 'Déconnexion réussie' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  };
  


exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};
