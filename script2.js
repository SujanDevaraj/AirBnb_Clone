const cardContainer = document.getElementById("cardContainer");
const limitErr = "You have exceeded the rate limit per minute for your plan, BASIC, by the API provider";
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'c5014a6b6emsh84288eb75db9f9fp1759f6jsn73c5e567590c',
        // 'X-RapidAPI-Key': '35529e50acmshe42c2bf03c7e96dp12989cjsn06b3989d95a2',
        'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com'
    }
};
const apiObject = JSON.parse(localStorage.getItem("searchObject"));
document.title = `Airbnb | ${apiObject.place} - Holiday Rentals & Places to Stay`


async function getAPIdata(place, checkIn, checkOut, guests) {
    const url = `https://airbnb13.p.rapidapi.com/search-location?location=${place}&checkin=${checkIn}&checkout=${checkOut}&adults=${guests}&children=0&infants=0&pets=0&page=1&currency=INR`;
    return fetch(url, options)
}


function createCard(thumbNail, hotelType, ratings, reviewsCount, hotelName, noBeds, noBedrooms, prize) {
    let card = document.createElement("div");
    card.classList.add("my-card");

    let cardImg = document.createElement("div");
    cardImg.classList.add("my-card-img");


    let imgTag = document.createElement("img");
    imgTag.src = thumbNail;

    cardImg.appendChild(imgTag);
    card.appendChild(cardImg)

    let cardTitle = document.createElement("div");
    cardTitle.classList.add("my-card-title");

    let headline = document.createElement("h5");
    headline.innerText = hotelType;

    cardTitle.appendChild(headline);

    let ratingsDisplay = document.createElement("div");
    ratingsDisplay.classList.add("ratings-display");
    ratingsDisplay.innerHTML = `<i class="fa-solid fa-star" style="color: #000000;"></i>
    <span>
        ${ratings}(${reviewsCount})
    </span>`

    cardTitle.appendChild(ratingsDisplay);
    card.appendChild(cardTitle);

    let hotelNameTag = document.createElement("h5");
    hotelNameTag.innerText = hotelName;
    card.appendChild(hotelNameTag);

    let beds = document.createElement("p");
    beds.innerText = noBeds + " Beds" + " - " + noBedrooms + " Bedrooms";
    card.appendChild(beds);

    // let dates = document.createElement("p");
    // dates.innerText = stayDates;
    // card.appendChild(dates);

    let priceDisplay = document.createElement("div");
    priceDisplay.classList.add("prize-display");
    priceDisplay.innerText = "₹" + prize
    card.appendChild(priceDisplay);

    cardContainer.appendChild(card);
}

function formatDate(checkIn, checkOut) {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const inday = startDate.getDate();
    const inmonthIdx = startDate.getMonth();
    const inmonth = monthNames[inmonthIdx];

    const outday = endDate.getDate();
    const outmonthIdx = endDate.getMonth();
    const outmonth = monthNames[outmonthIdx];

    if (inmonth === outmonth) {
        return `${inday}-${outday} ${outmonth}`;
    } else {
        return `${inday} ${inmonth} - ${outday} ${outmonth}`;
    }
}






// ******************** Google maps logic *******************//

async function initMap() {
    try {
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 10.5,
            center: { lat: 12.972442, lng: 77.580643 },
            streetViewControl: false,
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            mapTypeControl: false,
            rotateControl: false
        })
        // const response = await getAPIdata(apiObject.place, apiObject.checkIn, apiObject.checkOut, apiObject.guests)
        const data = await response.json();
        if (data.message !== limitErr) {
            console.log(data);
            for (let i = 0; i < data.results.length; i++) {
                createCard(data.results[i].images[0], data.results[i].type, data.results[i].rating, data.results[i].reviewsCount, data.results[i].name, data.results[i].beds, data.results[i].bedrooms, data.results[i].price.rate);
                setMarkers(map, data.results[i].lat, data.results[i].lng, JSON.stringify(data.results[i].name));
            }
        }
    } catch (err) {
        console.log(err);
    }

}


function setMarkers(map, lat, lng, title) {
    console.log(title);

    // Adds markers to the map.
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.
    // Origins, anchor positions and coordinates of the marker increase in the X
    // direction to the right and in the Y direction down.

    new google.maps.Marker({
        position: { lat: lat, lng: lng },
        // label: b,
        map,
        title: title,
    });
}

window.initMap = initMap;