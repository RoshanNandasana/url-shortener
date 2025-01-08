const { nanoid } = require('shortid');
const URL=require('../Models/url');
const shortid = require('shortid');


async function handleGenerateNewShortURL(req,res){
    const body=req.body;
    if(!body.url) return res.status(400).json({error:'ur is required'})
    const shortId=shortid(8); //=> "vv-n7xb0"
     await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitedHistory: [],
        createdBy: req.user._id,

     });
    return res.render('home',{
        id: shortId
    })
    //  return res.json({id: shortId});
    // return res.json({id: shortId});
}

async function handleGetAnalytics(req,res){
    const shortId =req.params.shortId;
    const result=await URL.findOne({shortId});
    return res.json({
        totalClicks:result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports={
    handleGenerateNewShortURL,
    handleGetAnalytics,
};