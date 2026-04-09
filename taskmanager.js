let tasks  = [];
let nextId = 1;

const taskCount 	 = document.getElementById("taskcounterbadge");
const priorityFilter = document.getElementById("prioFilter");
const modal 		 = document.getElementById("taskModal");
const id 			 = document.getElementById("taskID");
const status		 = document.getElementById("taskStatus");
const title 		 = document.getElementById("taskTitle");
const desc 			 = document.getElementById("taskDesc");
const prio 			 = document.getElementById("taskPrio");
const date 			 = document.getElementById("taskDate");
const save 			 = document.getElementById("savetaskBtn")
const cancel 		 = document.getElementById("canceltaskBtn");

const list = {
	todo 	   : document.getElementById("todo");
	inprogress : document.getElementById("inprogress");
	done 	   : document.getElementById("done");
}

