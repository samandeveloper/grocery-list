// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert")
const grocery = document.getElementById("grocery")  
const submitBtn = document.querySelector(".submit-btn")
const clearBtn = document.querySelector(".clear-btn")
const form = document.querySelector(".grocery-form")
const container = document.querySelector(".grocery-container")
const list = document.querySelector(".grocery-list")
// edit option
let editElement;
let editFlag = false;      //are we edditing or not
let editID = "";         //in order to get specific item in the list--empty string

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener("submit", addItem)  //form not submitBtn
//clear list
clearBtn.addEventListener("click", clearItems)
//display items onload--add items to the memory so every time we open/refresh the browser we see the previously added items in the list
window.addEventListener("DOMContentLoaded", setupItems)

// ****** FUNCTIONS *********
//add function
function addItem(e){
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();    //convert the time to string
  
  //three senarios can happen
  //senario #1: add an item
  if(value !== "" && !editFlag){
    const element = document.createElement("article");    //create new articles
    let attr = document.createAttribute("data-id");       //create new attributes
    attr.value = id;                             //add a value to each created attribute
    element.setAttributeNode(attr);             //add attribute node (data-id) to each article
    element.classList.add("grocery-item")   //add class to each article
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <!-- edit btn -->
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <!-- delete btn -->
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
    //add eventListener to both buttons
    const deleteBtn = element.querySelector(".delete-btn")
    deleteBtn.addEventListener("click", deleteItem)
    const editBtn = element.querySelector(".edit-btn")
    editBtn.addEventListener("click", editItem)

    //append child
    list.appendChild(element)
    //display alert
    displayAlert("item added to the list", "success")
    //show container--up to now we can not see the list because it's hidden
    container.classList.add("show-container")
    //set local storage
    addToLocalStorage(id,value)
    //set back to default
    setBackToDefault();
  }

  //senario #2: edit an item
  else if(value !== "" && editFlag){
    editElement.innerHTML = value;
    displayAlert("value changed", "success")
    //edit local storage
    editLocalStorage(editID,value)
    setBackToDefault()
  }

  //senario #3: no value added to the input
  else{
    displayAlert("please enter value", "danger")
  }
}

//display alert
function displayAlert(text, action){
  alert.textContent = text;
  alert.classList.add(`alert-${action}`)
  //remove alert
  setTimeout(function(){
    alert.textContent = ""
    alert.classList.remove(`alert-${action}`)
  },1000)
}

//clear all items
function clearItems(){
  const items = document.querySelectorAll(".grocery-item")   //grocery-item are class of articles
  if(items.length > 0){   //if any item exists in the list
    items.forEach(function(item){
      list.removeChild(item)   //remove all the items from the list
    })
  }
  container.classList.remove("show-container")
  displayAlert("empty list", "danger")
  setBackToDefault();
  localStorage.removeItem("list")
}

//Delete item
function deleteItem(e){
  //element and id will be different from the previous ones
  //up to element = e.currentRarget the element is the delete-btn-- up to element = e.currentRarget.parentElement the element is the div tag
  const element = e.currentTarget.parentElement.parentElement
  console.log(element)    //answer: the article tag with the whole <p> and <button> s inside
  const id = element.dataset.id

  list.removeChild(element)
  if(list.children.length === 0){
    container.classList.remove("show-container")
  }
  displayAlert("item removed","danger")
  setBackToDefault();
  //remove the item from local storage--just id
  removeFromLocalStorage(id)
}

//edit items
function editItem(e){
  //element and id will be different from the previous ones
  const element = e.currentTarget.parentElement.parentElement;
  console.log(element)   //the answer: article tag with the whole <p> and <button> s inside
  editElement = e.currentTarget.parentElement.previousElementSibling;
  console.log(editElement)  //the answer: the answer is p tag
  //set form value
  grocery.value = editElement.innerHTML
  editFlag = true;
  // the line below cause the edited text go to it's place not the new place
  editID = element.dataset.id
}

//set back to defaults
function setBackToDefault(){
  grocery.value = ""
  editFlag = false
  editID = ""
  submitBtn.textContent = "Submit"
}

// ****** LOCAL STORAGE **********

function addToLocalStorage(id, value){
  //we have to add the id and value as an object not array-- in ES6 we can remove the second id and value 
  const grocery = {
    id:id,
    value:value
  }
  let items = getLocalStorage();
  items.push(grocery)
  localStorage.setItem("list", JSON.stringify(items))
}

function getLocalStorage(){
  return localStorage.getItem("list")? JSON.parse(localStorage.getItem("list")):[] 
}

function removeFromLocalStorage(id){
  let items = getLocalStorage();
  items = items.filter(function(item){
    console.log(item.id)
    console.log(id)
    if(item.id === id){
      return item
    }
  })
  localStorage.setItem("list", JSON.stringify(items))
}


function editLocalStorage(id,value){
  let items = getLocalStorage()

  items = items.map(function(item){
    if(item.id === id){
      item.value = value
    }
    return item
  })
  localStorage.setItem("list", JSON.stringify(items))
}