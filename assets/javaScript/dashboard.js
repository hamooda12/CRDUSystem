document.addEventListener("DOMContentLoaded",()=>{
 getDashboard()
})
let DB_CACHE = null;

async function getDB() {
  if (DB_CACHE) return DB_CACHE;

  const res = await fetch('/MangementSystem/getTables.php');
  DB_CACHE = await res.json();
  return DB_CACHE;
}

async function getDashboard(){
getDB()
  if (!DB_CACHE.success) {
      console.error(data.message);
      return;
    }
    let divcard=document.createElement("div")
  let spancolumns=document.createElement("div")
  const oneToOne=document.createElement("div");
 const oneToMany=document.createElement("div");
  const ManytoMany=document.createElement("div");
  const tableStructure=document.createElement("table");
 oneToMany.classList.add("card-body")
   ManytoMany.classList.add("card-body")
  tableStructure.classList.add("db-table")

  oneToOne.classList.add("card-body")
  spancolumns.classList.add("mt-3")
  let manydata=Array.from(data.relations['many_to_many'])

   divcard.classList.add("row");
     oneToOne.innerHTML=`<p class="mb-3">Each record in Table A relates to exactly one record in Table B.</p>`
     oneToMany.innerHTML=`<p class="mb-3">Each record in Table A relates to multiple records in Table B.</p>`
     ManytoMany.innerHTML=`<p class="mb-3">Records in Table A relate to multiple records in Table B and vice versa.</p>`
     tableStructure.innerHTML=`<thead>
                                    <tr>
                                        <th>Table Name</th>
                                        <th>Primary Key</th>
                                        <th>Foreign Keys</th>
                                        <th>Record Count</th>
                                    </tr>
                                </thead>
                                <tbody>`
    
                                console.log(data.relations)
       Array.from(data.relations['one_to_one']).forEach((e)=>{
      
        oneToOne.innerHTML+=`  
        <div class="relationship-card one-to-one">
                                    <div class="relationship-title">${e.table} → ${e.references_table}</div>
                                    <p class="relationship-desc">Each ${e.table} has exactly ${e.references_table} record with additional details.</p>
                                    <p class="relationship-desc"> The forgin key in ${e.table} is ${e.column} And the primary key in   ${e.references_table} is ${e.references_column}.</p>
                                </div>
                             
                                `
       })
     Array.from(data.relations['one_to_many']).forEach((e)=>{
        let many=manydata.find((s)=>s.junction_table===e.table)
        if(!many){
oneToMany.innerHTML+=`<div class="relationship-card one-to-many">
<div class="relationship-title">${e.references_table} → ${e.table}</div>
<p class="relationship-desc">Each ${e.references_table} can contain many ${e.table}, but each ${e.table} belongs to one ${e.references_table}.</p>
                                </div>`}
     })
       manydata.forEach((e)=>{
ManytoMany.innerHTML+=`<div class="relationship-card many-to-many">
                                    <div class="relationship-title">${e.relations[0].references_table} ↔ ${e.relations[1].references_table} </div>
                                    <p class="relationship-desc">The Many to Many Table from the Relation is ${e.junction_table}</p>
                                </div>
                                `
       })
       let tableHTML = `
<thead>
    <tr>
        <th>Table Name</th>
        <th>Primary Key</th>
        <th>Foreign Keys</th>
        <th>Record Count</th>
    </tr>
</thead>
<tbody>
`;

data.tables.forEach(table => {

    const primaryKeys = table.columns
        .filter(c => c.key === "PRI")
        .map(c => c.name)
        .join(", ") || "No primary Key";

    const foreignKeys = table.columns
        .filter(c => c.key === "MUL")
        .map(c => c.name)
        .join(", ") || "No forgin key";

    tableHTML += `
    <tr>
        <td><strong>${table.table}</strong></td>
        <td>${primaryKeys}</td>
        <td>${foreignKeys}</td>
        <td>${table.data.length}</td>
    </tr>
    `;
});

tableHTML += `</tbody>`;
tableStructure.innerHTML = tableHTML;

     data.tables.forEach(table => {
        let primarykey=table.columns.find((e)=>e.key==="PRI")
        let forginKey=table.columns.find((e)=>e.key==="MUL")
        

      
                         
    spancolumns.innerHTML="";
 
    Array.from(table.columns).forEach((e)=>{
      
      
spancolumns.innerHTML+=`
   <span class="table-badge">${e.name}</span>
    `
   
  })
 
    
    divcard.innerHTML+=`<div class="col-12 col-md-2 col-lg-3 mb-4">
                        <div class="db-card">
                            <div class="card-header">${table.table}</div>
                            <div class="card-body">
                                  <p>Table Attributes are</p>
                                ${spancolumns.outerHTML}
                                </div>
                                </div>
                                </div>
                            `
   })

    main.innerHTML=`    
     <section id="" class="section-view active">   
            <main class="col-12 col-md-9 col-lg-10 content-wrapper" id="mainSection">
            <div class="page-header">
                <h1 class="page-title">Database Structure</h1>
                <p class="page-subtitle">DataBase Management System - Tables and Relationships Overview</p>
            </div>
            <section class="dashboard-section">
                <h2 class="mb-4" style="color: var(--primary-green); font-family: 'Playfair Display', serif;">Database Tables</h2>
                <div class="row">
                  ${divcard.outerHTML}
                </div>
            </section>

       
            <section class="dashboard-section">
                <h2 class="mb-4" style="color: var(--primary-green); font-family: 'Playfair Display', serif;">Table Relationships</h2>
                
                <div class="row">
                    <div class="col-12 col-md-4 mb-4">
                        <div class="db-card islamic-pattern">
                            <div class="card-header">One-to-One Relationship</div>
                           ${oneToOne.outerHTML}
                        </div>
                    </div>
                    
                    <div class="col-12 col-md-4 mb-4">
                        <div class="db-card islamic-pattern">
                            <div class="card-header">One-to-Many Relationship</div>
                            ${oneToMany.outerHTML}
                        </div>
                    </div>
                    
                    <div class="col-12 col-md-4 mb-4">
                        <div class="db-card islamic-pattern">
                            <div class="card-header">Many-to-Many Relationship</div>
                          ${ManytoMany.outerHTML}
                        </div>
                    </div>
                </div>
            </section>

    
            <section class="dashboard-section">
                <h2 class="mb-4" style="color: var(--primary-green); font-family: 'Playfair Display', serif;">Complete Table Structure</h2>
                
                <div class="db-card">
                    <div class="card-header">${data.database} Database Schema</div>
                    <div class="card-body">
                        <div class="table-responsive">
                        ${tableStructure.outerHTML}
                        </div>
                    </div>
                </div>
            </section>
            
           
            <div class="mt-5 pt-4 text-center text-muted" style="border-top: 1px solid rgba(212, 175, 55, 0.2);">
                <p>This dashboard displays the static database structure for the DataBase Management System.</p>
                <p class="small">All data shown is for demonstration purposes only.</p>
            </div>
        </main>
</section>`
      
  
}
     