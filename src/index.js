const init = () => {

  // DOM Elements
  const inventoryForm = document.getElementById('inventory-form')
  const inventoryItem = document.getElementById('inventory-item')
  const inventoryList = document.getElementById('inventory-list')
  const legendEditMode = document.getElementById('edit-mode')

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
  inventoryForm.addEventListener('submit', handleSubmitClick)
  inventoryForm.addEventListener('input', handleFormInput)
  /** --------------------- HANDLER FUNCTIONS --------------------- **/

  function handleListClick(e) {
    const { id } = e.target
    const btn = id.split('-')[0]
    const btnId = id.split('-')[1]
    const itemObj = items.find(item => item.id === btnId)

    if (btn === 'edit') {
      inEditMode = true
      selectedId = btnId
      legendEditMode.textContent = inEditMode
      document.getElementById('name').value = itemObj.name
      document.getElementById('room').value = itemObj.room
      document.getElementById('description').value = itemObj.description
      document.getElementById('family').value = itemObj.family

    } else {
      if (btn === 'del') {
        deleteItem(itemObj.id)
      }
    }
  }

  function handleFormInput(e) {

  }


  function handleSubmitClick(e) {
    e.preventDefault()
    console.log(formData)
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
      <button type='submit' id='submit'> Submit </button>
         <button type='button' id='clear'> Clear </button>
      `

    inventoryForm.innerHTML = formHtml

    const clear = document.getElementById('clear')
    clear.addEventListener('click', function () {
      document.getElementById('name').value = ''
      document.getElementById('room').value = ''
      document.getElementById('description').value = ''
      document.getElementById('family').value = ''
      inEditMode = false
    })
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


