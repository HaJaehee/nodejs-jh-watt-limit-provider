/*
 *jh-watt-limit-provider.js 
 *Created by HJH on 2015-06-09 at 02:31
 */

var url = require('url');
// load url module

var http = require('http');
// http object create

var mysql = require('mysql');
// load mysql module
var qs = require('querystring');
// load querystring module

var dbconnection = mysql.createConnection ({
host: 'localhost',
port: 3306,
user: 'root',
password: 'root',
database: 'watt_limit'
});//database connection option define

dbconnection.connect(function(err)
        {
        if (err)
        {
        console.error('mysql connection error');
        console.error(err);
        throw err;
        }
        });//database connection function

var watthour = 0;
var currentwatt = 0;

function onRequest(request, response) {
    console.log('requested...');
    if(request.method=='POST') {
        var body='';
        request.on('data', function (data) {
                body +=data;
                });
        request.on('end',function(){
                var POST = qs.parse(body);
                //POST data
                //retrieval
                console.log(POST);
                selectQuery(response);
                });
    }//when request method is POST

    /*else if(request.method=='GET') {
        var url_parts = url.parse(request.url,true); //GET
        data retrieval
            console.log(url_parts.query);
        if
            (url_parts.query.set_watt_hour!=undefined&&url_parts.query.set_curr_watt!=undefined)
                insertQuery(url_parts.query.set_watt_hour,
                        url_parts.query.set_curr_watt);

        response.writeHead(200,{'Content-Type' : 'text/plain'});
        response.write('watt limit is registered');
        response.end();
    }//when request method is GET*/
};

function selectQuery (response){ 
    var query = dbconnection.query('select * from watthour_currentwatt',function(err,rows){
            if (err)
            {
            console.error('err:'+err);
            throw err;
            }
            else
            {
                if (rows.length!=0)
                {
                    watthour = rows[0].watthour;
                    currentwatt = rows[0].currentwatt;
                }

                response.writeHead(200,{'Content-Type':'text/plain'});
                
                var res_data = JSON.stringify({
                        'watthour':watthour,
                        'currentwatt':currentwatt
                    });
                response.write(res_data);
                response.end();
            }
            });
}//select 'watthour and currentwatt' record from 'watthour_currentwatt' table

function onConnection(socket){
    console.log('connected...');
};

var server = http.createServer();

server.addListener('request',onRequest);
server.addListener('connection',onConnection);
server.listen(9988);
