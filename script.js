const formInput = document.querySelector("#txtTaskName");
const ulList = document.querySelector("#task-list");

const btnAdd = document.querySelector("#btnAddNewTask");
const btnDeleteAll = document.querySelector("#btnDeleteAll");
const btnDeleteSelected = document.querySelector("#btnDeleteSelected");
let items = [];

loadItems();

function loadItems() {
  items = getItemFromLS();
  items.forEach((text) => {
    createItem(text);
  });
}

function getItemFromLS() {
  if (!JSON.parse(localStorage.getItem("items"))) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem("items"));
  }
  return items;
}

function setItemToLS(text) {
  items.push(text);
  localStorage.setItem("items", JSON.stringify(items));
}

function createItem(text) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(text));
  li.className =
    "list-group-item list-group-item-secondary d-flex justify-content-between align-items-center";

  // Creating element a of li
  const a = document.createElement("a");
  a.setAttribute("href", "#");
  a.innerHTML = `<i class="fas fa-times float-end"></i>`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.style.margin = "0 5px 0 20px";
  li.appendChild(checkbox);

  // Prevent propagation of click event to the parent element
  checkbox.addEventListener("click", (e) => e.stopPropagation());

  const label = document.createElement("label");
  label.textContent = "Delete";
  label.setAttribute("for", "checked");
  li.appendChild(label);

  const div = document.createElement("div");
  div.className = "d-flex justify-content-between align-items-center";
  div.style.width = "8%";
  div.appendChild(a);
  div.appendChild(checkbox);
  div.appendChild(label);

  li.appendChild(div);

  ulList.appendChild(li);
}

function deleteItemFromLS(text) {
  items = getItemFromLS();
  items.forEach((element, index) => {
    if (text === element) items.splice(index, 1);
  });
  localStorage.setItem("items", JSON.stringify(items));
}

const addElement = function (e) {
  e.preventDefault();

  if (formInput.value.trim()) {
    // Creation of li
    const inputText = formInput.value.trim();

    // Creation of element on DOM
    createItem(inputText);

    // Storing element on LS
    setItemToLS(inputText);

    formInput.value = "";
  } else {
    alert("Should be filled!");
  }
};

const removeElement = function (e) {
  e.preventDefault();

  if (e.target.classList.contains("fa-times")) {
    if (confirm("Are you sure?")) {
      e.target.parentElement.parentElement.parentElement.remove();

      //li'n textini goturende label icinde olan text'i de goturur. onu seperate edirik.
      const inputText =
        e.target.parentElement.parentElement.parentElement.textContent;
      const labelText =
        e.target.parentElement.parentElement.parentElement.querySelector(
          "label"
        ).textContent;
      const inputTextWithoutLabel = inputText.replace(labelText, "");

      deleteItemFromLS(inputTextWithoutLabel);
    }
  }
};

const removeAllElements = function () {
  if (confirm("Are you sure?")) {
    ulList.innerHTML = "";
    localStorage.clear();
  }
};

const removeSelectedElement = function () {
  if (confirm("Are you sure?")) {
    const allLiElements = document.querySelectorAll("#task-list li");
    allLiElements.forEach((element) => {
      const liInput = element.querySelector("input");
      if (liInput.checked) {
        ulList.removeChild(element);

        const inputText = element.textContent;
        const labelText = element.querySelector("label").textContent;
        const inputTextWithoutLabel = inputText.replace(labelText, "");
        deleteItemFromLS(inputTextWithoutLabel);
      }
    });
  }
};

btnAdd.addEventListener("click", addElement);

// Checkbox islemir, cunki umumi ul'e click eventi vermisik. Iki defe checked olur. P.S. artiq isleyir :)
ulList.addEventListener("click", removeElement);

btnDeleteAll.addEventListener("click", removeAllElements);

btnDeleteSelected.addEventListener("click", removeSelectedElement);
