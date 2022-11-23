const ShortUniqueId = require ("short-unique-id");

module.exports = function SpazaSuggest (db){

    const uid = new ShortUniqueId({ length: 5 });

    //// returns client code
    async function registerClient(username){
        try {
            // get the code
            
            const uniqCode = uid();
            await db.none(`insert into spaza_client (username, code) values ($1, $2)`, [username, uniqCode])
            return uniqCode;
        } catch (error) {
           console.log(error); 
        }
    }

    //Check if the client's name is already in the table or not
    const checkClientName = async (username) => {
        try {
            const client = await db.oneOrNone('select count(*) from spaza_client where username = $1;', [username]);
            return client;  
        } catch (error) {
            console.log(error);
        }
    }

    // returns the user if it's a valid code
    async function clientLogin(code)  {
        try {
            const client = await db.oneOrNone(`select * from spaza_client where code = $1`, [code]);
            return client;  
        } catch (error) {
           console.log(error); 
        }
    }

    // return all areas
    async function areas() {
        try {
            const areas = await db.manyOrNone(`select * from area order by area_name asc`);
            return areas;  
        } catch (error) {
            console.log(error)
        }
    }

    async function findAreaByName(name) {
        try {
            const area = await db.oneOrNone(`select * from area where area_name = $1`, [name])
            return area;   
        } catch (error) {
            console.log(error)
        }
    }

    async function suggestProduct(areaId, clientId, suggestion) {
        try {
            await db.none(`insert into suggestion(area_id, client_id, product_name) values ($1, $2, $3)`, 
                [areaId, clientId, suggestion])      
        } catch (error) {
            console.log(error)
        }
    }

    async function suggestionsForArea(areaId) {
        try {
            return await db.manyOrNone(`select * from suggestion where area_id = $1`, [areaId]); 
        } catch (error) {
            console.log(error)
        }
    }

    // show all the suggestions made by a user
    // TODO - review this... do we want this for a region...?
    async function suggestions(clientId) {
        try {
            return await db.manyOrNone(`select * from suggestion join area on suggestion.area_id = area.id where client_id = $1`, [clientId]);   
        } catch (error) {
            console.log(error)
        }
    }

    // upvote a given suggesstion
    function likeSuggestion(suggestionId, userId) {
        try {
            `insert into liked_suggestion (suggestion_id, user_id) values ($1, $2)`; 
        } catch (error) {
            console.log(error)
        }
    }

    // create the spaza shop and return a code
    async function registerSpaza(name, areaId) {
        try {
            const uniqCode = uid();
            await db.none(`insert into spaza (shop_name, area_id, code) values ($1, $2, $3)`, 
                [name, areaId, uniqCode]);
            return uniqCode;     
        } catch (error) {
            console.log(error)
        }
    }

    //Check if the spaza name is already in the table or not
    const checkSpazaName = async (name) => {
        try {
            const shop = await db.oneOrNone('select count(*) from spaza where shop_name = $1;', [name]);
            return shop;  
        } catch (error) {
            console.log(error);
        }
    }
    
    // return the spaza name & id  and areaId for the spaza shop
    async function spazaLogin(code) {
        try {
            const spaza = await db.oneOrNone(`select * from spaza where code = $1`, [code]);
            return spaza;           
        } catch (error) {
            console.log(error)
        }
    }
    
    // show all the suggestions for a given area
    // function suggestionsForArea(areaId) {
    //     ``
    // }
    
    async function alreadyAcceptedSuggestionForSpaza(suggestionId, spazaId) {
        try {
            const count = await db.one(`select count(*) from accepted_suggestion where suggestion_id = $1 and spaza_id = $2`,
                [suggestionId, spazaId], row => row.count);
            return count == 1;      
        } catch (error) {
            console.log(error)
        }
    }

    async function acceptSuggestion(suggestionId, spazaId) {
        try {
            if (!await alreadyAcceptedSuggestionForSpaza(suggestionId, spazaId)){
                await db.none(`insert into accepted_suggestion(suggestion_id, spaza_id) values ($1, $2)`, [suggestionId, spazaId])
            }          
        } catch (error) {
            console.log(error)
        }
    }

    // return all the accepted suggestions for the spazaId provided
    async function acceptedSuggestions(spazaId) {
        try {
            const suggesstions = await db.manyOrNone(`
                select * from suggestion join accepted_suggestion 
                on suggestion.id = accepted_suggestion.suggestion_id 
                where accepted_suggestion.spaza_id = $1`, [spazaId])
            
            return suggesstions;  
        } catch (error) {
            console.log(error)
        }
    }

    return {
        acceptSuggestion,
        checkClientName,
        acceptedSuggestions,
        areas,
        findAreaByName,
        registerSpaza,
        registerClient,
        spazaLogin,
        suggestProduct,
        checkSpazaName,
        suggestions,
        suggestionsForArea,
        likeSuggestion,
        clientLogin
    }
}
