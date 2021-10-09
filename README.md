# FAKE API ON JSON SERVER
[Json Server Documentation](https://github.com/typicode/json-server#getting-started)

## Installation
1. Install json server
```
$ npm i json-server
```
2. Create a db.json file in root directory
3. Create a package.json by running the following command. (Note: ***entry point: main.js***)
```
$ npm init
```
4. Create .gitignore to ignore unnessary files ([.gitignore content](https://www.toptal.com/developers/gitignore/api/node))
5. Install nodemon
```
$ npm i --save-dev nodemon
```
## Configuration
1. Edit package.json. Add the bold contents.
<pre>
"scripts": {
	"test": "echo \"Error: no test specified\" && exit 1",
	<b>"dev": "nodemon main.js",</b>
	<b>"start": "node main.js"</b>	
}
</pre>
2. Create main.js

``` 
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})
// Use default router
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})
``` 
3. Run server with dev
```
$ npm run dev
```
4. Install REST Client extension. <img src="https://humao.gallerycdn.vsassets.io/extensions/humao/rest-client/0.24.5/1617725796156/Microsoft.VisualStudio.Services.Icons.Default" width="32" height="32"/>
5. Create api-collection/categories.http file
<pre>
@baseUrl = http://localhost:3000/api

# Categories

# @name getAllCategories
GET {{baseUrl}}/categories

###

# @name addNewCategory
POST  {{baseUrl}}/categories
Content-Type: application/json

{
    "name" : "Laptop"
}

###

# @name updateACategory
PATCH {{baseUrl}}/categories/2
Content-Type: application/json

{
    "name" : "New Laptop"
}

###

# @name deleteACategory
DELETE {{baseUrl}}/categories/2
</pre>
6. Create api-collection/products.http file
<pre>
@baseUrl = http://localhost:3000/api
@resourceName=products

# Products

# @name getAll
GET {{baseUrl}}/{{resourceName}}

###

# @name filterProducts
GET {{baseUrl}}/{{resourceName}}?color=maroon&price_gte=200
###
GET {{baseUrl}}/{{resourceName}}?price_gte=900
###
GET {{baseUrl}}/{{resourceName}}?name_like=Tasty
###
# @name pagination
GET {{baseUrl}}/{{resourceName}}?_page=1&_limit=5
###
# @name sort
GET {{baseUrl}}/{{resourceName}}?_sort=price&_order=asc

###

# @name addNew
POST  {{baseUrl}}/{{resourceName}}
Content-Type: application/json

{
    "name" : "Laptop"
}

###

# @name update
PATCH {{baseUrl}}/{{resourceName}}/85a1ef8b-99b4-4d17-8b2b-e748416c3847
Content-Type: application/json

{    
    "name": "Incredible Seafood Salad",    
    "color": "mangoo",
    "price": 960    
}

###

# @name delete
DELETE {{baseUrl}}/{{resourceName}}/2
</pre>
7. Fix router in main.js
<pre>
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

// Use default router
<b>server.use('/api',router)</b>
server.listen(3000, () => {
  console.log('JSON Server is running')
})
</pre>
## Install Faker
1. Install faker 
<pre>
Install faker in dev environment
$ npm i --save-dev faker
</pre>
2. Edit package.json
<pre>
"scripts": {
	"test": "echo \"Error: no test specified\" && exit 1",
	"dev": "nodemon main.js",
	"start": "node main.js",
	<b>"generate-data": "node generate-data.js"</b>
}
</pre>
3. Create generate-data.js in root directory, and add the following code
<pre>
const faker = require('faker');
//Random data
console.log(faker.commerce.department());
console.log(faker.commerce.productName());
console.log(faker.commerce.productDescription());

console.log(faker.datatype.uuid());
console.log(faker.image.imageUrl());
console.log(faker.name.findName());
</pre>
4. Run generate data
```
$ npm run generate-data
```
5. Edit package.json
<pre>
"scripts": {
	"test": "echo \"Error: no test specified\" && exit 1",
	"dev": "nodemon main.js",
	<b>"start": "npm run generate-data && node main.js",</b>
	"generate-data": "node generate-data.js"
}
</pre>
6. Add the following block code in the end of generate-data.js file
<pre>
const fs = require('fs');

//function generate categories
const randomCategoryList = (n) => {
    if(n <= 0) return [];

    const categoryList = [];

    //loop and push category
    Array.from(new Array(n)).forEach(() => {
        const category = {
            id : faker.datatype.uuid(),
            name : faker.commerce.department(),
            createdAt : Date.now(),
            updatedAt : Date.now()
        }
        categoryList.push(category)
    });
    return categoryList;
}

//function generate products
const randomProductList = (categoryList, numberOfProducts) => {
    if(numberOfProducts <= 0) return [];

    const productList = [];

    categoryList.forEach((category) => {
        //loop and push category
        Array.from(new Array(numberOfProducts)).forEach(() => {
            const product = {
                id : faker.datatype.uuid(),
                name : faker.commerce.productName(),
                categoryId : category.id,
                color:faker.commerce.color(),
                price:Number.parseFloat(faker.commerce.price()),
                description:faker.commerce.productDescription(),
                thumnailUrl: faker.image.imageUrl(400, 400),
                createdAt : Date.now(),
                updatedAt : Date.now()
            }
            productList.push(product)
        });
    }) 
    
    return productList;
}

//IFFE
(() => {
	//generate 7 categories
	var categoryList = randomCategoryList(7);
	//Each category has 6 products
	const productList = randomProductList(categoryList, 6);
	
	//prepare db object
	const db = {
		categories : categoryList,
		products : productList,
		profile : {
		    name : "Po"
		}
    	};
	//write db object to db.json file
    	fs.writeFile('db.json', JSON.stringify(db), () => {
		console.log("Generate data successfully!!!");
    	});
})()
</pre>
7. Generate data
<pre>
$ npm run generate-data
</pre>
8. Install query string package
<pre>
$ npm i query-string
</pre>
9. Show pagination data. Add the bold cde in the main.js file
<pre>
<b>const queryString = require('query-string');</b>
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    if (req.method === 'POST') {
        req.body.createdAt = Date.now();        
    } 
    // Continue to JSON Server router
    next();
});
<b>
router.render = (req, res) => {
  //Check GET the pagination
  const headers = res.getHeaders();
  const totalCountHeader =  headers['x-total-count'];
  if(req.method === 'GET' && totalCountHeader) {
    const queryParams = queryString.parse(req._parsedUrl.query);    
    const result = {
      data : res.locals.data,
      pagination:{
        _page : Number.parseInt(queryParams._page) || 1,
        _limit : Number.parseInt(queryParams._limit) || 5,
        _totalRows : Number.parseInt(totalCountHeader)
      }
    }
    return res.jsonp(result);
  }

  res.jsonp(res.locals.data);
}
</b>

// Use default router
server.use('/api', router);
server.listen(PORT, () => {
    console.log('JSON Server is running');
});
</pre>
10. Run in dev environment
<pre>
$ npm run dev
</pre>

## Deploy json-server on heroku
1. push source code to github
2. Link github to heroku
3. Reinstall faker package
<pre>
$ npm uninstall faker
$ npm install faker
</pre>
4. Change the port in main.js file
<pre>
const queryString = require('query-string')
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  // Continue to JSON Server router
  next()
})

