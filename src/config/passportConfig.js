const passport = require("passport");
const local = require("passport-local");
const userModel = require("../dao/models/userModel.js");
const { createHash } = require("../utils/passwJwt.js");
const jwt = require("passport-jwt");

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const JWT_SECRET = "anitalavalatina";
const LocalStrategy = local.Strategy;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["authCookie"];
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email } = req.body;
        try {
          const userFound = await userModel.findOne({ email: username });
          if (userFound) {
            console.log("Usuario existente en la db");
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
          };
          const user = await userModel.create(newUser);
          return done(null, user);
        } catch (error) {
          return done(`Error al crear el usuario ${error}`, false);
        }
      }
    )
  );

  // jwt strategy
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // serialización de usuario
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

module.exports = initializePassport;