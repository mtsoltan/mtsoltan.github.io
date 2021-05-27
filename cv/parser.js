function readJson(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
   return splitStr.join(' ');
}

function buildTop(cv) {
  document.title = cv.name + " CV";
  return `
    <div class="top">
      <div class="header left">
        <h1>${cv.name}</h1><span>${cv.title}</span>
      </div>
      <div class="header spacer"></div>
      <div class="header right">
        ${cv.contact.phone} <br>
        ${cv.contact.mail} <br>
        <a href="${cv.contact.github}">${cv.contact.github}</a> <br>
        <a href="${cv.contact.linkedin}">${cv.contact.linkedin}</a> <br>
      </div>
    </div>`
}

function buildList(bullets) {
  let rv = "";
  for (let i in bullets) {
    rv += "<li>" + bullets[i] + "</li>";
  }

  return "<ul>" + rv + "</ul>";
}

function buildContent(cv) {
  let rv = [];
  let halfCounter = 0;
  for (let i in cv.organization1) {
    let header1 = cv.organization1[i];
    let section1 = cv[header1];
    let half = false;
    if (section1[0] === true) {
        half = true;
        halfCounter++;
    } else {
        if (halfCounter > 0) rv.push("<hr>");
        halfCounter = 0;
    }
    rv.push(`<div class="key${half ? " half" : ""}"><div class="title">${titleCase(header1)}</div>`);
    if (["work experience", "skills"].includes(header1)) {
      for (let j in cv.organization2) {
        header2 = cv.organization2[j];
        section2 = section1[header2];
        rv.push(`<div class="subtitle">${titleCase(header2)}</div>`);
        let rvx = [];
        for (let k in section2) {
          section3 = section2[k];
          rvx.push(
            (section3.date ? `<div class="job date">${section3.date[0]} -<br>${section3.date[1]}</div>` : "") +
            `<div class="job desc ${header1 == "skills" ? "skill" : ""}"><div class="job title">${section3.title}</div>` +
            (section3.company ? `<br><i>${section3.company}</i>` : "") +
            (section3.bullets ? buildList(section3.bullets) : "") +
            `</div>`);
        }
        rv.push(rvx.join('<br>'));
      }
    }
    if (["education", "student activities"].includes(header1)) {
        let rvx = [];
        for (let k in section1) {
          section3 = section1[k];
          rvx.push(
            (section3.date ? `<div class="job date">${section3.date[0]} -<br>${section3.date[1]}</div>` : "") +
            `<div class="job desc"><div class="job title">${section3.title}</div>` +
            (section3.company ? `<br><i>${section3.company}</i>` : "") +
            (section3.bullets ? buildList(section3.bullets) : "") +
            `</div>`);
        }
        rv.push(rvx.join('<br>'));
    }
    if (["courses", "awards and honors"].includes(header1)) {
        let rvx = [];
        for (let k in section1) {
          section3 = section1[k];
          rvx.push(
            (section3.date ? `<div class="job date">${section3.date}</div>` : "") +
            `<div class="job desc"><div class="job title">${section3.title}</div>` +
            (section3.place ? `<br><i>${section3.place}</i>` : "") +
            (section3.bullets ? buildList(section3.bullets) : "") +
            `</div>`);
        }
        rv.push(rvx.join('<br>'));
    }
    if (
        [
            "languages",
            "programming languages",
            "frameworks and libraries",
            "database systems",
            "hardware",
            "other technologies and shells"
        ].includes(header1)
    ) {
        let rvx = [];
        for (let k in section1) {
          if (section1[k] === true) continue; // Half should not count.
          section3 = section1[k];
          rvx.push("<li><b>" + section3.title + "</b> - " + section3.level + "</li>")
        }
        rv.push(`<ul class="languages">${rvx.join('')}</ul>`);
    }
    if (
        [
            "soft skills",
            "interests",
            "graduation project"
        ].includes(header1)
    ) {
      rv.push(section1.join(', '));
    }
    let hr = "";
    if (halfCounter % 2 == 0) {
        hr = "<hr>";
    }
    console.log(halfCounter);
    rv.push(`</div>${hr}`);
  }

  // The replace is because in odd situations (two full halves, followed by a normal section),
  // both hr add conditions will be true and two hr's will be added.
  // It is much easier to remove one of them than to handle it properly so that just one hr is added.
  return `<div class="container"><div class="key small-font">${cv.pitch}</div><hr>${rv.join('').replace("<hr><hr>", "<hr>")}</div>`;
}






readJson(CV + ".json", function(text){
    var cv = JSON.parse(text);
    console.log(cv);
    document.body.innerHTML += buildTop(cv);
    document.body.innerHTML += buildContent(cv);
    $('.skill ul').hide();
    $('.skill .title').click(function () {
      $('ul', $(this).parent()).slideToggle();
      $(this).toggleClass('open');
    });
});
