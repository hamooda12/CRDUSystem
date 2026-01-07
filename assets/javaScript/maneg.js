const tablesbtn=document.getElementById("tablesbutton")
const main=document.getElementById("mainSection")
let columnsName=[];
let typeArr=[]
let isnull=[];
const  headtablewithfields={};
let checkright={};
let errorfieldindex=[]
let dataedit={}
getbasicstructure()
function gettype(type) {
  const t = type.toLowerCase();
  if (
    t.includes("int") ||
    t.includes("decimal") ||
    t.includes("float") ||
    t.includes("double") ||
    t.includes("real")
  ) {
    return "number";
  }
  if (
    t.includes("char") ||
    t.includes("text") ||
    t.includes("enum") ||
    t.includes("set") ||
    t.includes("varchar") ||
    t.includes("tinytext") ||
    t.includes("mediumtext") ||
    t.includes("longtext")
  ) {
    return "text";
  }
  if (
    t.includes("date") ||
    t.includes("time") ||
    t.includes("year") ||
    t.includes("timestamp")
  ) {
    return "Date";
  }
  if (
    t.includes("bool") ||
    t === "tinyint(1)"
  ) {
    return "Boolean";
  }
  return "Unknown";
}
async function getbasicstructure(){
let d=await fetch('/MangementSystem/getTables.php')
let data=await d.json()
  if (!data.success) {
      console.error(data.message);
      return;
    }
   
          data.tables.forEach(table => {
      if(!table.table.toLowerCase().includes("user")){
        
      tablesbtn.innerHTML+=`
                 <button class="btn btn-outline-light nav-button" data-target="section-${table.table}">${table.table}</button>
                            `}
    });
    tablesbtn.innerHTML+=`  <button class="btn btn-outline-light btn-danger nav-button mt-3" id="btn-logout">Log Out</button>`;
  
}
function addactiveBtn(btnArray,btn){
btnArray.forEach((e)=>{
  e.classList.remove("active");
})
btn.classList.add("active");
}
function makearray(arr){
  return Array.from(arr);
}
function buieldHeadTable(){
 let fields=document.createElement("div")
  const thead=document.createElement("thead");
 let typeArr=[];
const tr = document.createElement("tr");
  fields.innerHTML=""
  columnsName.forEach((e)=>{
    let text=``
  if(e.default){
text=` <input type="${gettype(e.type)}" class="form-control s" name="${e.name}" required placeholder="${e.default}"></div>`
  }
  else if(e.null==="YES"){
 text=` <input type="${gettype(e.type)}" class="form-control s" name="${e.name}" required placeholder="You can left it empty"></div>`
  }
  else{
   text=` <input type="${gettype(e.type)}" class="form-control s" name="${e.name}" required placeholder="without default value"></div>`
  }
   typeArr.push(gettype(e.type))
    if(!e.extra.includes("auto_increment"))
    fields.innerHTML+=` <div class="col-md-3 col-sm-6 col-12 mb-3">
  <label class="form-label">${e.name}</label>
 ${text}
  `

  const th = document.createElement("th");
   
    th.textContent = e.name;
    tr.appendChild(th);

  })
    const th = document.createElement("th");
   
  th.textContent ="action";
    tr.appendChild(th);
  thead.appendChild(tr);
  headtablewithfields["thead"] = thead;
  headtablewithfields["fields"] = fields;

  
}
function bieldMain(tableName,fields,thead,tbody){
return `
 <section id="section-${tableName}" class="section-view active">
                <h2 class="section-title">${tableName}</h2>
                <div class="card mb-4 ">
                    <div class="card-header">Insert New ${tableName}</div>
                    <div class="card-body">
                        <form id="form${tableName}Insert">
                        <div class="row">
                           ${fields}
                           </div>
                            </div>
                            <button type="submit" class="btn btn-primary mt-3">Insert ${tableName}</button>
                        </form>
                    </div>
                </div>
                </div>
                    <section class="dashboard-section">
              <h2>Complete Table Structure</h2>
      
        <div class="db-card">
          <div class="card-header">${tableName} List
             <input type="text" class="form-control form-control-sm" placeholder="Search...">
          </div>
          <div class="card-body">
            <table class="db-table">
              
                  ${thead}
             
              ${tbody}
            
            </table>
          </div>
        </div>
</section>
</section>


`
}
function bieldActionDiv(primarykey){
  return `  <div class="action" id="action">
        <button class="btn-edit" data-id="${primarykey}">
            <i class="fas fa-edit me-1"></i>Edit
        </button>
        <button class="btn-delete" data-id="${primarykey}">
            <i class="fas fa-trash me-1"></i>Delete
        </button>
    </div`
}
function isValidDateString(dateStr) {
  const patterns = [
    // DD-MM-YYYY or DD/MM/YYYY
    /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/,
    // MM-DD-YYYY or MM/DD/YYYY
    /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/,
    // YYYY-MM-DD or YYYY/MM/DD
    /^(\d{4})[\/-](\d{2})[\/-](\d{2})$/
  ];

  for (const pattern of patterns) {
    const match = dateStr.match(pattern);
    if (!match) continue;

    let day, month, year;

    if (match[1].length === 4) {
      // YYYY-MM-DD
      year = +match[1];
      month = +match[2];
      day = +match[3];
    } else {
      // DD-MM-YYYY أو MM-DD-YYYY
      year = +match[3];
      month = +match[2];
      day = +match[1];
    }

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return true;
    }
  }

  return false;
}
function isZeroDateString(dateStr) {
  const zeroPatterns = [
    /^00[\/-]00[\/-]0000$/, // DD-MM-YYYY or MM-DD-YYYY
    /^0000[\/-]00[\/-]00$/  // YYYY-MM-DD
  ];

  return zeroPatterns.some(pattern => pattern.test(dateStr));
}
function insertata(tableName,dataInsert){

fetch("http://localhost/api/insert.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        table: tableName,
        data: dataInsert
    })
})
.then(res => res.json())
.then(data => {
    console.log(data);

    if (data.success) {
        alert("تم الإدخال بنجاح! ID = " + data.insert_id);
    } else {
        alert("خطأ: " + data.message);
    }
});


}
function updateData(){

}
function checkRightEdit(e,index,types){
  console.log(typeof (e),types[index],index,e,isnull[index],isZeroDateString(e),isValidDateString(e))
    if(typeof (e)==="string"&&types[index]==="Date"&&isnull[index]&&e.length===0){
    checkright= {"state":true,"index":index,"message":"you uptated the data"};
  }
  else if((typeof (e)==="string"&&types[index]==="Date"&&(isValidDateString(e)||isZeroDateString(e)))){
    checkright= {"state":true,"index":index,"message":"you uptated the data"};
  }
else if(typeof (e)==="string"&&types[index]==="number"&&!isNaN(parseFloat(e))){
    checkright= {"state":true,"index":index,"message":"you uptated the data"};
  }
else if(typeof (e)==="string" &&types[index]!="text"||(typeof (e)==="string" &&types[index]==="text"&&!isNaN(parseFloat(e))))
checkright={"state":false,"index":index,"message":"type"}
else if(e ==="" && !isnull[index])
checkright= {"state":false,"index":index,"message":"can't be empty"}
else{
checkright= {"state":true,"index":index,"message":"you uptated the data"};
}
return checkright

}
function fillerrorfield(fieldvalue){
   fieldvalue.forEach((e,index)=>{
  checkRightEdit(e,index,typeArr,isnull)
  let state=checkright.state
  let message=checkright.message
  let ind=checkright.index
  if(!state){
    errorfieldindex.push({"index":ind,"message":message})
    cel[ind].value=``
  }})
}


 tablesbtn.addEventListener("click", async (event) => {

  const button = event.target.closest(".nav-button");
  if (!button) return; 
  addactiveBtn(makearray(tablesbtn.querySelectorAll(".nav-button")),button)
  const tableName = button.textContent;
  const targetSection = button.dataset.target;
  if(targetSection==="section-dashboard"){
initDashboard()
    return
  }
  else if( event.target.closest(".btn-danger")){
    location.href = "index.php";
  }
  let table={};
  getDB() 
table= await data.tables.find((e)=> e.table===tableName)
 columnsName.length = 0;
 typeArr.length = 0;
 isnull.length=0
makearray(table.columns).forEach((e)=>{
  if(e.key!=="PRI")
  typeArr.push(gettype(e.type))
columnsName.push(e)
  })
 dataedit={}
   let primarykey=""
  buieldHeadTable()
  const tbody=document.createElement("tbody")
 tbody.setAttribute("id","tablebody")
 isnull=[]
      columnsName.forEach((e1)=>{
 
       e1.null==="YES"? isnull.push(false):isnull.push(true)})
   makearray(table.data).forEach((e)=>{
  

    primarykey=e[columnsName.find((e)=>e.key==="PRI").name]
    const tr2 = document.createElement("tr");
     columnsName.forEach((e1)=>{
 
    
         const td = document.createElement("td");
    td.textContent = e[e1.name];
    td.setAttribute("data-key",`${e[primarykey]}`)
      if(e1.key!="PRI"){
        td.classList.add("edittd")
      td.setAttribute("id",primarykey)
      }
    tr2.appendChild(td);
  })
const td=document.createElement("td")
td.innerHTML=bieldActionDiv(primarykey)
tr2.appendChild(td);
tbody.appendChild(tr2);
})

main.innerHTML=bieldMain(tableName,headtablewithfields["fields"].innerHTML, headtablewithfields["thead"].outerHTML,tbody.outerHTML)
const tablebody=document.getElementById("tablebody");
const action=makearray(document.querySelectorAll(".btn-edit"));


action.forEach((b)=>{

b.addEventListener("click",()=>{
let fieldvalue=[];
checkright={}
bool=true;
 const cell= makearray(tablebody.querySelectorAll(".edittd"))
 let cel=makearray(cell.filter((e)=>e.getAttribute("id")=== b.dataset.id))


if(b.classList.contains("btn-save"))
{
  errorfieldindex=[]
  let val=makearray(document.querySelectorAll(".inputedit"))
  val.forEach((e)=>{
fieldvalue.push(e.value)

  })

  fieldvalue.forEach((e,index)=>{
  checkRightEdit(e,index,typeArr)

  let state=checkright.state
  let message=checkright.message
  let ind=checkright.index
  if(!state){
    errorfieldindex.push({"index":ind,"message":message})
    cel[ind].value=``
  }})
  if(!errorfieldindex.length){
    console.log(fieldvalue,columnsName)

columnsName.forEach((e,index)=>{
  if(index>0)
  dataedit[`${e.name}`]=fieldvalue[index-1]
})

const payload = {
  table: tableName,
  data:dataedit,
  where: {
  [columnsName[0].name]: cel[0].getAttribute("id")
  }
};
console.log(payload)
fetch("/MangementSystem/update.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    console.log("✅ تم التحديث بنجاح");
    console.log(data);
  } else {
    console.error("❌ فشل التحديث:", data.message);
  }
})
.catch(err => {
  console.error("🚨 خطأ في الاتصال:", err);
});

    alert("succses edit")
    
 b.classList.toggle("btn-edit");
b.classList.toggle("btn-save");
b.textContent="Edit"

 cel.forEach((e,index)=>{
  e.innerHTML=``
  e.textContent=fieldvalue[index]
 })
}else{
errorfieldindex.forEach((e,index)=>{   
cel[e.index].innerHTML=`<textarea class="inputedit" rows="2"></textarea>`
if(index===0)cel[e.index].querySelector("textarea").focus()
})

}

}
else{
 b.classList.toggle("btn-edit");
b.classList.toggle("btn-save");
b.textContent="Save"
 cel.forEach((e)=>{
   fieldvalue.push(e.textContent)
  
  e.innerHTML=`<textarea class="inputedit" rows="2" >${e.textContent}</textarea>`
 
 })

  cel.forEach((e,index)=>{
    if(index==0){
   e.querySelector("textarea").focus()
   e.querySelector("textarea").select()}
 })

}



})
})

 
});
