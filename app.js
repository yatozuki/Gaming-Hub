import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res) => {
    res.render("home.ejs");
});












app.listen(port, () => console.log(`Server is running on port: ${port}`));




