require('dotenv').config();
const express=require('express');
const cors=require('cors');
const helmet=require('helmet');

const app=express();
const PORT=process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
    origin:'*',
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true,
}));

app.use(express.json());

app.get('/',(req,res)=>{
    res.status(200).json({
        message:'Api çalışıyor (DB bağlantısız.)',
        uptime:process.uptime()
    });
});

const apiRoutes=require('./routes')(express);
app.use('/api/v1',apiRoutes);


app.use((req,res,next)=>{
    const error=new Error(`Bu rota bulunamadı: ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    console.error('Genel hata yakalandı: ',error.stack);

    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message||'Sunucu iç hatası',
            status:error.status||500
        }
    })
});

app.listen(PORT,()=>{
    console.log(`Server ${PORT} portunda çalışıyor.....`);
});