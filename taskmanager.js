let tasks  = [];
let nextId = 1;

// DOM 
const taskCount 	 = document.getElementById("taskcounterbadge");
const priorityFilter = document.getElementById("prioFilter");
const modal 		 = document.getElementById("taskModal");

// Modal input 
const idInput 		 = document.getElementById("taskID");
const statusInput	 = document.getElementById("taskStatus");
const titleInput 	 = document.getElementById("taskTitle");
const descInput		 = document.getElementById("taskDesc");
const prioInput		 = document.getElementById("taskPrio");
const dateInput		 = document.getElementById("taskDate");

const list = {
	todo 	   : document.getElementById("todo-list"),
	inprogress : document.getElementById("inprogress-list"),
	done 	   : document.getElementById("done-list")
}

// update header badge
function updateCounter() {
	taskCount.textContent = tasks.length;
}

//Task 2 

function createTaskCard(taskObj) {
	const li = document.createElement('li');
	li.classList.add('taskCard');
	li.setAttribute('dataID', taskObj.id); // store id in html for easy retrieval
	li.setAttribute('dataPrio', taskObj.prio) // store priority for filter 

	// Header Row for title & prio badge
	const headerRow = document.createElement('div');
	headerRow.classList.add('cardHeaderRow');

	// Title
	const title = document.createElement('h4');
	title.textContent = taskObj.title;
	title.classList.add('taskTitle');
	title.addEventListener('dblclick', function() { 
		handleInlineEdit(title, taskObj.id);
	});

	// Priority Badge
	const badge = document.createElement('span');
	let prioText = 'Low';
	let badgeClass = 'badgeLow';

	if(taskObj.prio == 'high') {
		prioText = 'High';
		badgeClass = 'badgeHigh'
	}

	if(taskObj.prio == 'med') {
		prioText = 'Medium';
		badgeClass = 'badgeMed'
	}

	badge.textContent = prioText;
	badge.classList.add('badgePrio', badgeClass);

	headerRow.appendChild(title);
	headerRow.appendChild(badge);

	// Description
	const desc = document.createElement('p');
	desc.textContent = taskObj.description;
	desc.classList.add('taskDesc');

	li.appendChild(headerRow);
	li.appendChild(desc);

	
	// Due Date
	if(taskObj.dueDate) {
		const date = document.createElement('span');
		date.textContent = '📅 Due: ' + taskObj.dueDate;
		date.classList.add('taskDate');
		li.appendChild(date); 
	}

	// Buttons
	const actions = document.createElement('div');
	actions.classList.add('cardAct');

	// Edit Button
	const editBtn = document.createElement('button');
	editBtn.textContent = '✏️ Edit';
	editBtn.classList.add('editBtn');
	editBtn.setAttribute('dataAct', 'edit');
	editBtn.setAttribute('dataID', taskObj.id);

	// Delete Button
	const deleteBtn = document.createElement('button');
	deleteBtn.textContent = '🗑️ Delete';
	deleteBtn.classList.add('deleteBtn');
	deleteBtn.setAttribute('dataAct', 'delete');
	deleteBtn.setAttribute('dataID', taskObj.id);

	actions.appendChild(editBtn);
	actions.appendChild(deleteBtn);
	li.appendChild(actions);

	return li;
}

function addTask(columnId, taskObj) {
	taskObj.id 	   = nextId++;
	taskObj.status = columnId;
	tasks.push(taskObj);

	const card = createTaskCard(taskObj);
	list[columnId].appendChild(card);
	updateCounter();
	applyFilter();
}

function deleteTask(taskId) {
	const card = document.querySelector('.taskCard[dataID="' + taskId + '"]');
	if (card) {
		card.classList.add('fade-out');
		setTimeout(function() {
			card.remove();
			tasks = tasks.filter(function(t){ return t.id !== taskId; });
			updateCounter();
		}, 1000);
	}
}

function editTask(taskId) {
	const task = tasks.find(function(t){ return t.id === taskId;});
	if (!task) return ;

	idInput.value 	  = task.id;
	statusInput.value = task.status;
	titleInput.value  = task.title;
	descInput.value   = task.description;
	prioInput.value   = task.prio;
	dateInput.value   = task.dueDate;

	modal.classList.remove('is-hidden');
}


function updateTask(taskId, updatedData) {
	const taskIndex = tasks.findIndex(function(t){ return t.id === taskId; });
	if (taskIndex > -1){
		tasks[taskIndex].title 		 = updatedData.title;
		tasks[taskIndex].description = updatedData.description;
		tasks[taskIndex].prio        = updatedData.prio;
		tasks[taskIndex].dueDate     = updatedData.dueDate;

		const oldCard = document.querySelector('.taskCard[dataID="' +taskId+ '"]');
		const newCard = createTaskCard(tasks[taskIndex]);

		if (oldCard && oldCard.parentNode) {
			oldCard.parentNode.replaceChild(newCard, oldCard);
		}
		applyFilter();
	}
}


function handleInlineEdit(titleElement, taskId) {
	const input = document.createElement('input');
	input.type = 'text';
	input.value = titleElement.textContent;
	input.classList.add('inLine-Edit-Input');

	const saveChange = function() {
		const newTitle = input.value.trim();
		if (newTitle !== "") {
			const task = tasks.find(function(t){ return t.id === taskId;});
			if (task) { task.title = newTitle; }
			titleElement.textContent = newTitle;
		}
		if (input.parentNode) input.parentNode.replaceChild(titleElement, input);
	};

	input.addEventListener('blur', saveChange);
	input.addEventListener('keydown', function(e){ if (e.key === 'Enter') saveChange();});

	titleElement.parentNode.replaceChild(input, titleElement);
	input.focus();
}

Object.value(list).forEach(function(todoList) {
	todoList.addEventListener('click', function(event) {
		const action = event.target.getAttribute('dataAct');
		const idStr = event.target.getAttribute('dataID');
		if( !action || !idStr) return ;

		const taskId = parseInt(idStr,10);

		if (action == 'delete') deleteTask(taskId);
		if (action == 'edit') editTask(taskId);
	});
});

function openModal(columnId) {
	idInput.value 	  = '';
	statusInput.value = columnId;
	titleInput.value  = '';
	descInput.value   = '';
	prioInput.value   = 'med';
	dateInput.value   = '';
	modal.classList.remove('is-hidden');
}

document.getElementById('canceltaskBtn').addEventListener('click', function() {
	modal.classList.add('is-hidden');
});

document.getElementById('savetaskBtn').addEventListener('click', function() {
	const title = titleInput.value.trim();
	if(!title) return alert('Title is required');

	const data = {
		title : title,
		description : descInput.value.trim(),
		prio : prioInput.value,
		dueDate : dateInput.value,
		date : dateInput.value
	};

	const idVal = idInput.value;
	if (idVal) updateTask(parseInt(idVal,10), data);
	else addTask(statusInput.value, data);

	modal.classList.add('is-hidden');
});

// Filtering
priorityFilter.addEventListener('change', applyFilter);

function applyFilter() {
	const selected = priorityFilter.value;
	document.querySelectorAll('.taskCard').forEach(function(card) {
		const priority = card.getAttribute('dataPrio');
		card.classList.toggle('is-hidden', selected !== 'all' && priority !== selected);
	});
}

// Clear All button
document.getElementById('clearAllBtn').addEventListener('click', function(){
	const doneCards = list.done.querySelectorAll('.taskCard');
	doneCards.forEach(function(card,i) {
		setTimeout(function(){
			deleteTask(parseInt(card.getAttribute('dataID'),10));
		}, i*100);
	});
});