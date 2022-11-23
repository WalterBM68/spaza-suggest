
const ShortUniqueId = require ("short-unique-id");
const uid = new ShortUniqueId({ length: 5 });

module.exports = Routes = (spazaSuggestionDB) =>{
    let uniqueCode = '';
    let shopOwnerCode = '';
    //Home route(GET)
    const showClientRegScreen = async (req, res) => {
        res.render('index');
    }
    //Home route(POST)
    const registerTheClient = async (req, res) => {
        let {username} = req.body;
        if(username){
            username = username.toLowerCase(); 
            let client = username.charAt(0).toUpperCase() + username.slice(1); 
            let code = uid();
            uniqueCode = code;
            const theClient = await spazaSuggestionDB.checkClientName(client);
            if(Number(theClient.count) !== 0){
                req.flash('error', `${client} already exists`);
            }else{
                await spazaSuggestionDB.registerClient(client);
                req.flash('success', "You've registered! use this code to login: " + uniqueCode)
            }
        }else{
            req.flash('error', 'Please enter your Name to register');
        }
        res.redirect('/');
    }
    //login the client(Get route)
    const getClientLoginScreen = async (req, res) => {
        res.render('login_client');
    }
    //login the client(POST route)
    const logingTheClient = async (req, res) => {
        const {code} = req.body;
        if(code){
            const loginUniqueCode = await spazaSuggestionDB.clientLogin(code.trim());
           if(loginUniqueCode){
                req.session.loginUniqueCode = loginUniqueCode;
                res.redirect('/suggestion');
                return;
            }
        }else{
            req.flash('error', 'This code is invalid');
            res.render('login_client');
        }
    }
    //product screen (Get route)
    const getProductSuggestionScreen = async (req, res) => {
        if(!req.session.loginUniqueCode){
            res.redirect('/login_client');
            return;
        }
        const areas = await spazaSuggestionDB.areas();
        res.render('suggestion', {
            loginUniqueCode: req.session.loginUniqueCode,
            areas
        });
    }
    //product screen(POST)
    const clientToSuggestTheProduct = async (req, res) => {
        const clientID = req.session.loginUniqueCode.id;
        const product_suggestion = req.body.product_suggestion;
        const product_name = req.body.product_name;
        if(product_name === undefined){
            req.flash('error', "Please enter your suggested product for this place");
        }
        if(product_name){
            await spazaSuggestionDB.suggestProduct(product_suggestion, clientID, product_name);
            req.flash('success', "Thank you for your suggestion");  
        }
        await spazaSuggestionDB.suggestions(clientID);
        res.redirect('suggestion');
    }
    //Register shop owner(Get)
    const showSpazaShopOwner = async (req, res) => {
        const areas = await spazaSuggestionDB.areas();
        res.render('registerShopOwner', {
            areas
        });
    }
    //Register shop owner(POST)
    const registerSpzaOwner = async (req, res) => {
        let areaID = req.body.product_suggestion
        let {shop_owner_name} = req.body;
        if(shop_owner_name){
            shop_owner_name = shop_owner_name.toLowerCase(); 
            let shopOwner = shop_owner_name.charAt(0).toUpperCase() + shop_owner_name.slice(1); 
            let code = uid();
            shopOwnerCode = code;
            const theShop = await spazaSuggestionDB.checkSpazaName(shopOwner);
            if(Number(theShop.count) !== 0){
                req.flash('error', `${shopOwner} already exists`);
            }else{
                await spazaSuggestionDB.registerSpaza(shopOwner, areaID);
                req.flash('success', "You've registered! use this code to login: " + shopOwnerCode)
            }
        }else{
            req.flash('error', 'Please enter your Name to register');
        }
        res.redirect('/registerShopOwner');
    }
    //login the shop owner(Get route)
    const getShopOwnerLoginScreen = async (req, res) => {
        res.render('loginShopOwner');
    }
    //login the shop owner (POST route)
    const logingTheShopOwner = async (req, res) => {
        const {code} = req.body;
        if(code){
            const shopOwnerLoginCode = await spazaSuggestionDB.spazaLogin(code.trim());
           if(shopOwnerLoginCode){
                req.session.shopOwnerLoginCode = shopOwnerLoginCode;
                res.redirect('/suggestionsForArea'); 
                return;
            }
        }else{
            req.flash('error', 'This code is invalid');
            res.render('loginShopOwner');
        }
    }
    //area suggestion page (Get route)
    const getAreaSuggestionsScreen = async (req, res) => {
        
        const spazaSugestions = await spazaSuggestionDB.suggestionsForArea();
        res.render('suggestionsForArea', {
            // spazaSugestions
        });
    }
    //area suggestion page(POST route)
    const areaSuggestionsScreen = async (req, res) => {
        res.redirect('/suggestionsForArea');
    }
    return{
        showClientRegScreen,
        registerTheClient,
        getClientLoginScreen,
        logingTheClient,
        getProductSuggestionScreen,
        clientToSuggestTheProduct,
        showSpazaShopOwner,
        registerSpzaOwner,
        getShopOwnerLoginScreen,
        logingTheShopOwner,
        getAreaSuggestionsScreen,
        areaSuggestionsScreen,
    }
}