
document.querySelectorAll(".inputSelect").forEach(function(element) {
  const elements = element.querySelectorAll("button");
  for (let element of elements) {
    element.onclick = function() {
      setActive(this, true);
    }
  }
});
document.querySelectorAll(".btnSelect").forEach(function(element) {
  const elements = element.querySelectorAll("button");
  for (let element of elements) {
    element.onclick = function() {
      setActive(this);
    }
  }
});

window.alert = function(info, title) {
  title ??= "Alert";
  const html = `
    <div class="Content">
      <div class="Symbol">
        <span>!</span>
      </div>
      <div class="Wrapper">
        <div class="Head">
          <h4>${title}</h4>
          <button onclick="toggleDisplay('customAlert', 'none')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <p>
          ${info}
        </p>
      </div>
    </div>
  `;
  const range = document.createRange().createContextualFragment(html);
  customAlert.innerHTML = "";
  customAlert.appendChild(range);
  toggleDisplay("customAlert", "flex");
};

customAlert.addEventListener("click", function(element) {
  let id = element.target.id;
  if (id == "customAlert") {
    toggleDisplay("customAlert", "none");
  }
});

window.extractUsername = function() {
  
  const fieldFrom = window.fieldFrom.value.trim();
  const fieldTo = window.fieldTo.value.trim();
  const selectFile = window.selectFile;
  let rowLength = document.querySelector("#rowLength .active > input").value;
  const emailHost = document.querySelector("#emailHost .active > input").value;
  const type = selectFile.files[0]?.type;
  switch (true) {
    case (fieldFrom == ""): alert(`"Field from" can not be empty.`);
    break;
    case (!type): alert("Choose a JSON file to extract data from.");
    break;
    case (!type.match(/\w+\/json/ig)): alert("File must be a valid JSON file containing an array of objects (e.g., [{}]).");
    break;
    default: {
      selectFile.files[0].text().then(function(datas) {
        datas = JSON.parse(datas);
        rowLength = (rowLength == "Max") ? datas.length:Number(rowLength);
        const row1 = createRow(rowLength, datas)[0];
        const rows = createRow(rowLength, datas);
        setRowBtn(
          rows, 
          fieldFrom,
          fieldTo,
          datas,
          emailHost
        );
        const emailLikeUsernames = extractEmailLikeUsernames(
          row1.start,
          row1.stop,
          fieldFrom,
          fieldTo,
          datas,
          emailHost
        );
      }).catch(function(error) {
        alert(error.message, "Error");
      })
    }
  }

};

window.extractEmailLikeUsernames = function(start, stop, fieldFrom, fieldTo, datas, emailFormat) {
  const emailLikeUsernames = new Array();
  for (let i = Number(start); i <= Number(stop); i++) {
    if (!datas[i][fieldFrom]) continue;
    let value = datas[i][fieldFrom].replace(/[a-z0-9.@_-\s]/gi, "");
    if (value == "") {
      value = datas[i][fieldFrom].toLowerCase().replace(/[@_-]/g,"");
      if (emailFormat != "") value += emailFormat;
      if (fieldTo != "") {
        emailLikeUsernames.push({
          [`${fieldTo}`]: value
        });
      } else {
        emailLikeUsernames.push(value);
      }
    }
  };
  result.value = JSON.stringify(emailLikeUsernames, null, 2);
};

window.importFile = async function(path) {
  try {
    const data = await import(path);
    return data.default;
  } catch (error) {
    throw error;
  }
};

 
window.createRow = function(count, datas) {
  const rows = new Array();
  let rowCount = 0;
  count--
  for (let i = 0; i < datas.length;i++) {
    if (i + count <= datas.length) {
      rowCount++
      rows.push({
        start: i,
        stop: i + count,
        count: rowCount
      });
      i+= count;
    } else {
      rowCount++
      rows.push({
        start: i,
        stop: datas.length - 1,
        count: rowCount
      });
      break;
    }
  };
  return rows;
};

window.setRowBtn = function(rows, fieldFrom, fieldTo, datas, emailHost) {
  resultRows.innerHTML = "";
  rows.forEach(function(row) {
    const html = `
      <button class="">R${rows.indexOf(row)+1}</button>
    `;
    const range = document.createRange().createContextualFragment(html);
    range.querySelector("button").addEventListener("click", function() {
      setActive(this);
      extractEmailLikeUsernames(
        row.start,
        row.stop,
        fieldFrom,
        fieldTo,
        datas,
        emailHost
      )
    })
    resultRows.appendChild(range);
  });
  resultRows.querySelector("button").setAttribute("class", "active");
};

