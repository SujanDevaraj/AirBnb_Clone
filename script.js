const nav_options = document.getElementsByClassName("underline");
const getaway_options = document.querySelectorAll(".getaway-options>div");
const destination = document.getElementById("location");
const checkIn = document.getElementById("check-in");
const checkOut = document.getElementById("check-out");
const guests = document.getElementById("guests");


function highlightOption(idx){
    getaway_options[idx].style.textDecoration="underline";
   
    
}
function unhighlightOption(idx){
    getaway_options[idx].style.textDecoration="none";
    
}


function showUnderline(idx){
    nav_options[idx].style.width="25px"

}
function removeUnderline(idx){
    nav_options[idx].style.width="0px"

}


// validating input values
function valid(){
    const val1 = destination.value ;
    const val2 = checkIn.value;
    const val3 = checkOut.value;
    const val4 = guests.value;
    
   
    if(val1=="" || val2=="" || val3=="" || val4==""){
        alert("kindly fill all details!");
        return false;
    }
    const checkInDate = new Date(val2);
    const checkOutDate = new Date(val3);
    const today = new Date();

    if(checkInDate>=checkOutDate || checkInDate<today){
        alert("kindly fill dates properly!");
        return false; 
    }
    return true;
}

// function to navigate to page-2
function gotoNextPage(){
   if(!valid())return;
   localStorage.removeItem("idx");
   localStorage.setItem("destination",destination.value);
   localStorage.setItem("checkIn",checkIn.value);
   localStorage.setItem("checkOut",checkOut.value);
   localStorage.setItem("guests",guests.value);
    window.location.href="./properties.html";

}
