  const tablesbtn=document.getElementById("tablesbutton")
const main=document.getElementById("mainSection")
let columnsName=[];
function gettype(type){
  
if(type.toLowerCase().includes("int")||type.toLowerCase().includes("decimal")){
return "Number"
}
}
fetch('/MangementSystem/getTables.php')
  .then(res => res.json())
  .then(data => {
    if (!data.success) {
      console.error(data.message);
      return;
    }

    console.log(data.tables);

    data.tables.forEach(table => {
      if(!table.table.toLowerCase().includes("user")){
        
      tablesbtn.innerHTML+=`
                 <button class="btn btn-outline-light nav-button" data-target="section-${table.table}">${table.table}</button>
                            `}
    });
    tablesbtn.innerHTML+=`  <button class="btn btn-danger mt-3" id="btn-logout">Log Out</button>`;
  })
  .catch(err => console.log("hi"));
 tablesbtn.addEventListener("click", async (event) => {

  const button = event.target.closest(".nav-button");
  if (!button) return; 
Array.from(tablesbtn.querySelectorAll(".nav-button")).forEach((e)=>{
  e.classList.remove("active");
})
button.classList.add("active");
  const tableName = button.textContent;

  const targetSection = button.dataset.target;
  let table={};
  let da=await fetch('/MangementSystem/getTables.php')
  let alldata=await da.json()
table= await alldata.tables.find((e)=> e.table===tableName)
 columnsName=[]
Array.from(table.columns).forEach((e)=>{
columnsName.push(e)
  })
 
  let fields=document.createElement("div")
 
     fields.innerHTML=""
  columnsName.forEach((e)=>{
   
    if(!e.extra.includes("auto_increment"))
    fields.innerHTML+=` <div class="col-md-3 col-sm-6 col-12 mb-3">
  <label class="form-label">${e.name}</label>
  <input type="text" class="form-control" name="title" required></div>`
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

/*
div ccard
  <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>Books List</span>
                        <input type="text" class="form-control form-control-sm" placeholder="Search...">
                    </div>
                    <div class="card-body table-responsive">
                        <table class="table table-striped table-hover mb-0" id="tableBooks">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Publisher</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Original Price</th>
                                    <th>Available</th>
                                    <th class="admin-only">Actions</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
*/