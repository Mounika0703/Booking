const menuToggle=document.querySelector('.toggle');
const navigation=document.querySelector('.navigation');
function toggleMenu(){
    menuToggle.classList.toggle('active')
    navigation.classList.toggle('active')
}
var nav = document.querySelector('navbar'); // Identify target

window.addEventListener('scroll', function(event) { // To listen for event
    event.preventDefault();

    if (window.scrollY > 10) { // Just an example
        nav.classList.add('nav-scroll');
    } else {
        nav.classList.remove("nav-scroll");
     }
});

const selectedmessage=document.querySelector('.selected-message');
/*function generatealert(){
    selectedmessage.classList.add('active');
}*/
function removealert(){
    selectedmessage.classList.remove('active');
}

const searchFormIndex = document.querySelector('.home-form');
if (searchFormIndex) {
    searchFormIndex.addEventListener('submit', function(e) {
        e.preventDefault();
        // Redirect to rooms.html after form submission
        window.location.href = "rooms.html";
    });
}

// For cart.html
const searchFormCart = document.querySelector('.cart-form');
if (searchFormCart) {
    searchFormCart.addEventListener('submit', function(e) {
        e.preventDefault();
        // Redirect to rooms.html after form submission
        window.location.href = "rooms.html";
    });
}

const searchbtn = document.querySelectorAll('.search-form');
let searchdata = [];
for(let i=0; i<searchbtn.length; i++){
    searchbtn[i].addEventListener("click",function(e){
        localStorage.setItem('rooms',null);
        if(typeof(Storage) !== 'undefined'){
            let data = {
                chechindate:e.target.parentElement.children[0].value,
                checkoutdate:e.target.parentElement.children[1].value,
                adultsno:e.target.parentElement.children[2].children[0].value,
                childreno:e.target.parentElement.children[3].children[0].value
            };
            searchdata.push(data);
            localStorage.setItem("searchdata",JSON.stringify(searchdata));
            //window.location.reload();
            searchdata=[];
        }else{
            alert('local storage is not working on your browser');
        }
    });
}

const attToCartBtn = document.querySelectorAll('.rooms .room .det-section .det-inner .button button');
let rooms = [];
for(let i=0; i<attToCartBtn.length; i++){
    attToCartBtn[i].addEventListener("click",function(e){
        selectedmessage.classList.add('active');
        
        if(typeof(Storage) !== 'undefined'){
            let room = {
                    name:e.target.parentElement.parentElement.children[1].textContent,
                    price:e.target.parentElement.parentElement.children[0].children[0].textContent,
                    priceperiod:e.target.parentElement.parentElement.children[0].children[1].textContent,
                    no:1
                };
            if(JSON.parse(localStorage.getItem('rooms')) === null){
                rooms.push(room);
                localStorage.setItem("rooms",JSON.stringify(rooms));
                //window.location.reload();
                rooms=[];
            }else{
                const localItems = JSON.parse(localStorage.getItem("rooms"));
                localItems.map(data=>{
                    room.no = data.no +1;
                    rooms.push(data);
                });
                rooms.push(room);
                localStorage.setItem('rooms',JSON.stringify(rooms));
                //window.location.reload();
                rooms=[];
            }
        }else{
            alert('local storage is not working on your browser');
        }
    });
}

//adding data to cart
var cartdates = document.querySelector('.dates');
var cartItems = document.querySelector('.cart-items');
var bookNow = document.querySelector('.book-now');
var cartRowContents='';
var cartdatescontent='';
var currentdate=new Date();
var total=0;
if(JSON.parse(localStorage.getItem('searchdata')) === null){
    cartdatescontent += `
        <p>Your dates from ${currentdate.getFullYear()}-${currentdate.getMonth()}-${currentdate.getDate()} to ${currentdate.getFullYear()}-${currentdate.getMonth()}-${currentdate.getDate()}</p>
        <p>2 Adults , 2 Children</p>`
}else{
    JSON.parse(localStorage.getItem('searchdata')).map(data=>{
        cartdatescontent += `
        <p>Your dates <br> From ${data.chechindate} <br> To ${data.checkoutdate}</p>
        <p>${data.adultsno} Adults , ${data.childreno} Children</p>`
    });
}

if(JSON.parse(localStorage.getItem('rooms')) === null || localStorage.rooms.length === 2){
    cartRowContents += `
        <div class="cart-item empty">
            <p>Cart is empty</p>
            <div class="cart-empty-button"><a href="rooms.html"><button>Rooms</button></a></div>
        </div>`
}else{
    JSON.parse(localStorage.getItem('rooms')).map(data=>{
        total=total+parseInt(data.price);
        cartRowContents += `
            <div class="cart-item">
                <div class="cart-item-number">${data.no}</div>
                <div class="cart-item-title">${data.name}</div>
                <div class="cart-item-price">$${data.price} ${data.priceperiod}</div>
                <div class="cart-item-button"><button type="button" onclick=Delete(${data.no})>REMOVE</button></div>
            </div>`
    });
}
cartdates.innerHTML += cartdatescontent;
cartItems.innerHTML += cartRowContents;
bookNow.children[0].children[1].innerHTML=total;

function Delete(number){
	let rooms = [];
    let num=1;
	JSON.parse(localStorage.getItem('rooms')).map(data=>{
		if(data.no != number){
            data.no = num;
			rooms.push(data);
            num+=1;
		}
	});
	localStorage.setItem('rooms',JSON.stringify(rooms));
	window.location.reload();
};

// Function to calculate the number of nights between two dates
function calculateNumberOfNights(checkInDate, checkOutDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const numberOfNights = Math.round(Math.abs((startDate - endDate) / oneDay));
    return numberOfNights;
}

// Function to update the total price in the cart based on the number of nights
function updateTotalPrice() {
    const cartItems = JSON.parse(localStorage.getItem('rooms'));
    const searchDates = JSON.parse(localStorage.getItem('searchdata'));

    if (cartItems && searchDates) {
        let total = 0;

        // Calculate total price based on the number of nights for each room
        cartItems.forEach(item => {
            const numberOfNights = calculateNumberOfNights(searchDates[0].chechindate, searchDates[0].checkoutdate);
            total += parseInt(item.price) * numberOfNights;
        });

        // Update the total price display in the cart
        const totalPriceElement = document.querySelector('.book-now h1 span:last-child');
        if (totalPriceElement) {
            totalPriceElement.textContent = total.toFixed(2);
        }
        
    }
}

// Call the updateTotalPrice function to calculate and update the total price initially
updateTotalPrice();


