const tablesbtn=document.getElementById("tablesbutton")
const main=document.getElementById("mainSection")
let columnsName=[];
function gettype(type) {
  const t = type.toLowerCase();
  if (
    t.includes("int") ||
    t.includes("decimal") ||
    t.includes("float") ||
    t.includes("double") ||
    t.includes("real")
  ) {
    return "Number";
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
    return "String";
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
getbasicstructure()
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

     

 tablesbtn.addEventListener("click", async (event) => {

  const button = event.target.closest(".nav-button");
  if (!button) return; 
  addactiveBtn(makearray(tablesbtn.querySelectorAll(".nav-button")),button)
  const tableName = button.textContent;
  const targetSection = button.dataset.target;
  if(targetSection==="section-dashboard"){
  getDashboard()
    return
  }
  else if( event.target.closest(".btn-danger")){
    location.href = "index.php";
  }
  let table={};
  getDB() 
table= await DB_CACHE.tables.find((e)=> e.table===tableName)
 columnsName.length = 0;
makearray(table.columns).forEach((e)=>{
columnsName.push(e)
  })
 
  let fields=document.createElement("div")
 
  fields.innerHTML=""
  columnsName.forEach((e)=>{
   
    if(!e.extra.includes("auto_increment"))
    fields.innerHTML+=` <div class="col-md-3 col-sm-6 col-12 mb-3">
  <label class="form-label">${e.name}</label>
  <input type="${gettype(e.type)}" class="form-control" name="${e.name}" required></div>`
  })
  


main.innerHTML=`
 <section id="section-${tableName}" class="section-view active">
                <h2 class="section-title">${tableName}</h2>
                <div class="card mb-4 ">
                    <div class="card-header">Insert New ${tableName}</div>
                    <div class="card-body">
                        <form id="form${tableName}Insert">
                        <div class="row">
                           ${fields.innerHTML}
                           </div>
                            </div>
                            <button type="submit" class="btn btn-primary mt-3">Insert ${tableName}</button>
                        </form>
                    </div>
                </div>

              
                </div>
            </section>

`
 
});
