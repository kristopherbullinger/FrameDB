const moves = document.querySelector("tbody").querySelectorAll("tr");
const movesForSorting = Array.from(moves);
let tbody = document.querySelector("tbody");
const table = document.querySelector("table");
const modalContent = document.querySelector(".modal-content");
const modalBackground = modalContent.parentElement;
const selectedMoveTableBody = modalContent.querySelector("tbody");


const headers = ["Notation", "Hit Level", "Damage", "Speed", "Block", "Hit", "Counterhit"];

let state = {
  reverse: false,
  edit: false
};

const removeRows = () => {
  tbody.remove();
  tbody = document.createElement("tbody");
  table.appendChild(tbody);
};

const insertRows = (nodes, forward = true) => {
  if (forward) {
    for (let i=0; i < nodes.length; i++) {
      tbody.appendChild(nodes[i]);
    }
  } else {
    for (let i = nodes.length - 1; i >= 0; i--) {
      tbody.appendChild(nodes[i]);
    }
  }
};

const handleHeaderClick = e => {
  removeRows();
  let modifier = state.reverse ? 1 : -1;
  let targetText = e.target.innerText;
  let columnIndex = headers.indexOf(targetText);
  if (targetText === "Notation") {
    insertRows(moves, state.reverse);
  } else if (targetText === "Hit Level") {
    movesForSorting.sort( (a,b) =>{
      return a.children[columnIndex].innerText.localeCompare(b.children[columnIndex].innerText) * modifier;
    });
    insertRows(movesForSorting);
  } else if (targetText === "Damage") {
    sortByDmg(movesForSorting, columnIndex);
  } else if (targetText === "Speed" || targetText === "Block" || targetText === "Hit" || targetText === "Counterhit") {
    sortByFrameData(movesForSorting, columnIndex);
  }
  state.reverse = !state.reverse;
};

const handleRowClick = e => {
  if (e.target.tagName === "TD" && e.target.parentElement.classList.contains("move")) {
    let targetRow = e.target.parentElement;
    populateModal(targetRow);
  }
};

const sortByFrameData = (nodes, columnIndex) => {
  let modifier = state.reverse ? 1 : -1;
  nodes.sort( (a,b) => {
    let valueA = isNaN(parseInt(a.children[columnIndex].innerText)) ? 999 * modifier : parseInt(a.children[columnIndex].innerText);
    let valueB = isNaN(parseInt(b.children[columnIndex].innerText)) ? 999 * modifier : parseInt(b.children[columnIndex].innerText);
    return (valueA - valueB) * modifier
  });
  insertRows(movesForSorting);
};

const sortByDmg = (movelist, columnIndex)=> {
  let modifier = state.reverse ? 1 : -1;
  movelist.sort( (moveA, moveB) => {
    let dmgA = 0;
    moveA.children[columnIndex].innerText.split(" ").forEach(dmg => {
      dmg = parseInt(dmg);
      if (dmg) dmgA += dmg;
    });
    let dmgB = 0;
    moveB.children[columnIndex].innerText.split(" ").forEach(dmg => {
      dmg = parseInt(dmg);
      if (dmg) dmgB += dmg;
    });
    return (dmgA - dmgB) * modifier;
  });
  insertRows(movelist);
};

const populateModal = node => {
  //node is a tr from the main move table
  modalContent.querySelector("h2").innerText = node.children[0].innerText;
  modalContent.querySelector("img").src = node.dataset.preview;
  modalBackground.classList.remove("hidden");
  console.log("hi");
  for (let i = 0; i < selectedMoveTableBody.children.length; i++) {
    //iterate over each row in the modal table
    let row = selectedMoveTableBody.children[i];
    //match text content of first child to element of headers
    let columnIndex = headers.indexOf(row.children[0].innerText);
    //get value of property from main table
    let propertyValue = node.children[columnIndex].innerText;
    row.children[1].innerText = propertyValue;
    try {
      row.querySelector("input").value = propertyValue;
      modalContent.querySelector("#preview_url input").placeholder = node.dataset.preview
      modalContent.querySelector("#preview_url input").value = node.dataset.preview
    } catch {
      console.log("No");
    }
  }
};

const hideModal = () => {
  modalBackground.classList.add("hidden");
  modalContent.querySelector("img").src = "";
  for (let i = 0; i < selectedMoveTableBody.children.length; i++) {
    let row = selectedMoveTableBody.children[i];
    row.children[1].innerText = "";
    row.querySelector("input").value = "";
  }
};

document.querySelector("thead").addEventListener("click", handleHeaderClick);
document.addEventListener("click", handleRowClick);
document.addEventListener("click", e => {
  if (e.target.classList.contains("cancel")) {
    modalBackground.classList.add("hidden");
  }
});
