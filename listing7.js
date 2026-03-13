
let currentEntries = [];
let fontSize = 16;
let quote = "hello";
let outputtables = "";



// 👇 Convert markdown to structured data
function convert() {
    const md = document.getElementById("markdownInput").value;
    currentEntries = parseMarkdown(md);
    renderList(currentEntries);
    const table = document.getElementById("wordTable");
    table.innerHTML = "";
    currentEntries.forEach((entry, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${entry.index}.</td><button style="color: black; " class="pronounce-btn" onclick="speakItem('${entry.term}'); event.stopPropagation()">${entry.term}</button>`;
        table.appendChild(tr);
    });
    quote = document.getElementById("popover").innerHTML;
    outputtables = document.getElementById("outputTable").innerHTML;
}

// 👇 Parse markdown based on selected format
function parseMarkdown(md) {
    const format = document.getElementById("formatSelect").value;
    const regex = /\*\*(\d+)\.\s+(.*?)\*\*(.*?)?\n([\s\S]*?)(?=\n\*\*(\d+)\.|\n*$)/g;
    let match, entries = [];

    while ((match = regex.exec(md)) !== null) {
        const index = match[1].trim();
        const term = match[2].trim();
        const meta = match[3]?.trim() || "";
        const body = match[4].trim();

        let definition = "", synonym = "", antonym = "", meaning = "", engDef = "", phrasalVerb = "", example = "";

        if (format === "synonym") {
            const defMatch = body.match(/\*\*Definition:\*\*\s*(.*)/);
            const synMatch = body.match(/\*\*Synonym:\*\*\s*(.*)/);
            definition = defMatch ? defMatch[1].trim() : "";
            synonym = synMatch ? synMatch[1].trim() : "jhjhjh";
        } else if (format === "antonym") {
            const defMatch = body.match(/\*\*Definition:\*\*\s*(.*)/);
            const antMatch = body.match(/\*\*Antonym:\*\*\s*(.*)/);
            definition = defMatch ? defMatch[1].trim() : "";
            antonym = antMatch ? antMatch[1].trim() : "";
        } else if (format === "other") {
            const meanMatch = body.match(/\*\*Meaning:\*\*\s*(.*)/);
            const engMatch = body.match(/\*\*English Definition:\*\*\s*(.*)/);
            meaning = meanMatch ? meanMatch[1].trim() : "";
            engDef = engMatch ? engMatch[1].trim() : "";
        } else if (format === "phrasalVerb") {
            const meaMatch = body.match(/\*\*Meaning:\*\*\s*(.*)/);
            const egMatch = body.match(/\*\*Example:\*\*\s*(.*)/);
            phrasalVerb = meaMatch ? meaMatch[1].trim() : "";
            example = egMatch ? egMatch[1].trim() : "";
        }

        entries.push({
            index,
            term,
            meta,
            definition,
            synonym,
            antonym,
            meaning,
            engDef,
            phrasalVerb,
            example,
            checked: false
        });
    }

    return entries;
}

// 👇 Speak text
function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "en-US";
    window.speechSynthesis.speak(msg);
}

// 👇 Render table of entries
function renderList(entries) {
    const format = document.getElementById("formatSelect").value;
    const container = document.getElementById("outputTable");

    let table = `<table><thead><tr><th>S.no.</th>
    <th>✔</th><th>Term</th>`;

    if (format === "synonym") {
        table += `<th>Definition</th><th>Synonym(s)</th>`;
    } else if (format === "antonym") {
        table += `<th>Definition</th><th>Antonym(s)</th>`;
    } else if (format === "phrasalVerb") {
        table += `<th>Meaning</th><th>Example(s)</th>`;
    } else {
        table += `<th>Meaning</th><th>English Definition</th>`;
    }

    table += `</tr></thead><tbody>`;

    entries.forEach((item, i) => {
        table += `<tr class="item" onclick="toggleCheck(${i}, event)"><td>${item.index}.</td>
    <td><input type="checkbox" ${item.checked ? "checked" : ""} /></td>
    <td>
      ${item.term}
      <small>${item.meta}</small>
      <button class="pronounce-btn" onclick="speakItem('${item.term}'); event.stopPropagation()">🔊</button>
    </td>`;

        if (format === "synonym") {
            table += `<td>
        ${item.definition}
        ${item.definition ? `<button class="pronounce-btn" onclick="speakItem('${cleanText(item.definition)}'); event.stopPropagation()">🔊</button>` : ""}
      </td>
      <td>
        ${item.synonym}
        ${item.synonym ? `<button class="pronounce-btn" onclick="speakItem('${cleanText(item.synonym)}'); event.stopPropagation()">🔊</button>` : ""}
      </td>`;
        } else if (format === "antonym") {
            table += `<td>
        ${item.definition}
        ${item.definition ? `<button class="pronounce-btn" onclick="speakItem('${cleanText(item.definition)}'); event.stopPropagation()">🔊</button>` : ""}
      </td>
      <td>
        ${item.antonym}
        ${item.antonym ? `<button class="pronounce-btn" onclick="speakItem('${cleanText(item.antonym)}'); event.stopPropagation()">🔊</button>` : ""}
      </td>`;
        } else if (format === "phrasalVerb") {
          table += `<td>
        ${item.phrasalVerb}
        ${item.phrasalVerb ? `<button class="pronounce-btn" onclick="speakItem('${cleanText(item.phrasalVerb)}'); event.stopPropagation()">🔊</button>` : ""}
      </td>
      <td>
        ${item.example}
        ${item.example ? `<button class="pronounce-btn" onclick="speakItem('${cleanText(item.example)}'); event.stopPropagation()">🔊</button>` : ""}
      </td>`;
      } else {
            table += `<td>${item.meaning}</td>
      <td>
        ${item.engDef}
        ${item.engDef ? `<button class="pronounce-btn" onclick="speakItem('${cleanText(item.engDef)}'); event.stopPropagation()">🔊</button>` : ""}
      </td>`;
        }

        table += `</tr>`;
    });


    table += `</tbody></table>`;
    container.innerHTML = table;
}

// 👇 Clean brackets and translation for pronunciation
function cleanText(text) {
    return text.replace(/\(.*?\)/g, "").replace(/<[^>]*>/g, "").trim();
}

// 👇 Speak from button
function speakItem(text) {
    speak(cleanText(text));
}

// 👇 Toggle checkbox by clicking on row
function toggleCheck(index, event) {
    const checkbox = event.currentTarget.querySelector("input[type='checkbox']");
    if (event.target !== checkbox && event.target.tagName !== "BUTTON") {
        checkbox.checked = !checkbox.checked;
        currentEntries[index].checked = checkbox.checked;
    } else if (event.target === checkbox) {
        currentEntries[index].checked = checkbox.checked;
    }
}

// 👇 Sort unchecked first
function sortItems() {
    currentEntries.sort((a, b) => a.checked - b.checked);
    renderList(currentEntries);
}

// 👇 Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// 👇 Resize font size
function resizeFont(change) {
    if (change === 0) {
        fontSize = 16;
    } else {
        fontSize = Math.max(1, fontSize + change);
    }
    document.body.style.fontSize = fontSize + "px";
}

// 👇 Show popup of all terms
function showPopoverother() {

    document.getElementById("popover").style.display = "block";
}

// 👇 Hide popup
function hidePopoverother() {
    document.getElementById("popover").style.display = "none";
}

function downloadHTML() {
  const format = document.getElementById("formatSelect").value;
  const isDark = document.body.classList.contains("dark") ? "dark" : "";
  const fontSize = parseInt(getComputedStyle(document.body).fontSize);
  const styleContent = document.querySelector("style").innerHTML;
  const safeEntriesJSON = JSON.stringify(currentEntries).replace(/<\/script/g, "<\\/script");

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Vocabulary Checklist (${format})</title>
  <style>${styleContent}</style>
  <style>
  body{
    margin:0;
    padding:0;
  }
    .buttonsgroup{
    display:flex;
    justify-content: space-evenly;
    }
    .tops{
    margin:0;
    border-radius: 10px;
    max-height: 6vh;
    font-size: 1em;
    width: 10vw;
    }
    .pronounce-btnn{
    width:100%;
    border-radius: 0;
    background:white;
    margin:0;
    padding:0;
    text-align:left;
    font-weight:bold;
    font-size:1em;
    background:transparent;
    }
    td{
    padding:0;
    }
    #popover{
    font-size:2em;
    }
    .buttonsgroup{
    height:6vh;
    padding-top:2vh;
    padding-bottom:2vh;
    }
    tr:nth-child(even) {
  background-color: #D6EEEE;
}
  tr:hover{
  box-shadow: 2px 1px 8px inset;
  }
  </style>
</head>
<body class="${isDark}" style="font-size:${fontSize}px">
  <div class="buttonsgroup">
  <button class="tops" onclick="fuckYou()">×</button>
  <button class="tops" onclick="sortItems()">S</button>
  <button class="tops" onclick="toggleDarkMode()">D</button>
  <button class="tops" onclick="resizeFont(1)">+</button>
  <button class="tops" onclick="resizeFont(-1)">-</button>
  <button class="tops" onclick="resizeFont(0)">r</button>
  <button class="tops" onclick="showPopoverOther()">All</button>
  </div>

  <div id="outputTable"></div>

  <div id="popover">
        <span id="popoverClose" onclick="hidePopoverOther()">✖</span>
        <h3 style="display: inline; margin: 0;">All Words</h3>
        <div class="pop">
            <table id="copyThis">
                <thead>
                    <tr>
                        <th style="text-align:center;">#</th>
                        <th>Word</th>
                    </tr>
                </thead>
                <tbody id="wordTable"></tbody>
            </table>
        </div>
    </div>

  <script>
    let currentEntries = ${safeEntriesJSON};
    let fontSize = ${fontSize};
    const format = "${format}";
    let x =0;

    function fuckYou(){

    if(x%2==0){
    document.querySelectorAll(".serial").forEach(el => {el.style.display = "none";});
    }else{
      document.querySelectorAll(".serial").forEach(el => {el.style.display = "table-cell";});
      }
      x++;

    }
    function speak(text) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'en-US';
      window.speechSynthesis.speak(msg);
    }

    function speakItem(text) {
      speak(text.replace(/\\(.*?\\)/g, "").trim());
    }

    function renderTable() {
      const out = document.getElementById('outputTable');
      let html = '<table><thead><tr><th class="serial">S.no.</th><th>✔</th><th>Term</th>';
      if (format === 'synonym') html += '<th>Definition</th><th>Synonym(s)</th>';
      else if (format === 'antonym') html += '<th>Definition</th><th>Antonym(s)</th>';
      else if (format === 'phrasalVerb') html += '<th>Meaning</th><th>Example(s)</th>';
      else html += '<th>Meaning</th><th>English Definition</th>';
      html += '</tr></thead><tbody>';


      currentEntries.forEach((item, i) => {
        const checked = item.checked ? 'checked' : '';
        let c2 = '', c3 = '';
        if (format === 'synonym') { c2 = item.definition; c3 = item.synonym; }
        else if (format === 'antonym') { c2 = item.definition; c3 = item.antonym; }
        else if (format === 'phrasalVerb') { c2 = item.phrasalVerb; c3 = item.example; }
        else { c2 = item.meaning; c3 = item.engDef; }
        html += '<tr onclick="toggleCheck('+i+')">' +'<td class="serial">'+item.index+'.</td>'+
                '<td><input type="checkbox" '+checked+' onchange="currentEntries['+i+'].checked = this.checked"></td>' +
                '<td><strong>' + item.term +
                  ' </strong><small>'+ (item.meta|| '') +'</small><button class="pronounce-btn" onclick="speakItem(\\''+item.term.replace(/'/g,"\\'")+'\\'); event.stopPropagation()">🔊</button>' +
                '</td>' +
                '<td>'+ c2 + (c2 != item.meaning ? ' <button class="pronounce-btn" onclick="speakItem(\\''+c2.replace(/'/g,"\\'")+'\\'); event.stopPropagation()">🔊</button>':'') + '</td>' +
                '<td>'+ c3 + (c3? ' <button class="pronounce-btn" onclick="speakItem(\\''+c3.replace(/'/g,"\\'")+'\\'); event.stopPropagation()">🔊</button>':'') + '</td>' +
                '</tr>';
      });

      
      html += '</tbody></table>';
      out.innerHTML = html;

      
    }

    function toggleCheck(i) {
      currentEntries[i].checked = !currentEntries[i].checked;
      renderTable();
    }

    function sortItems() {
      currentEntries.sort((a,b)=>a.checked - b.checked);
      renderTable();
    }

    function toggleDarkMode() {
      document.body.classList.toggle('dark');
    }

    function resizeFont(delta) {
      if (delta === 0) fontSize = 16;
      else fontSize = Math.max(1, fontSize + delta);
      document.body.style.fontSize = fontSize + 'px';
    }

    function showPopoverOther() {
      const tb = document.getElementById('wordTable');
      tb.innerHTML = currentEntries.map((e,i)=>'<tr><td>'+ (e.index) + '.</td><td><button style="color: black; " class="pronounce-btnn" onclick="speakItem(\\''+e.term.replace(/'/g,"\\'")+'\\'); event.stopPropagation()">'+e.term+'</button></td></tr>').join('');
      document.getElementById('popover').style.display = 'block';
    }

    function hidePopoverOther() {
      document.getElementById('popover').style.display = 'none';
    }

    renderTable();
  </script>
</body>
</html>
`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const nameOfTheFile = document.getElementById('name');
  a.download = `${nameOfTheFile.value}.html`;
  a.click();
  URL.revokeObjectURL(url);
}







