const { Router } =require( "express");
const { createHash, isValidadPassword } =require( "../utils/passwJwt.js");
const userModel = require("../dao/models/userModel.js");
const passport = require("passport");
const { generateToken } = require("../utils/passwJwt.js");

const router = Router();
// Notas: también debo definir las rutas en app.js (generico) y en viewsRouter.js (vistas)
// -----------------------------------------------------------
// rutas post  -  register
// -----------------------------------------------------------
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password, role } = req.body;
  const password_hash = createHash(password);
  try {
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "El correo ya existe."});
    }
    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: password_hash,
      role
    };
    await userModel.create(newUser);
    res.status(201).redirect("/login");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", err: error.message });
  }
});
// estos dos (register y failregister) son con passport y reemplazan el post de register de arriba
// router.post('/register',passport.authenticate('register',{failureRedirect:"failregister"}), async(req,res)=>{
//   res.redirect("/login")
// })

// router.get("/failregister", (req, res) => {
//   res
//     .status(400)
//     .send({ status: "error", message: "Error al registrar el usuario" });
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const userExist = await userModel.findOne({ email: email });
//     if (userExist) {
//       const isValid = isValidadPassword(password, userExist.password);
//       if (isValid) {
//         req.session.user = {
//           first_name: userExist.first_name,
//           last_name: userExist.last_name,
//           email: userExist.email,
//         };
//         res.redirect("/profile");
//       } else {
//         res.status(401).json({ message: "Error de credenciales" });
//       }
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error interno del servidor", err: error.mesagge });
//   }
// });

// -----------------------------------------------------------
// rutas post  -  login
// -----------------------------------------------------------

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await userModel.findOne({ email: email });
    
    if (!userExist) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Proteger la validación de contraseña
    let isValid = false;
    try {
      isValid = isValidadPassword(password, userExist.password);
    } catch (hashError) {
      console.error("Error al validar contraseña:", hashError);
      return res.status(401).json({ message: "Error de credenciales" });
    }
    
    if (isValid) {
      const userPayload = {
        id: userExist._id,
        first_name: userExist.first_name,
        last_name: userExist.last_name,
        age: userExist.age,
        email: userExist.email,
        cart: userExist.cart,
        role: userExist.role
      }; 
      
      const token = generateToken(userPayload);
      res.cookie("authCookie", token, { maxAge: 3600000, httpOnly: true });
      // return res.redirect("/profile");
      res.render('profile', { title: 'Profile del usuario' , user: userPayload, token });
    } else {
      return res.status(401).json({ message: "Error de credenciales" });
    }
    
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ 
      message: "Error interno del servidor", 
      error: error.message  // Nota: era "mesagge" (typo corregido)
    });
  }
});

// -----------------------------------------------------------
// recupero de pass
// -----------------------------------------------------------
router.post("/recupero", async (req, res) => {
  const { email, password } = req.body;
  try {
    // validamos si recibimos todos los campos
    const userFound = await userModel.findOne({ email });
    const password_hash = createHash(password);
    userFound.password = password_hash;
    await userFound.save();
    res.redirect("/login");
  } catch (error) {
    // agregar respuesta
  }
});

// -----------------------------------------------------------
// logout
// -----------------------------------------------------------
router.post("/logout", (req, res) => {
  try {
    // Limpiar la cookie de autenticación
    res.clearCookie("authCookie", { httpOnly: true, path: '/' });
    return res.redirect('/login'); // redirige directamente al login    
    
  } catch (error) {
    console.error("Error en logout:", error);
    return res.status(500).json({ 
      status: "error",
      message: "Error al cerrar sesión",
      error: error.message 
    });
  }
});


module.exports = router;
