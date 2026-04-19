
window.toggleDisplay = function(ids, value) {
  let array = ids.split(",");
  array.forEach(function(id) {
    const element = document.getElementById(id);
    element.style.display = value;
  });
};

function resetActive(id, selector, inputSelect) {
  if (inputSelect) {
    id.querySelectorAll(selector).forEach(function(element) {
      element.querySelector("input").checked = false;
      element.classList.remove("active");
    });
    setTimeout(function() {
      let activeInput = id.querySelector(".active");
      if (!activeInput) {
        id.querySelector("input").checked = true;
        id.querySelector("button").classList.add("active");
      }
    }, 120);
  } else {
    id.querySelectorAll(selector).forEach(function(element) {
      element.classList.remove("active");
    })
    setTimeout(function() {
      let activeBtn = id.querySelector(".active");
      if (!activeBtn) {
        id.querySelector("button").classList.add("active");
      }
    }, 120);
  };
};

function setActive(id, inputSelect) {
  if (inputSelect) {
    setTimeout(function() {
      id.getElementsByTagName("input")[0].checked = true;
      id.classList.add("active");
    }, 100)
  } else {
    setTimeout(function() {
      id.classList.add("active");
    }, 100)
  }
};
