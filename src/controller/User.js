const JWT = require("jsonwebtoken");

const DB = require("../utils/DB");
const email = require("../utils/email");
const UserModel = require("../model/User");
const CodeModel = require("../model/Code");

module.exports = class User {
    async login(payload) {
        try {
            await DB.connect();

            const user = await UserModel.findOne({ email: payload.email });

            if (!user) {
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json" },
                    body: {
                        status: "error",
                        message: "user not found"
                    }
                }
            }
						
            // Code entre 0 y 9999
            const randomCode = Math.floor(Math.random() * 10000);

            // Eliminamos códigos pre-existentes, con esto invalidamos intentos previos de login
            await CodeModel.remove({ email: payload.email });
    
            // Guardamos el nuevo intento de login
            await CodeModel.create({
                    email: payload.email,
                    code: randomCode
            });

            // Enviamos el código generado hacia el correo electrónico del usuario
            // Usamos un email template de Mailgun donde podemos aplicar el diseño necesario
            // email([EMAIL DESTINO], [EMAIL SUBJECT], [TEMPLATE], [PAYLOAD])
            email(payload.email, "NodeHispano - Ingresa a tu cuenta", "login_message", {code: randomCode});

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: {
                    status: "ok",
                    message: "login attempt",
                }
            }
        } catch (err) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: {
                    status: "error",
                    message: err.message
                }
            }
        }
    }

    async validate(payload) {
        try {
            await DB.connect();

            // Verificamos que existe un código asociado al email
            const code = await CodeModel.findOne({
                    email: payload.email,
                    code: payload.code
            });

            // De no existir retornamos una respuesta con el mensaje correspondiente
            if (!code) {
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json" },
                    body: {
                        status: "error",
                        message: "login attempt"
                    }
                }
            }

            // Si todo esta correcto obtenemos la información del User
            // Generamos un token con la información del usuario (Válido por 1 día)
            // Firmamos el payload del token con JWT y el secret de nuestras variables de entorno
            // Finalmente enviamos como response el nuevo token
            const user = await UserModel.findOne({ email: payload.email });
						
			const tokenPayload = {
                id: user.id,
                email: payload.email
            }
            const token = JWT.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1d" });

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: {
                    status: "ok",
                    message: "login valid",
                    token: token
                }
            }
        } catch (err) {
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: {
                    status: "error",
                    message: err.message
                }
            }
        }
    }
}