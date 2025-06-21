const express = require('express')
const cors = require('cors');
const {dbConnection} = require('../database/config');
const passport = require('../helpers/passport');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: 429,
      msg: 'Demasiados intentos, intenta de nuevo más tarde.',
    },
  });

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT
        this.authRoutes = "/api/auth";
        this.userRoutes = "/api/users";
        this.conectarDb();
        this.middleware(); 
        this.routes()
    }
    async conectarDb (){
        await dbConnection();
    }
    middleware() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static("src/public"));
        this.app.use(passport.initialize());
      }

    routes(){
        this.app.use(this.authRoutes, authLimiter, require('../routes/auth'));
        this.app.use(this.userRoutes, require('../routes/user'));
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log(`🚀 Servidor corriendo en: http://localhost:${this.port}`);
          });
    }
}

module.exports = Server