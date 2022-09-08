var input = document.getElementById("input");

function getAnimalImage() {
    if(input.value != "")
    {
        var uri = "/?animal=" + input.value
        window.location.replace(uri); 
    }
}

function onload() { 
    // get animal param from uri
    const queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var animal_param = urlParams.get("animal");

    animal_search = document.getElementById("animal_search").innerHTML = animal_param;


}

// adding event listener to click search button on "enter"
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("button").click();
  }
});