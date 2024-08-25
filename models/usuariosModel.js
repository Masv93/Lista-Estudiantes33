const pool = require("../conexion");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsuariosModel {
  async Registrarse(usuarioPost) {
    const { usuario, nombre, email, rol, clave } = usuarioPost;

    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO usuarios (nombre, usuario, clave, email, rol) VALUES (?, ?, ?, ?, ?)`,
        [nombre, usuario, clave, email, rol],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  IniciarSesion(user) {
    return new Promise((resolve, reject) => {
        let usuario = user.user;
        let clave = user.pass;
        
        // Consulta SQL para buscar el usuario y clave en la base de datos
        pool.query(
            `SELECT * FROM usuarios WHERE usuario = ? AND clave = ?`,
            [usuario, clave],  // Usamos placeholders para prevenir SQL injection
            function (err, usuarioBD) {
                if (err) {
                    reject(err);  // Manejo de errores en la consulta
                } else {
                    if (usuarioBD.length > 0) {
                        // Usuario y clave coinciden
                        resolve(usuarioBD[0]);  // Devolvemos los datos del usuario
                    } else {
                        // Usuario no encontrado o clave incorrecta
                        reject(new Error("Usuario o clave incorrectos"));
                    }
                }
            }
        );
    });
}


  async editarUsuario(id, usuario) {
    const { nombre, email } = usuario;
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?",
        [nombre, email, id],
        (error, usuarioBDs) => {
          if (error) {
            return reject(error);
          }
          resolve(usuarioBDs);
        }
      );
    });
  }

  async borrarUsuario(id) {
    return new Promise((resolve, reject) => {
      pool.query(
        "DELETE FROM usuarios WHERE id = ?",
        [id],
        (error, usuarioBDs) => {
          if (error) {
            return reject(error);
          }
          resolve(usuarioBDs);
        }
      );
    });
  }

  async Decodificar(token) {
    return new Promise((resolve, reject) => {
      if (token) {
        jwt.verify(token, process.env.AUTENTICADOR, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          pool.query(
            `SELECT * FROM usuarios WHERE id = ?`,
            [decoded.id],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                if (result.length === 0) {
                  reject(new Error("No existe el usuario"));
                } else {
                  resolve(decoded);
                }
              }
            }
          );
        });
      } else {
        reject(new Error("No existe token"));
      }
    });
  }

  async CerrarSesion(cookie) {
    return new Promise((resolve, reject) => {
      if (cookie) {
        resolve();
      } else {
        reject(new Error("No hay una sesión iniciada"));
      }
    });
  }

  async Editar(usuarioid, datos) {
    const { contraseñaVieja, contraseñaNueva, nombre, usuario, email } = datos;

    return new Promise(async (resolve, reject) => {
      pool.query(
        `SELECT clave FROM usuarios WHERE id = ?`,
        [usuarioid],
        async (err, result) => {
          if (err) {
            reject(err);
          } else {
            const claveEncriptada = result[0].clave;
            const claveDesencriptada = await bcryptjs.compare(contraseñaVieja, claveEncriptada);
            if (claveDesencriptada) {
              const claveCodificada = await bcryptjs.hash(contraseñaNueva, 8);
              pool.query(
                `UPDATE usuarios SET nombre = ?, usuario = ?, clave = ?, email = ? WHERE id = ?`,
                [nombre, usuario, claveCodificada, email, usuarioid],
                (err, result) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(result);
                  }
                }
              );
            } else {
              reject(new Error("Las contraseñas no coinciden"));
            }
          }
        }
      );
    });
  }

  async Obtener() {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM usuarios", (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}

module.exports = new UsuariosModel();