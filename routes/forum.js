const express = require('express')
let app = express.Router()

const {db, Questions} = require('../db');

app.post('/update_admin_ans', function (req, res){
    console.log(req.body);
    if(req.body.ques_id && req.body.answer){
        Questions.update({ answer: req.body.answer }, {
            where: {
                id: req.body.ques_id
            }
        })
        .then((ques)=>{
            return res.send({val: "Success!"});
        }).catch((error)=>{
            return res.render('error', {error});
        })
    }
    else{
        return res.status('error').send({error: "Please enter valid answer!"});
    }
});

module.exports = app