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
        <a href="${cv.contact.linkdedin}">${cv.contact.linkedin}</a> <br>
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
  for (let i in cv.organization1) {
    header1 = cv.organization1[i];
    section1 = cv[header1];
    rv.push(`<div class="key"><div class="title">${titleCase(header1)}</div>`);
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
    if (header1 == "languages") {
        let rvx = [];
        for (let k in section1) {
          section3 = section1[k];
          rvx.push("<li><b>" + section3.title + "</b> - " + section3.level + "</li>")
        }
        rv.push(`<ul class="languages">${rvx.join('')}</ul>`);
    }
    if (["soft skills", "interests"].includes(header1)) {
      rv.push(section1.join(', '));
    }
    rv.push(`</div><hr>`);
  }
  
  return `<div class="container"><div class="key small-font">${cv.pitch}</div><hr>${rv.join('')}</div>`;
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
