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

document.addEventListener("click", handlePost);
