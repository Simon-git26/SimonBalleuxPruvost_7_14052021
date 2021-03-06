const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { connect } = require('../app');
const { user, post, comments } = require("../models");

const db = require("../models");

//MOT DE PASSE FORT 
var passwordValidator = require('./password-validator');

//Enregistré dans la base de donné les nouveaux Users
exports.signup = (req, res, next) => {
    //password validator
   var isValid = passwordValidator.validate(req.body.password);
   if (!isValid) {
       res.status(400).json({ error : "mot de passe non valide pour le package password validator" });
   } else {
       //Haché le mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        db.user.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash
        })
        .then((createUser) => res.status(201).json({ createUser }))
        .catch(error => res.status(400).json({ error: error.message }));
    })
    .catch(error => res.status(500).json({ error: error.message }));
   }
};



//Login: on récupere le user de la base qui correspond a l'adress mail entré / si email pas bon on renvoi une erreur / 
//on compare le mdp entré avec le hash qui est garder dans la BDD / si pas bon on renvoi une erreur /
// si bon alor on renvoi un TOKEN et un userID

exports.login = (req, res, next) => {
    console.log(req.body.email);
    db.user.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        //Si on arrive ici c'est que on a bien trouvé un user donc on utilise bcrypt pour comparer les mdp
        
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            console.log('valid', valid);
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    imagePath: user.imagePath,
                    isAdmin: user.isAdmin
                },
                token: jwt.sign(
                    { userId: user.id },
                    process.env.TOKEN_SECRET,
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};




exports.findUser = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
    db.user.findOne({
        where: {
            id: userId
        }
    })
    .then((user) => {
        user.password = undefined;
        res.status(200).json(user);
    })
    .catch(error => res.status(404).json({ error }));
};



exports.profilUser = async (req, res, next) => {
    // Chercher le user qui correspond à req.params.id dans la bdd.
    const user = await  db.user.findOne({
        where: {
            id: req.params.id,
        }
    });
    user.description = req.body.description;
    console.log('user', user);
    user.save()
    .then(() => res.status(200).json({ message: 'Description changée !' }))
    .catch(error => res.status(400).json({ error }));
};


exports.changePassword = async (req, res, next) => {
    var isValid = passwordValidator.validate(req.body.newPassword);
    if (!isValid) {
        res.status(400).json({ error : "mot de passe non valide pour le package password validator" });
    } else {
        try {
            const user = await  db.user.findOne({
                where: {
                    id: req.params.id
                }
            });
            const valid = await bcrypt.compare(req.body.password, user.password);
            console.log('valid', valid);
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            user.password = await bcrypt.hash(req.body.newPassword, 10);
            console.log('user', user);
            await user.save();
            res.status(200).json({ message: 'Mot de passe mis à jour' });
        } catch (error) {
            res.status(500).json({ error });
        }
    }
};

//Supprimer un user de la BDD
exports.deleteUser = async (req, res, next) => {
    const user = await db.user.findOne({
        where: {
            id: req.params.id
        }
    });

    await db.comments.destroy({ where: {UserId: user.id}})
    await db.post.destroy({ where: {UserId: user.id}})

    user.destroy()

    .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
    .catch(error => res.status(400).json({ error }));
};


//Enregistrer une image profil
exports.savePicture = async (req, res, next) => {

    const user = await db.user.findOne({
        where: {
            id: req.params.id
        }
    });

    user.imagePath = req.file.path

    user.save()

    .then((Picture) => res.status(201).json(Picture))
    .catch(error => res.status(400).json({ error }));
};


//Récuperer tous les user pour page Menbre
exports.findAllUsers = async (req, res, next) => {

    db.user.findAll()

    .then((users) => res.status(201).json(users))
    .catch(error => res.status(400).json({ error }));
};


//Supprimer un User par le Modos
exports.modoDeleteUser = async (req, res, next) => {
    const user = await db.user.findOne({
        where: {
            id: req.params.id
        }
    });

    await db.comments.destroy({ where: {UserId: user.id}})
    await db.post.destroy({ where: {UserId: user.id}})

    user.destroy()

    .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
    .catch(error => res.status(400).json({ error }));
};


// Trouver un user destinataire pour la messagerie
exports.findUserMessagerie = async (req, res) => {
    const user = await  db.user.findOne({
        where: {
            id: req.params.id,
        }
    })

    .then((findUser) => res.status(200).json( findUser ))
    .catch(error => res.status(400).json({ error }));
};