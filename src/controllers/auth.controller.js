const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');

const users=[];

const JWT_SECRET=process.env.JWT_SECRET||'cok_gizli_anahtar';

const authController=()=>{
    const register = async (req,res ,next)=>{
        console.log('Register istek gövdesi: ',req.body);
        //Güvenlik katmanı:req.body'nin undefined gelmesi durumunda manuel kontrol
        if(!req.body||Object.keys(req.body).length===0){
            return res.status(400).json({
                message:'İstek gövdesi (Body) boş.'
            });
        }


        const {email, password,name} = req.body;
        if(!email||!password||!name){
            return res.status(400).json({message:'Lütfen tüm alanları doldurun'});
        }
        const existingUser=users.find(u=>u.email===email);
        if(existingUser){
            return res.status(409).json({message:'Bu e-posta adresi zaten kayıtlı'});
        }
        try{
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(password,salt);

            const newUser={
                id:users.length+1,
                email,
                name,
                password:hashedPassword,
            };
            users.push(newUser);
            console.log(`Yeni kullanıcı kaydedildi: ID${newUser.id},E-posta: ${newUser.email}`);

            res.status(201).json({
                message:'Kayıt başarılı. Şimdi giriş yapabilirsiniz',
               user:{id:newUser.id,name:newUser.name,email:newUser.email}
            });
        }catch (error){
            next(error);
        }
    };
    const login=async (req,res,next)=>{
        console.log('Login istek gövdesi: ', req.body);
        //Güvenlik katmanı: req body nin undefined gelmesi durumunda manuel kontrol
        if(!req.body||Object.keys(req.body).length===0){
            return res.status(400).json({
                message:'İstek gövdesi (Body) boş.'
            })
        }
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:'E-posta ve şifre zorunludur.'});
        }
        const user=users.find(u=>u.email===email);
        if(!user){
            return res.status(401).json({message:'Geçersiz kimlik bilgileri.'});
        }
        try{
            const isMatch=await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(401).json({message:'Geçersiz kimlik bilgileri.'});
            }
            const token=jwt.sign({
                id:user.id,email:user.email,},
                JWT_SECRET,
                {expiresIn: '1h'}
            );
            res.status(200).json({
                message:'Giriş başarılı.',
                token,
                user:{id:user.id,name:user.name,email:user.email}
            });
        }catch (error){
            next(error);
        }
    }
    return {
        register,
        login,
    };

};
module.exports=authController;