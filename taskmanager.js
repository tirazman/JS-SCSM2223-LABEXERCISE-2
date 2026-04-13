let tasks  = [];
let nextId = 1;

const taskCount 	 = document.getElementById("taskcounterbadge");
const priorityFilter = document.getElementById("prioFilter");
const modal 		 = document.getElementById("taskModal");
const idInput 		 = document.getElementById("taskID");
const statusInput	 = document.getElementById("taskStatus");
const titleInput 	 = document.getElementById("taskTitle");
const descInput		 = document.getElementById("taskDesc");
const prioInput		 = document.getElementById("taskPrio");
const dateInput		 = document.getElementById("taskDate");

const list = {
	todo 	   : document.getElementById("todo-list");
	inprogress : document.getElementById("inprogress-list");
	done 	   : document.getElementById("done-list");
}

function updateCounter() {
	task.taskCount.textContent = tasks.length;
}
//Task 2 

function createTaskCard(taskObj) {
	const li = document.getElementById('li');
	li.classLi.add('taskCard');
	li.setAttribute('dataID', taskObj.id);
	li.setAttribute('dataPrio', taskObj.prio)

	// Title
	const headerRow = document.createElement('div');
	headerRow.classLi.add('cardHeaderRow');

	const title = document.createElement('h4');
	title.textContent = taskObj.title;
	title.classLi.add('taskTitle');
	title.addEventListener('dblclick', () => handleInlineEdit(title, taskObj.id));

	// Description
	const desc = document.createElement('p');
	desc.textContent = taskObj.description;
	desc.classLi.add('taskDesc');

	li.appendChild(headerRow);
	li.appendChild(desc);

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
	badge.classLi.add('badgePrio', badgeClass);

	headerRow.appendChild(title);
	headerRow.appendChild(badge);

	// Due Date
	if(taskObj.dueDate) {
		const date = document.createElement('span');
		date.textContent = '📅 Due: ' + taskObj.dueDate;
		date.classLi.add('taskDate');
		li.appendChild(date); 
	}

	// Buttons
	const actions = document.createElement('div');
	actions.classLi.add('cardAct');

	const editBtn = document.createElement('button');
	editBtn.textContent = '✏️ Edit';
	editBtn.classLi.add('editBtn');
	editBtn.setAttribute('dataAct', 'edit');
	editBtn.setAttribute('dataID', taskObj.id);

	const deleteBtn = document.createElement('button');
	deleteBtn.textContent = '🗑️ Delete';
	deleteBtn.classLi.add('deleteBtn');
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
		card.classLi.add('fade-out');
		setTimeout(() => {
			card.remove();
			tasks = tasks.filter(t => t.id !== taskId);
			updateCounter();
		}, 100);
	}
}

function editTask(taskId) {
	const task = tasks.find(t => t.id === taskId);
	if (!task) return ;

	idInput.value 	  = task.id;
	statusInput.value = task.status;
	titleInput.value  = task.title;
	descInput.value   = task.desc;
	prioInput.value   = task.prio;
	dateInput.value   = task.date;

	modal.classLi.remove('is-hidden');
}


function updateTask(taskId, updatedData) {
	const taskIndex = tasks.findIndex(t => t.id === taskId);
	if (taskIndex > -1){
		tasks[taskIndex] = {...tasks[taskIndex], ...updatedData };
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
	input.classLi.add('inLine-Edit-Input');

	const saveChange = () => {
		const newTitle = input.value.trim();
		if (newTitle !== "") {
			const task = tasks.find(t => t.id === taskId);
			if (tasks) task.title = newTitle;
		}
		if (input.parentNode) input.parentNode.replaceChild(titleElement, input);
	};

	input.addEventListener('blur', saveChange);
	input.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveChange();});

	titleElement.parentNode.replaceChild(input, titleElement);
	input.focus();
}

Object.value(lists).forEach(list => {
	todolist.addEventListener('click', function(event) {
		const action = event.target.getAttribute('dataAct');
		const idStr = event.target.getAttribute('dataID');
		if( !action || !idStr) return ;

		const taskId = parseInt(idStr,10);

		if (action == 'delete') deleteTask(taskId);
		if (action == 'edit') editTask(taskId);
	});
});

