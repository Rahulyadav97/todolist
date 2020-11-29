import ToDoList from './todolist.js';
import ToDoItem from './todoitem.js';

const toDoList = new ToDoList();

//launch app

document.addEventListener("readystatechange",(event) =>{
    if(event.target.readyState === "complete"){
        initApp();
    }
});

const initApp = () =>{
    
    //add listener
const itemEntryForm = document.getElementById("itemEntryForm");
itemEntryForm.addEventListener("submit",(event) =>{
    event.preventDefault();
    processSubmission();
});

const clearItems = document.getElementById("clearItems");
clearItems.addEventListener("click",(event) =>{
    const list = toDoList.getList();
    if(list.length){
        const confirmed = confirm("are you sure you want to clear the entire list");
        if(confirmed) {
            toDoList.clearList();
            //TODO update persistence database
            updatePersistentData(toDoList.getList());
            refreshThePage();
        }
    }
})
    //procedural

    //load list object
    loadListObject();
    refreshThePage();
}

const loadListObject = () =>{
const storedList = localStorage.getItem("myTodoList");
if(typeof storedList !== "string") return;
const parsedList = JSON.parse(storedList);
parsedList.forEach(itemObj => {
    const newToDoItem = createNewItem(itemObj._id,itemObj._item);
    toDoList.addItemToList(newToDoItem);
});
}

const refreshThePage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntry();
}

const clearListDisplay = () => {
    const parentElement = document.getElementById("listItems");
    deleteContents(parentElement);
}

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
};

const renderList = () => {
    const list = toDoList.getList();
   // console.log(list);
    list.forEach((item)=>{
        buildListItem(item);
    });
};

const buildListItem = (item) => {
   // console.log(item);
    const div = document.createElement("div");
    div.className = "item";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = item.getId();
    check.tabIndex = 0;
    addclicklistenerToCheckbox(check);
    const label = document.createElement("label");
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById("listItems");
    container.appendChild(div);
}

const addclicklistenerToCheckbox = (checkbox) => {
    checkbox.addEventListener("click",(event) => {
        //alert(checkbox.id);
        toDoList.removeItemFromList(checkbox.id);
        updatePersistentData(toDoList.getList());
        setTimeout(() => {
            refreshThePage();
        },1000);
    });
}

const updatePersistentData = (listArray) => {
    //console.log(listArray);
 localStorage.setItem("myTodoList",JSON.stringify(listArray));
}

const clearItemEntryField = () =>{
    document.getElementById("newItem").value = " ";
};

const setFocusOnItemEntry = () =>{
    document.getElementById("newItem").focus();
}

const processSubmission = () => {
    const newEntryText = getNewEntry();
    if(!newEntryText.length) return;
    const newItemId = calcNextItemId();
    //alert(newItemId);
    const toDoItem = createNewItem(newItemId,newEntryText);
    
    toDoList.addItemToList(toDoItem);
    //TODO: update persisitent data
    updatePersistentData(toDoList.getList());
    refreshThePage();
}

const getNewEntry = () => {
   // alert(document.getElementById("newItem").value.trim());
    return document.getElementById("newItem").value.trim();

}

const calcNextItemId = () => {
    let nextItemId =1;
    const list = toDoList.getList();
    if(list.length > 0){
        nextItemId = list[list.length - 1].getId() +1;
    }

    return nextItemId;
}

const createNewItem = (itemId,itemText) =>{
   // alert(itemText);
const toDo = new ToDoItem();
toDo.setId(itemId);
toDo.setItem(itemText);
return toDo;
};