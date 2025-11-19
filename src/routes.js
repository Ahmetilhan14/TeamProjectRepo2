module.exports = (express)=>{
    const router =express.Router();

    router.get('/health',(req,res)=>{
        res.status(200).json({
            status: 'success',
            message:'API v1 rotaları hazır ve çalışıyor (veritabanı bağlantısı bekleniyor).',
            timesamp:new Date().toISOString()
        });
    });
    return router;
};