const init = () => {

  // DOM Elements
  const inventoryForm = document.getElementById('inventory-form')
  const inventoryItem = document.getElementById('inventory-item')
  const inventoryFilter = document.getElementById('inventory-filter')
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

  let existingItem = {
    id: '',
    name: '',
    room: '',
    description: '',
    family: '',
  }

  let filterObj = {
    filterByName: '',
    filterByType: 'all'
  }

  // Fetch list on load
  fetchItems()

  // Event Listeners
  inventoryList.addEventListener('click', handleListClick)
  inventoryForm.addEventListener('submit', handleSubmitClick)
  inventoryForm.addEventListener('input', handleFormInput)

  /** --------------------- HANDLER FUNCTIONS --------------------- **/

  let nameVal;
  let roomVal;
  let descriptionVal;
  let familyVal;

  function handleListClick(e) {
    const { id } = e.target
    const btn = id.split('-')[0]
    const btnId = id.split('-')[1]
    const payload = items.find(item => item.id === btnId)
    existingItem = payload
    if (btn === 'edit') {
      inEditMode = true
      document.getElementById('edit-mode').textContent = inEditMode
      document.getElementById('name').value = payload.name
      document.getElementById('room').value = payload.room
      document.getElementById('description').value = payload.description
      document.getElementById('family').value = payload.family
    } else {
      if (btn === 'del') {
        deleteItem(existingItem.id)
      }
    }
  }


  function handleFilterInput(e) {
    let { id, value } = e.target;
    filterObj = {
      ...filterObj,
      filterByName: id === 'filterByName' ? filterByName.value : '',
      filterByName: id === 'filterByType' ? filterByType.value : ''
    };
    const originalList = items
    const currentList = items.filter(item => item.name.includes(filterObj.filterByName))
    renderItemList(currentList)
  }

  function handleClearFilter(e) {
    const { id } = e.target

    if (id === 'clearFilters') {
      const clearValName = document.getElementById('filterByName').value = ''
      const clearValType = document.getElementById('filterByType').value = 'all'
      filterObj = {
        filterByName: clearValName,
        filterByType: clearValType
      }
    }
  }


  function handleFormInput(e) {
    const { name, value } = e.target
    if (inEditMode) {
      const payload = {
        ...existingItem,
        [name]: value
      }
      existingItem = payload
    } else {
      const payload = {
        ...formData,
        [name]: value
      }
      formData = payload
    }
  }


  function handleSubmitClick(e) {
    e.preventDefault()
    if (inEditMode) {
      const updatedItem = existingItem
      updateItem(updatedItem)
      clearForm()
    }
    const newItem = formData
    createItem(newItem)
    clearForm()
  }



  /** --------------------- RENDER FUNCTIONS --------------------- **/

  function renderForm() {

    const formHtml =
      `
      <label formHtml='nameInput'> Name </label>
      <input type='text' id='name' name='name' placeholder='Name goes here...' />
      <label formHtml='roomInput'> Room </label>
       <input type='text' id='room' name='room' placeholder='Room goes here...' />
      <label formHtml='descriptionInput'> Desc. </label>
       <input type='text' id='description' name='description' placeholder='Desc. goes here...' />
      <label formHtml='familyInput'> Type </label>
      <input type='text' id='family' name='family' placeholder='Type goes here...' />
      <button type='submit' id='submit'> Submit </button>
         <button type='button' id='clear'> Clear </button>
      `

    inventoryForm.innerHTML = formHtml

    const clear = document.getElementById('clear')
    clear.addEventListener('click', clearForm)
  }


  function renderFilter() {

    const existingName = filterObj.filterByName || '';
    const existingType = filterObj.filterByType || 'all';

    const filterHtml =
      `<div id='filters'>
      <label> Filters: </label>
      <input type='text' id='filterByName' name='filterByName' placeholder='Start typing...' value="${existingName}" />
      <select id='filterByType' name='filterByType'>
        <option value="all" ${existingType === 'all' ? 'selected' : ''}>Show all</option>
        <option value="electronics accessories" ${existingType === 'electronics accessories' ? 'selected' : ''}>Electronics Accessories</option>
      </select>
      <button type='button' id='clearFilters' name='clearFilters'>⌫</button>
    </div>`

    inventoryFilter.innerHTML = filterHtml
    inventoryFilter.addEventListener('input', handleFilterInput)
    inventoryFilter.addEventListener('change', handleFilterInput)
    inventoryFilter.addEventListener('click', handleClearFilter)
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


  function clearForm() {
    document.getElementById('name').value = ''
    document.getElementById('room').value = ''
    document.getElementById('description').value = ''
    document.getElementById('family').value = ''
    inEditMode = false
    legendEditMode.textContent = inEditMode
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
      renderFilter()
      renderItemList(data)
      renderForm()
    } catch (error) { console.error(error) }
  }

  async function createItem(payload) {
    try {
      const r = await fetch(`http://localhost:3000/items/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (!r.ok) {
        throw new Error('error')
      }
      const data = await r.json()
      const updatedList = [...items, data]
      items = updatedList
      renderItemList(updatedList)
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

  async function updateItem(payload) {
    try {
      const r = await fetch(`http://localhost:3000/items/${payload.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (!r.ok) {
        throw new Error('error')
      }
      const data = await r.json()
      const updatedList = items.map(item => item.id === data.id ?
        data : item
      )
      items = updatedList
      renderItemList(updatedList)
    } catch (error) { console.error(error) }
  }


}

window.addEventListener("DOMContentLoaded", init)


