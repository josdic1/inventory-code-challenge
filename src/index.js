const init = () => {

  // DOM Elements
  const inventoryForm = document.getElementById('inventory-form')
  const inventoryItem = document.getElementById('inventory-item')
  const inventoryList = document.getElementById('inventory-list')

  // Stateful Variables
  let inEditMode = false
  let items = []
  let formData = {
    name: '',
    room: '',
    description: '',
    family: '',
  }
  let selectedId = ''

  // Fetch list on load
  fetchItems()

  // Event Listeners
  inventoryList.addEventListener('click', handleListClick)

  /** --------------------- HANDLER FUNCTIONS --------------------- **/

  function handleListClick(e) {
    const { id } = e.target
    const btn = id.split('-')[0]
    const btnId = id.split('-')[1]
    selectedId = btnId
    const itemObj = items.find(item => item.id === btnId)

    if (btn === 'edit') {
      inEditMode = true
      formData = {
        name: itemObj.name,
        room: itemObj.room,
        family: itemObj.family,
        description: itemObj.description
      }
      populateForm(itemObj)
    } else {
      if (btn === 'del') {
        deleteItem(itemObj.id)
      }
    }
  }



  /** --------------------- RENDER FUNCTIONS --------------------- **/

  function renderForm() {

    const formHtml =
      `
      <label formHtml='nameInput'> Name </label>
      <input type='text' id='name' name='nameInput' placeholder='Name goes here...' />
      <label formHtml='roomInput'> Room </label>
       <input type='text' id='room' name='roomInput' placeholder='Room goes here...' />
      <label formHtml='descriptionInput'> Desc. </label>
       <input type='text' id='description' name='descriptionInput' placeholder='Desc. goes here...' />
      <label formHtml='familyInput'> Type </label>
      <input type='text' id='family' name='familyInput' placeholder='Type goes here...' />
      <button type='submit'> Submit </button>
      `

    inventoryForm.innerHTML = formHtml
  }

  let nameVal;
  let roomVal;
  let descriptionVal;
  let familyVal;

  function populateForm(obj) {
    nameVal = document.getElementById('name').value = obj.name
    roomVal = document.getElementById('room').value = obj.room
    descriptionVal = document.getElementById('description').value = obj.description
    familyVal = document.getElementById('family').value = obj.family
  }


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
      renderForm()
    } catch (error) { console.error(error) }
  }

  async function deleteItem(id) {
    try {
      const r = await fetch(`http://localhost:3000/items/${id}`, {
        method: 'DELETE'
      })
      if (!r.ok) {
        throw new Error('error')
      }
      const data = await r.json()
      const updatedList = items.filter(item => item.id !== id)
      items = updatedList
      renderItemList(updatedList)
    } catch (error) { console.error(error) }
  }


}

window.addEventListener("DOMContentLoaded", init)


