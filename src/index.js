import "./styles.css"

let lists = []

function addNewList(name, due = undefined, priority = false) {
    const newList = createList(name, due, priority)
    lists.push(newList)
    render()
}

function createList(listName, listDue = undefined, listPriority = false) {
    let name = listName
    const id = crypto.randomUUID()
    let due = listDue
    let priority = listPriority
    let tasks = []

    function addTask(name) {
        tasks.push(createTask(name))
    }
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id != id)
    }
    const remainingTasks = () => {
        return tasks.filter(task => task.complete === false).length
    }

    const togglePriority = () => priority = !priority
    
    return { name, id, due, priority, tasks, togglePriority, addTask, deleteTask, remainingTasks }
}

function createTask(taskName) {
    let name = taskName
    const id = crypto.randomUUID()
    let complete = false
    const toggleComplete = () => complete = !complete

    return { name, id, complete, toggleComplete }
}

const addListButton = document.getElementById("add-list-button")
const newListForm = document.getElementById("new-list-form")
const newListName = document.getElementById("new-list-name")
const newListDue = document.getElementById("new-list-due-date")
const newListPriority = document.getElementById("new-list-priority")

addListButton.addEventListener("click", () => {
    hideShow(newListForm)
})

newListForm.addEventListener("submit", e => {
    e.preventDefault()
    const listName = newListName.value
    console.log(`name ${listName}`)
    const listDue = newListDue.value
    console.log(`due ${listDue}`)
    const listPriority = newListPriority.value
    console.log(`prio ${listPriority}`)
    if (listName == null || listName === "") return
    addNewList(listName, listDue, listPriority)
    newListName.value = null
    newListDue.value = null
    newListPriority.checked = false
    hideShow(newListForm)
})

function render() {
    const listsContainer = document.getElementById("lists-container")
    listsContainer.replaceChildren()

    lists.forEach(list => {
        const listClone = document.getElementById("list-template").content.cloneNode(true)

        const listName = listClone.querySelector(".list-name")
        listName.innerText = list.name
    
        const tasksRemaining = listClone.querySelector(".tasks-remaining")
        tasksRemaining.innerText = 
            list.remainingTasks() == 1 ? "1 task remaining" : `${list.remainingTasks()} tasks remaining`
    
        const listDue = listClone.querySelector(".list-due")
        listDue.innerText = `Due ${list.due}`
    
        const tasksContainer = listClone.querySelector(".tasks-container")
    
        const newTaskForm = listClone.querySelector(".new-task-form")
        newTaskForm.dataset.listId = list.id
        newTaskForm.addEventListener("submit", e => {
            e.preventDefault()
            const list = lists.find(list => newTaskForm.dataset.listId == list.id)
            const newTaskName = newTaskForm.querySelector(".new-task-name").value
            if (newTaskName == null || newTaskName === "") return
            list.addTask(newTaskName)
            render()
        })

        const tasksList = listClone.querySelector(".tasks-list")

        list.tasks.forEach(task => {
            const taskClone = document.getElementById("task-item-template").content.cloneNode(true)
            const checkbox = taskClone.querySelector("input")
            checkbox.id = task.id

            const label = taskClone.querySelector("label")
            label.htmlFor = task.id
            label.innerText = task.name

            tasksList.appendChild(taskClone)
        })

        const listItemHeader = listClone.querySelector(".list-item-header")
        listItemHeader.addEventListener("click", () => {
            hideShow(tasksContainer)
        })
    
        listsContainer.appendChild(listClone)
    });
}

function hideShow(element) {
    element.style.display == "none" ? element.style.display = "" : element.style.display = "none"
}