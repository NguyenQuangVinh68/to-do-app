const { ipcRenderer } = require("electron");
var Swal = require("sweetalert2");

function render(data) {
  document.getElementById("tasks").innerHTML = "";
  data.forEach((element) => {
    if (element.checked == false) {
      document.getElementById("tasks").innerHTML += `
      <li>
          <div><input type="checkbox" onclick="isChecked(${element.id})"></div>
          <p>${element.content}</p>
          <p onclick="remove(${element.id})">x</p>
      </li>`;
    } else {
      document.getElementById("tasks").innerHTML += `
      <li>
          <div><input type="checkbox" onclick="isChecked(${element.id})" checked="${element.checked}"></div>
          <p><del>${element.content}</del></p>
          <p onclick="remove(${element.id})">x</p>
      </li>`;
    }
  });
}

document.getElementById("btn-add").addEventListener("click", () => {
  var input = document.getElementById("text-todo").value;
  if (input.length < 5) {
    Swal.fire({
      text: "Please enter more than 5 charaters and do not blank.",
    });
    document.getElementById("text-todo").value = "";
  } else {
    ipcRenderer.send("add-to-list", input);
    Swal.fire({
      icon: "success",
      title: "Add to success list",
      showConfirmButton: false,
      timer: 1500,
    });
    document.getElementById("text-todo").value = "";
  }
});

ipcRenderer.on("loadData", (event, data) => {
  render(data);
});

function remove(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      ipcRenderer.send("removeItem", id);
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    }
  });
}

function isChecked(id) {
  ipcRenderer.send("completed", id);
}

// filter list completed
// các status 1 2 3 đại diện cho từng sự kiện

document.getElementById("completed").addEventListener("click", () => {
  ipcRenderer.send("filterCompletedTask", 1);
});
document.getElementById("alltasks").addEventListener("click", () => {
  ipcRenderer.send("allTasks", 2);
});
document.getElementById("clear").addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      ipcRenderer.send("clearAllTask", 3);
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    }
  });
});
