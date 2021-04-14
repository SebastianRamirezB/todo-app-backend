const User = require('../models/User');
const bcrypt = require('bcryptjs');

const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res) => {

    //extraer email del cuerpo de la peticion
    const {email, password} = req.body;

    try {

        //Busqueda en la base de datos el email
        let user = await User.findOne({email});

        //Comprobar si el email ya se encuentra en la base de datos
        if(user) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya se encuentra registrado'
            })
        }
        
        //Instanciar un nuevo usuario con el Schema User
        user = new User( req.body );
    

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        //Generar JWT
        const token = await generateJWT(user.id, user.name);

        //Grabar en la base de datos el nuevo usuario instanciado
        await user.save();
        
        //Retornar status 201 con la creacion de un nuevo usuario
        res.status(201).json({
            ok: true,
            uid: user._id,
            name: user.name,
            token
        });

    } catch (error) {
        //manejo de error en la creación de un nuevo usuario
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const loginUser = async (req, res) => {


    const {email, password} = req.body;

    try {

        let user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo o la contraseña no son validos'
            });
        }

        //verificar contraseñas
        const validPassword = bcrypt.compareSync(password, user.password);
        
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        //Generar JWT
        const token = await generateJWT(user.id, user.name);
    
        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

        
    } catch (error) {
        //manejo de error en la creación de un nuevo usuario
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

const revalidateToken = async (req, res) => {

    const {uid, name} = req;
    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        token,
        uid,
        name
    });
}


module.exports = {
    createUser,
    loginUser,
    revalidateToken
}