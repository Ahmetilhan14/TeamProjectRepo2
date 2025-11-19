const authController=require('./controllers/auth.controller');

module.exports = (express)=>{
    const router =express.Router();

    const authHandlers = authController();


    router.get('/health',(req,res)=>{
        res.status(200).json({
            status: 'success',
            message:'API v1 rotaları hazır ve çalışıyor (veritabanı bağlantısı bekleniyor).',
            timesamp:new Date().toISOString()
        });
    });
    router.post('/auth/register',authHandlers.register);
    router.post('/auth/login',authHandlers.login);

    return router;
};