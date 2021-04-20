const User = require('../models/User');
const bcrypt = require('bcryptjs');

const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res) => {

    const {email, password} = req.body;

    try {

        let user = await User.findOne({email});

        if(user) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya se encuentra registrado'
            })
        }
        
        user = new User( req.body );
    

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        const token = await generateJWT(user.id, user.name);

        await user.save();
        
        res.status(201).json({
            ok: true,
            uid: user._id,
            name: user.name,
            token
        });

    } catch (error) {
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

        const validPassword = bcrypt.compareSync(password, user.password);
        
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        const token = await generateJWT(user.id, user.name);
    
        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

        
    } catch (error) {
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