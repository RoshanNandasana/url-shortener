const express=require("express");
const {connectToMongoDB}=require("./connect");
const URL=require("./Models/url");

const path=require("path");
const urlRoute=require("./routes/url"); 
const staticRoute=require('./routes/staticRouter')

const app=express();


const PORT=8001;

connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log("mongoDB connected")
);

app.set('view engine','ejs');  //to add ejs
app.set("views",path.resolve("./views"));               //where ejs file is stored

app.use(express.json()); 
app.use(express.urlencoded({extended : false})) //for form


app.use("/url",urlRoute);
app.use("/",staticRoute);


app.use(express.static(path.join(__dirname,'public')));

// app.get("/test",async(req,res)=>{
//     const allUrls=await URL.find({});
//     return res.render('home',{
//       urls:allUrls,   //for this we need to add it in home.ejs
      
//     });
    

//     // return res.end
//     //(`
//     // <html>
//     //   <head></head>
//     //   <body>
//     //   <ol>
//     //       ${allUrls.map(url=>`<li>${url.shortId}-${url.redirectURL}-${url.visitHistory.length}</li>`).join('')}
//     //   </ol>
//     //   </body>
//     //   </html>
//     // `);
// });


app.get('/url/:shortId',async(req,res)=>{
   const shortId=req.params.shortId;
   const entry = await URL.findOneAndUpdate(
    {
    shortId
   },
   {
    $push: {
    visitHistory: {
        timestamp:Date.now(),
    },
  },
}
);
 res.redirect(`${entry.redirectURL}`);
});

app.listen(PORT,()=>console.log(`Server started at PORT:${PORT}`))