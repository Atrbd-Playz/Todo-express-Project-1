const express = require('express');
const app = express();
const path = require("path")
const fs = require("fs")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs");


//This section is for showing all the files in the files folder
app.get("/", function (req, res) {
    fs.readdir(`./files`, function (err, files) {
        res.render("index", { files: files })
    })
});

//This section is for creating new file in the files folder
app.post("/create", function (req, res) {
    fs.writeFile(`./files/${req.body.title.split(' ').join('_')}`, req.body.details, function (err) {
        res.redirect("/")
    })
});

//This section is for fecthing file data from the files folder and showcasing them in show.ejs folder
app.get("/file/:filename", function (req, res) {

    fs.readFile(`./files/${req.params.filename}`, function (err, data) {
        res.render("show", { data: data, filename: req.params.filename })
    })
});


//This section is for fetching data from the input tag and textarea tag from fronend
app.get("/edit/:filename", function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, function (err, data) {
        res.render("edit", { data: data, filename: req.params.filename })
    })

});

//This section is for saving data from the input tag and textarea tag from fronend
//And the if else is making sure that if anyone leave the new file name section empty then the file name won't be changed
app.post("/edit", function (req, res) {
    if (req.body.newTitle.length === 0) {
        req.body.newTitle = req.body.previous
        fs.rename(`./files/${req.body.previous.split(' ').join('_')}`, `./files/${req.body.newTitle.split(' ').join('_')}`, function (err) {
        });

        fs.writeFileSync(`./files/${req.body.newTitle.split(' ').join('_')}`, req.body.details)

        console.log(req.body.newTitle);
    }
    else {
        fs.rename(`./files/${req.body.previous.split(' ').join('_')}`, `./files/${req.body.newTitle.split(' ').join('_')}`, function (err) {
        });

        fs.writeFileSync(`./files/${req.body.newTitle.split(' ').join('_')}`, req.body.details)
    }

    res.redirect('/')
});

//This Section is for deleting file with the help of fs module
app.post("/delete/:filename", function (req, res) {
    const buttonValue = req.body.confirm;
    if (buttonValue === false) {
        res.redirect(`/`)
    }
    else{
        fs.unlink(`./files/${req.params.filename}`, function (err) {
            res.redirect("/")
        })

    }
    // fs.unlink(`./files/${req.params.filename}`, function(err){
    //     res.redirect("/")
    // })
});



app.listen(3000);
