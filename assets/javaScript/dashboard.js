/* ========= INIT ========= */
document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
});

const main2 = document.getElementById("mainSection");
let data = null;


async function getDB() {
  if (data) return data;

  const res = await fetch("/MangementSystem/getTables.php");
  const data2 = await res.json();

  data = data2;
  return data2;
}

async function initDashboard() {
  const data2 = await getDB();

  if (!data2 || !data2.success) {
    console.error("Failed to load database");
    return;
  }

  renderDashboard(data2);
}


function renderDashboard(data) {
  const { tables, relations, database } = data;


  let cardsHTML = "";

  tables.forEach(table => {
    let columnsHTML = "";

    table.columns.forEach(col => {
      columnsHTML += `<span class="table-badge">${col.name}</span>`;
    });

    cardsHTML += `
      <div class="col-12 col-md-4 col-lg-3 mb-4">
        <div class="db-card">
          <div class="card-header">${table.table}</div>
          <div class="card-body">
            <p>Table Attributes</p>
            <div class="mt-3">${columnsHTML}</div>
          </div>
        </div>
      </div>
    `;
  });

  let oneToOneHTML = `<p class="mb-3">Each record relates to exactly one record.</p>`;
  let oneToManyHTML = `<p class="mb-3">One record relates to many records.</p>`;
  let manyToManyHTML = `<p class="mb-3">Records relate to many records.</p>`;

  relations.one_to_one.forEach(r => {
    oneToOneHTML += `
      <div class="relationship-card one-to-one">
        <div class="relationship-title">${r.table} → ${r.references_table}</div>
        <p>${r.column} → ${r.references_column}</p>
      </div>
    `;
  });

  relations.one_to_many.forEach(r => {
    oneToManyHTML += `
      <div class="relationship-card one-to-many">
        <div class="relationship-title">${r.references_table} → ${r.table}</div>
      </div>
    `;
  });

  relations.many_to_many.forEach(r => {
    manyToManyHTML += `
      <div class="relationship-card many-to-many">
        <div class="relationship-title">
          ${r.relations[0].references_table} ↔ ${r.relations[1].references_table}
        </div>
        <p>Junction table: ${r.junction_table}</p>
      </div>
    `;
  });

 
  let tableRowsHTML = "";

  tables.forEach(table => {
    const pk = table.columns
      .filter(c => c.key === "PRI")
      .map(c => c.name)
      .join(", ") || "—";

    const fk = table.columns
      .filter(c => c.key === "MUL")
      .map(c => c.name)
      .join(", ") || "—";

    tableRowsHTML += `
      <tr>
        <td>${table.table}</td>
        <td>${pk}</td>
        <td>${fk}</td>
        <td>${table.data.length}</td>
      </tr>
    `;
  });

 
  main2.innerHTML = `
    <section class="section-view active">

      <div class="page-header">
        <h1 class="page-title">Database Structure</h1>
        <p class="page-subtitle">Database Management System Overview</p>
      </div>

      <section class="dashboard-section">
        <h2>Database Tables</h2>
        <div class="row">${cardsHTML}</div>
      </section>

      <section class="dashboard-section">
        <h2>Table Relationships</h2>
        <div class="row">

          <div class="col-md-4">
            <div class="db-card">
              <div class="card-header">One-to-One</div>
              <div class="card-body">${oneToOneHTML}</div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="db-card">
              <div class="card-header">One-to-Many</div>
              <div class="card-body">${oneToManyHTML}</div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="db-card">
              <div class="card-header">Many-to-Many</div>
              <div class="card-body">${manyToManyHTML}</div>
            </div>
          </div>

        </div>
      </section>

      <section class="dashboard-section">
        <h2>Complete Table Structure</h2>
        <div class="db-card">
          <div class="card-header">${database} Schema</div>
          <div class="card-body">
            <table class="db-table">
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Primary Key</th>
                  <th>Foreign Keys</th>
                  <th>Records</th>
                </tr>
              </thead>
              <tbody>
                ${tableRowsHTML}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </section>
  `;
}
