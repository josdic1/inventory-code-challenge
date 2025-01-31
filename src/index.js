const init = () => {

  // DOM Elements
  const inventoryForm = document.getElementById('inventory-form')
  const inventoryItem = document.getElementById('inventory-item')
  const inventoryList = document.getElementById('inventory-list')

  // Stateful Variables
  let items = []
  let formData = {}
  let selectedId = ''

  // Fetch list on load
  fetchItems()

  // Event Listeners


  /** --------------------- HANDLER FUNCTIONS --------------------- **/


  /** --------------------- RENDER FUNCTIONS --------------------- **/
  function renderItemList(listData) {

    const list = listData.map(item => (
      `<tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.room}</td>
        <td>${item.description}</td>
        <td>${item.family}</td>
        <td>
          <button type='button' id='edit-${item.id}' name="edit" >Edit</button>
        </td>
        <td>
        <button type='button' id='del-${item.id}' name="del" >Del</button>
        </td>
      </tr>`
    ))

    const inventoryTable =
      `<table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Room</th>
            <th>Desc.</th>
            <th>Type</th>
            <th>Edit</th>
            <th>Del</th>
          </tr>
        </thead>
        <tbody>
          ${list.join('')}
        </tbody>
      </table>`

    inventoryList.innerHTML = inventoryTable
  }



  /** --------------------- API FUNCTIONS --------------------- **/
  async function fetchItems() {
    try {
      const r = await fetch(`http://localhost:3000/items`)
      if (!r.ok) {
        throw new Error('error fetching')
      }
      const data = await r.json()
      items = data
      renderItemList(data)
    } catch (error) { console.error(error) }
  }


}

window.addEventListener("DOMContentLoaded", init)


