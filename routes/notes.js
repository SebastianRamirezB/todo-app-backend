const {Router} = require('express');
const { check } = require('express-validator');
const router = Router();

const { 
    getNotes, 
    createNote, 
    updateNote, 
    deleteNote } = require('../controllers/notes-controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

//validacion para todas la rutas
router.use(validateJWT);

//Rutas
//Obtener notas
router.get('/',getNotes);

//Crear notas
router.post('/',[
    check('text', 'El texto de la nota es obligatorio').not().isEmpty(),
    validateFields
],createNote );

//Actualizar evento
router.put('/:id',[
    check('completed', 'El campo deleted es obligatorio').not().isEmpty(),
    check('completed', 'El campo deleted debe ser true o false').isBoolean(),
    validateFields
],updateNote);

router.delete('/:id',deleteNote);


module.exports = router;