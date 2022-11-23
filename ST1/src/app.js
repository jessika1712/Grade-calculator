const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyparser({extended:true}));

app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/templates/index.html')
})

app.post('/',async (req,res)=>{
    const data = req.body;

    let average=0;

    data.cemail.forEach((cm)=>{
        average += Number(cm); 
    })

    average = average/5;

    const nd = {
        name:data.firstname,
        id:data.email,
        average:average,
        numbers:data.cemail
    }

    if (!fs.existsSync('data.json')) {
        //create new file if not exist
        fs.closeSync(fs.openSync('data.json', 'w'));
    }
    
    // read file
    const file = fs.readFileSync('data.json')
    
    //check if file is empty
    if (file.length == 0) {
        //add data to json file
        fs.writeFileSync("data.json", JSON.stringify([nd]))
    } else {
        //append data to jso file
        let json = JSON.parse(file.toString())
        json.push(nd);
        fs.writeFileSync("data.json", JSON.stringify(json))
    }

    res.redirect('/displayResult');
})

app.get('/displayResult',(req,res)=>{
    const data = require('../data.json');

    console.log(data)

    let grades=[];

    data.forEach(({average,name,id,numbers})=>{
        if(average>=90){
            grades.push({grade:'A',name,id,numbers,average});
        }else if(average>=80 && average<90){
            grades.push({grade:'B',name,id,numbers,average});
        }else if(average>=70 && average<80){
            grades.push({grade:'C',name,id,numbers,average});
        }else if(average>=60 && average<70){
            grades.push({grade:'D',name,id,numbers,average});
        }else if(average>=33 && average<60){
            grades.push({grade:'E',name,id,numbers,average});
        }else if(average<33){
            grades.push({grade:'F',name,id,numbers,average});
        }
    })


    res.render('results',{data:grades});

})

module.exports=app;