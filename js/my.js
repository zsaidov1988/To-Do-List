
//==============Variables=========================
let taskCollection = ["Uyg`onish", "Dars", "Bozor", "Uy vazifa", "Uxlash", "Ishlash"]; //Declare array of tasks with initial values
let isDeletedItem = false; // This variable indicates is there checked items for deleting
let isNotFoundTask = false;


//================Elements=====================

let elFormAdd = document.querySelector('.form-add'); // Form for adding new tasks
let elTaskName = elFormAdd.querySelector('.input-name-js'); // Input for new task name
let elCheck = elFormAdd.querySelector('.check-js');
let messageBox = elFormAdd.querySelector('.message-js'); // Element for caution when new task is already exists
let elTaskList = document.querySelector('.task-list'); // ul element for showing tasks list
let elDeleteBtn = document.querySelector('.delete-btn'); // Delete button
let elSortBtn = document.querySelector('.sort-btn'); // Sort button
let elFormSearch = document.querySelector('.form-search');
let elSearchInput = elFormSearch.querySelector('.input-search-js');
let elSearchOutput = elFormSearch.querySelector('.output-js');

//============Functions======================

// Function for delete button
const deleteItem = () => {
  let checkedItems = getCheckedItems(); // This function return array of checked checkboxes values 
  for (item of checkedItems) {
    taskCollection[item] = null;
  }
  isDeletedItem = true; // All checked items are deleted. There is no checked items
  refreshTaskList(taskCollection); // Refresh task list (ul tag) according to array of all tasks
}

// Function for sort button
const sortItem = () => {
  taskCollection.sort(); // Sort array of all tasks
  isDeletedItem = true;
  refreshTaskList(taskCollection); // Refresh task list (ul tag) according to array of all tasks
}

const search = () => {
  let searchTextOrig = elSearchInput.value.trim();
  let searchText = searchTextOrig.toLowerCase();
  let resultTextArr = [];
  for (task of taskCollection) {
    if (task.toLowerCase().includes(searchText)) {
      resultTextArr.push(task);
    }
  }
  let resultText = resultTextArr.join(', ')
  if (resultText === '') {
    elSearchOutput.textContent = `"${searchTextOrig}" nomli kitob topilmadi. Kitobni qo'shish bo'limiga o'tish uchun Enter tugmasini bosing`;
    isNotFoundTask = true;
  }
  else {
    elSearchOutput.textContent = resultTextArr.join(', ');
    isNotFoundTask = false;
  }
}

// The function indicates "Is this item checked?". If checked return true. Else return false.
// valArr - array of checked checkboxes values. Every value matches corresponding index of tasks
// index - current index of task which places to <li></li> tag
const isDel = (valArr, index) => {
  for (value of valArr) {
    if (value == index) {
      return true;
    }
  }
  return false;
}

// The function determines checked checkboxes and return array of checked checkboxes values
const getCheckedItems = () => {
  let values = []; // Define empty array
  if (isDeletedItem) {
    isDeletedItem = false;
    return values; // This case is done when delete button is clicked. Return empty array to make unchecked all checkboxes
  }
  let checkboxes = document.querySelectorAll(`input[name="tasks"]:checked`); // Array of checked checkboxes
  checkboxes.forEach((checkbox) => {
    values.push(checkbox.value);
  });
  return values; // Return array of checked checkboxes values
}


// Function for creating <li></li> elements and generate innerHTML for <li></li> elements according to taskCollection array
const refreshTaskList = (taskArr = taskCollection) => {
  let isThereCheckedItems = false; // This variable need for enable/disable delete button
  let values = getCheckedItems(); // Array consists of values of checked chexboxes
  elTaskList.innerHTML = ''; // clear <ul>tasks list</ul> innerHTML
  let count = 0; // The variable need to generate value of checkboxes. This values match to indexes of taskCollection array
  for (task of taskArr) {
    if (task === null) {
      count++;
      continue;
    }
    let listItem = document.createElement('li');
    if (isDel(values, count)) { // Is this task checked for deleting. Adds <del></del> tag to <label></label>: <label><del>task name</del></label>
      listItem.innerHTML = `<input class="form-check-input" type="checkbox" name="tasks" id="checktask${count}" value="${count}" onchange="refreshTaskList()" checked>
            <label class="form-check-label" for="checktask${count}"><del>${task}</del></label>`;
      isThereCheckedItems = true;
    }
    else { //This task is not checked foe deleting
      listItem.innerHTML = `<input class="form-check-input" type="checkbox" name="tasks" id="checktask${count}" value="${count}" onchange="refreshTaskList()">
            <label class="form-check-label" for="checktask${count}">${task}</label>`;
    }
    count++;
    elTaskList.append(listItem); // Add li tag to ul tag: <ul><li></li></ul>
    elDeleteBtn.disabled = isThereCheckedItems ? false : true; // Disable or enable delete button
  }
}


refreshTaskList(taskCollection); // Initial refresh ul tag


// Add a new task to taskCollection array and to ul tag
elFormAdd.addEventListener('submit', function (e) {
  e.preventDefault();
  let matchNameTask = true; // A name of new task doesn't match to names of existing tasks
  let newTaskName = elTaskName.value.trim(); // Variable for name of new task
  newTaskName = `${newTaskName[0].toUpperCase()}${newTaskName.split('').slice(1).join('')}`; // Capitalize new task name
  if (taskCollection.indexOf(newTaskName) > -1) {
    matchNameTask = false; // A name of new task match to one of existing tasks name
  }
  if (matchNameTask) { // If name of new task doesn't match to names of existing tasks
    if (elCheck.checked) {
      taskCollection.unshift(newTaskName);
    } else {
      taskCollection.push(newTaskName); // add new task to array taskCollection
    }
    refreshTaskList(taskCollection); // Update list of tasks (ul tag)
    elTaskName.value = ''; // Clear input for task name
    messageBox.textContent = "Kitob nomini lotin yozuvida kiriting";
  }
  else { // if name of new task match to one of existing tasks name
    messageBox.textContent = "Bunday kitob mavjud";
  }
  elTaskName.focus();
});

elFormSearch.addEventListener('submit', function (e) {
  e.preventDefault();
  if (isNotFoundTask) {
    elTaskName.value = elSearchInput.value.trim();
    elSearchInput.value = '';
    elTaskName.focus();
    elSearchOutput.textContent = 'Yuqoridagi maydonga so`z kiriting';
  }
});


