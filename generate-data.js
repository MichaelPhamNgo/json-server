const faker = require('faker');
//Random data
// console.log(faker.commerce.department());
// console.log(faker.commerce.productName());
// console.log(faker.commerce.productDescription());

// console.log(faker.datatype.uuid());
// console.log(faker.image.imageUrl());
// console.log(faker.name.findName());

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