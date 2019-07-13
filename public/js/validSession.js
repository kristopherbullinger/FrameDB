const handlePost = (e) => {
  if (e.target.classList.contains("submit")) {
    const params = {notation: modalContent.querySelector("h2").innerText};
    const char = document.querySelector("main").dataset.label;
    let inputs = selectedMoveTableBody.querySelectorAll("input");
    for (let i=0; i < inputs.length; i++) {
      let { name, value } = inputs[i];
      params[name] = value.trim();
    }
    params.preview_url = modalContent.querySelector("#preview_url input").value;
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

const toggleEdit = e => {
  if (e.target.classList.contains("edit-icon")) {
    let elementsToHide = [];
    elementsToHide.push(modalContent.querySelector(".button-container"));
    for (let i=0; i < selectedMoveTableBody.children.length; i++) {
      //add input-field TRs to hide list
      elementsToHide.push(selectedMoveTableBody.children[i].children[2]);
    }
    //add third table header column
    elementsToHide.push(selectedMoveTableBody.parentElement.children[0].children[0].children[2]);
    //add preview input box
    elementsToHide.push((modalContent).querySelector("#preview_url"));
    //show or hide each el based on state.edit value
    elementsToHide.forEach(el => {
      if (state.edit) {
        el.classList.add("hidden");
      } else {
        el.classList.remove("hidden");
      }
    });
    //toggle edit mode
    state.edit = !state.edit
    //update text content of button and span
    if (state.edit) {
      modalContent.querySelector("span.edit-icon").innerText = "Cancel";
    } else {
      modalContent.querySelector("span.edit-icon").innerText = "Edit";
    }
  }
};

const generateToken = async (e) => {
  e.preventDefault();
  let response = await fetch("http://localhost:3000/auth/generate-token");
  if (response.ok) {
    //render jwt somehow ...
    let { token } = await response.json();
    let linkNode = document.createElement("input");
    document.body.appendChild(linkNode);
    linkNode.classList.add("hidden");
    linkNode.value = token;
    linkNode.select();
    document.execCommand("copy");
    console.log(token, linkNode.value);
  } else {
    console.log("error fetching token");
  }
}


document.querySelector("#generate-token").addEventListener("click", generateToken)
document.addEventListener("click", handlePost);
document.addEventListener("click", toggleEdit);
