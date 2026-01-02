const tablesbtn=document.getElementById("tablesbutton")
const main=document.getElementById("mainSection")
let columnsName=[];
let typeArr=[]
const  headtablewithfields={};
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
makearray(table.columns).forEach((e)=>{
  if(e.key!=="PRI")
  typeArr.push(gettype(e.type))
columnsName.push(e)
  })
 
 
  buieldHeadTable()
  const tbody=document.createElement("tbody")
 tbody.setAttribute("id","tablebody")
   makearray(table.data).forEach((e)=>{

   let primarykey=e[columnsName.find((e)=>e.key==="PRI").name]
    const tr2 = document.createElement("tr");

     columnsName.forEach((e1)=>{
    
         const td = document.createElement("td");
    td.textContent = e[e1.name];
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
let fieldvalue=[];
b.addEventListener("click",()=>{
  
 const cell= makearray(tablebody.querySelectorAll(".edittd"))
 let cel=makearray(cell.filter((e)=>e.getAttribute("id")=== b.dataset.id))
if(b.classList.contains("btn-save"))
{
 b.classList.toggle("btn-edit");
b.classList.toggle("btn-save");
b.textContent="Edit"

 cel.forEach((e,index)=>{
  console.log(fieldvalue[index])
 
  e.innerHTML=``
   e.textContent=fieldvalue[index]
 })
}
else{
 b.classList.toggle("btn-edit");
b.classList.toggle("btn-save");
b.textContent="Save"

 cel.forEach((e)=>{
   fieldvalue.push(e.textContent)
  
  e.innerHTML=`<textarea class="inputedit" rows="2" ></textarea>`
 })

  cel.forEach((e,index)=>{
    if(index==0)
  console.log( e.querySelector("textarea").focus())
 })

}



})
})

 
});
