const moves = document.querySelector("tbody").querySelectorAll("tr");
const movesForSorting = Array.from(moves);
let tbody = document.querySelector("tbody");
const table = document.querySelector("table");
const modalContent = document.querySelector(".modal-content");
const modalBackground = modalContent.parentElement;
const selectedMoveTableBody = modalContent.querySelector("tbody");


const headers = ["Notation", "Hit Level", "Damage", "Speed", "Block", "Hit", "Counterhit"];

let state = {
  reverse: false
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

const handleEditClick = e => {
  if (e.target.classList.contains("edit-icon")) {
    populateModal(e.target.parentElement.parentElement);
  } else if (e.target.classList.contains("cancel")) {
    hideModal();
  }
}

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
  //node is a tr
  modalContent.querySelector("h2").innerText = node.children[0].innerText;
  modalContent.querySelector("img").src = node.dataset.preview;
  modalBackground.classList.remove("hidden");
  for (let i = 0; i < selectedMoveTableBody.children.length; i++) {
    let row = selectedMoveTableBody.children[i];
    let columnIndex = headers.indexOf(row.children[0].innerText);
    let propertyValue = node.children[columnIndex].innerText;
    row.children[1].innerText = propertyValue;
    row.querySelector("input").value = propertyValue;
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

const handlePost = (e) => {
  console.log("submit");
  if (e.target.classList.contains("submit")) {
    console.log("trying...");
    const params = {notation: modalContent.querySelector("h2").innerText};
    const char = document.querySelector("main").dataset.label;
    let inputs = selectedMoveTableBody.querySelectorAll("input");
    for (let i=0; i < inputs.length; i++) {
      let { name, value } = inputs[i];
      params[name] = value.trim();
    }
    fetch(`http://localhost:3000/tekken7/${char}`, {method: "POST",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(params)
      }
    ).then(res => {
      if (!res.ok) throw new Error("Something went wrong");
      window.location.reload(true);
      // TODO: updateDataAndDom(params);
      //hideModal();
    })
    .catch(err => console.log(err));
  }
};



document.querySelector("thead").addEventListener("click", handleHeaderClick);
document.addEventListener("click", handleEditClick);
document.addEventListener("click", handlePost);
