const UsuarioModel = require('../models/usuariosModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UsuarioController {
    IniciarSesion(usuario) {
        return new Promise((resolve, reject) => {
         UsuarioModel.IniciarSesion(usuario)
         .then((result) => {
             resolve(result)
         }).catch((err) => {
             reject(err)
         });
        })
     }
    

    async Registrarse(usuario) {
        try {
            return await UsuarioModel.Registrarse(usuario);
        } catch (err) {
            throw err;
        }
    }

    Decodificar(token){
        return new Promise((resolve, reject) => {
            UsuarioModel.Decodificar(token)
            .then((result) => {
                resolve(result)
            }).catch((err) => {
                reject(err)
            });

        })
    }

    async CerrarSesion(cookie) {
        try {
            await UsuarioModel.CerrarSesion(cookie);
        } catch (err) {
            throw err;
        }
    }

    async Editar(id, datos) {
        try {
            await UsuarioModel.Editar(id, datos);
        } catch (err) {
            throw err;
        }
    }

    async Obtener() {
        try {
            return await UsuarioModel.Obtener();
        } catch (err) {
            throw err;
        }
    }

    async BorrarUsuario(id) {
        try {
            await UsuarioModel.BorrarUsuario(id);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new UsuarioController();