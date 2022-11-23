const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const SpazaSuggest = require('./spaza-suggest');
const Routes = require('./routes');
const pgPromise = require('pg-promise');
const pgp = pgPromise();

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:pg123@localhost:5432/spaza_suggest';
const config = {
  connectionString: DATABASE_URL
}

if (process.env.NODE_ENV == 'production') {
	config.ssl = { 
		rejectUnauthorized : false
	}
}

const db = pgp(config);

app.engine("handlebars", hbs.engine({ extname: "handlebars", layoutsDir: __dirname + '/views/layouts' }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
	session({
	  secret: 'secret',
	  resave: true,
	  saveUninitialized: true
	})
);
app.use(flash());

const spazaSuggest = SpazaSuggest(db);
const routes = Routes(spazaSuggest);

//register
app.get('/', routes.showClientRegScreen);
app.post('/register', routes.registerTheClient);
// login client 
app.get('/login_client', routes.getClientLoginScreen);
app.post('/login_client', routes.logingTheClient);
// Product suggestion 
app.get('/suggestion', routes.getProductSuggestionScreen);
app.post('/suggestion', routes.clientToSuggestTheProduct);
//registering of Shop owner
app.get('/registerShopOwner', routes.showSpazaShopOwner);
app.post('/registerShopOwner', routes.registerSpzaOwner);
//login the shop owner
app.get('/loginShopOwner', routes.getShopOwnerLoginScreen);
app.post('/loginShopOwner', routes.logingTheShopOwner);
//suggesting for a particular area
app.get('/suggestionsForArea', routes.getAreaSuggestionsScreen);
app.post('/suggestionsForArea', routes.areaSuggestionsScreen);

const PORT = process.env.PORT || 7000
app.listen(PORT, function(){
    console.log('The app has started at this port number: ', PORT);
});