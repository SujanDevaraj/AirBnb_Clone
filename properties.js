const baseUrl = "https://airbnb13.p.rapidapi.com/search-location?";
const properties = document.getElementsByClassName("all-properties")[0];
const modal_img = document.querySelector(".model>div:first-child");
const cost_details = document.querySelector(".cost-details");
const modal = document.querySelector(".model");
let checkIn;
let checkOut;
let guests;
let destination;
let map;

if (localStorage.getItem("idx") == null) localStorage.setItem("idx", 0);

function initMap(item) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: item.lat, lng: item.lng },
    zoom: 8,
  });
}
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "690a3eb870msh85f86831b94059ep1e3788jsn81e524b94fa9",
    "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
  },
};

window.onload = assignValues;

function assignValues() {
  checkIn = localStorage.getItem("checkIn");
  checkOut = localStorage.getItem("checkOut");
  guests = localStorage.getItem("guests");
  destination = localStorage.getItem("destination");
  showTitle();
  fetchResults();
}
function showTitle() {
  document.getElementById("destination").innerHTML = destination;
  document.getElementById("totalGuests").innerHTML = `${guests} Guests`;
  let checkInDate = new Date(checkIn);
  let checkOutDate = new Date(checkOut);
  document.getElementById("dates").innerHTML = `${getMonth(
    checkInDate.getMonth()
  )} ${checkInDate.getDate()} - ${getMonth(
    checkOutDate.getMonth()
  )} ${checkOutDate.getDate()}`;
}

async function fetchResults() {
  const endpoint = `${baseUrl}location=${destination}&checkin=${checkIn}&checkout=${checkOut}&adults=${guests}&currency=USD&pages=1;`;
  try {
    const response = await fetch(endpoint, options);
    const result = await response.json();
    renderDetails(result.results);
  } catch (error) {
    console.error(error);
  }
}

function renderDetails(arr) {
  let element1 = document.createElement("div");
  element1.classList.add("container");
  element1.classList.add("text-muted");
  element1.innerHTML = `200+ stays in ${destination}`;
  properties.appendChild(element1);

  let str = localStorage.getItem("idx");
  let num = Number(str);
  if (num < arr.length) initMap(arr[num]);
  for (let i = num; i < Math.min(num + 10, arr.length); i++) {
    const curr = arr[i];
    const curr_property = document.createElement("div");
    let btnId = `cost${i}`;
    const dirId = `dir${i}`;
    curr_property.classList.add(
      "property-card",
      "d-flex",
      "justify-content-between",
      "container",
      "my-3",
      "py-4"
    );
    curr_property.innerHTML = ` <div class="property-img"><img src=${curr.images[0]} alt=""></div>
      <div class="d-flex justify-content-between flex-column">
          <div class="d-flex justify-content-between">
              <div><span class="text-muted" style="font-size: 13px;">${curr.type}</span><br><span class="fw-bold fs-6">${curr.name}</span></div>
             
              <div><img class="heart" onclick="changeHeart(this)" src="./assets/heart.svg" alt=""></div>
          </div>
          <div id="${i}" class="text-muted" class="amenties">
             
          </div>
          <div class="d-flex justify-content-between">
              <div style="font-size: 14px;">${curr.rating}<img src="./assets/star.svg" alt="">(${curr.reviewsCount}reviews)</div>
              <div ><span class="fw-bold">$${curr.price.rate}USD </span><span>/night</span><button id=${btnId} class="button-33" role="button">cost breakdown</button></div>
          </div>

      </div>`;

    new google.maps.Marker({
      position: { lat: curr.lat, lng: curr.lng },
      map: map,
      title: `$${curr.price.rate.toString()}USD`,
      icon: "./assets/marker.png",
      animation: google.maps.Animation.DROP,
    });

    properties.appendChild(curr_property);
    loadAmenties(i, curr, dirId);
    const costBreakdownButton = document.getElementById(btnId);
    const directionsButton = document.getElementById(dirId);
    directionsButton.addEventListener("click", () => {
      const url = `https://www.google.com/maps/dir//${curr.lat},${curr.lng}`;
      window.open(url, "_blank");
    });
    if (costBreakdownButton !== null)
      costBreakdownButton.addEventListener("click", () => {
        cost_details.innerHTML = "";
        modal.style.minHeight = "400px";
        modal_img.style.backgroundImage = `url("./assets/modal_img.jpg")`;
        const modal_Header = document.createElement("div");
        modal_Header.innerHTML = "Cost Breakdown";
        modal_Header.classList.add(
          "text-center",
          "py-2",
          "text-center",
          "cost-header"
        );
        cost_details.appendChild(modal_Header);

        const priceItems = curr.price.priceItems;

        priceItems.forEach((item) => {
          const newDiv = document.createElement("div");
          newDiv.classList.add("cost-element");
          newDiv.innerHTML = `${item.title}:${item.amount}`;
          cost_details.appendChild(newDiv);
        });
        const totalRate = document.createElement("div");
        totalRate.classList.add("cost-element");
        totalRate.innerHTML = `sub-total:${curr.price.total}`;
        cost_details.appendChild(totalRate);
        const closeButton = document.createElement("button");
        closeButton.classList.add("button-62");
        closeButton.innerHTML = "close";
        cost_details.appendChild(closeButton);
        closeButton.addEventListener("click", () => {
          cost_details.innerHTML = "";
          modal.style.minHeight = "0px";
        });
      });
  }

  pagenation(arr);
}

function loadAmenties(idx, arr, dirId) {
  const element = document.getElementById(idx);

  const pElement = document.createElement("p");
  pElement.classList.add("m-0");
  arr.previewAmenities.forEach((element) => {
    pElement.innerHTML += element + " • ";
  });
  if (pElement.innerHTML != "")
    pElement.innerHTML = pElement.innerHTML.substring(
      0,
      pElement.innerHTML.length - 3
    );
  element.appendChild(pElement);
  const buttonEle = document.createElement("button");
  buttonEle.id = dirId;
  buttonEle.classList.add("button-11");
  buttonEle.innerHTML = "directions ➪";
  element.appendChild(buttonEle);
}
function pagenation(arr) {
  let str = localStorage.getItem("idx");
  let num = Number(str);
  const buttons = document.createElement("div");
  if (num > 0) {
    const buttonEle = document.createElement("button");
    buttonEle.innerHTML = "prev";
    buttonEle.classList.add("button-29");
    buttons.appendChild(buttonEle);
    buttonEle.addEventListener("click", () => {
      localStorage.setItem("idx", num - 10);
      location.reload();
    });
  }
  if (num + 10 < arr.length) {
    const buttonEle = document.createElement("button");
    buttonEle.innerHTML = "next";
    buttonEle.classList.add("button-29");
    buttons.appendChild(buttonEle);
    buttonEle.addEventListener("click", () => {
      localStorage.setItem("idx", num + 10);
      location.reload();
    });
  }
  properties.appendChild(buttons);
}

function changeHeart(element) {
  if (element.src === "http://127.0.0.1:5500/assets/heart.svg")
    element.src = "http://127.0.0.1:5500/assets/likeheart.svg";
  else element.src = "http://127.0.0.1:5500/assets/heart.svg";
}

function getMonth(monthNum) {
  switch (monthNum) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "July";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    default:
      return "Dec";
  }
}
function showModal(item) {
  console.log(item);
}