router.render = (req, res) => {
    //Check GET the pagination
    const headers = res.getHeaders();
    const totalCountHeader =  headers['x-total-count'];
    if(req.method === 'GET' && totalCountHeader) {
      const queryParams = queryString.parse(req._parsedUrl.query);    
      const result = {
        data : res.locals.data,
        pagination:{
          _page : Number.parseInt(queryParams._page) || 1,
          _limit : Number.parseInt(queryParams._limit) || 5,
          _totalRows : Number.parseInt(totalCountHeader)
        }
      }
      return res.jsonp(result);
    }
  
    res.jsonp(res.locals.data);
  }

// Use default router
<b>const PORT = process.env.PORT || 3000</b>
server.use('/api', router);
<b>server.listen(PORT, () => {
    console.log('JSON Server is running');
});</b>
</pre>
## Test
- https://deploy-json-server.herokuapp.com/api/categories
- https://deploy-json-server.herokuapp.com/api/products
- https://deploy-json-server.herokuapp.com/api/products?price_gte=900
- https://deploy-json-server.herokuapp.com/api/products?name_like=Tasty
- https://deploy-json-server.herokuapp.com/api/products?_page=1&_limit=5
- https://deploy-json-server.herokuapp.com/api/products?_sort=price&_order=asc
- https://deploy-json-server.herokuapp.com/api/products/product_id_you_want_to_update
