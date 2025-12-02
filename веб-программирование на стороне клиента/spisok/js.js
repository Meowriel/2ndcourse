let deleteTask = function(btn) {
        let li = btn.closest('.task-list__item');
        if (li) {
            if (confirm('Are you sure?'))
                li.remove();
        }
    }
    //let form = document.forms.taskEditForm;
let editableTask;
let editTask = function(btn) {
    let li = btn.closest('.task-list__item');
    if (li) {
        editableTask = li;

        let desc = li.querySelector('.task-list__description');
        let hiprio = li.querySelector('.task-list__hiprio');

        if (desc) {
            let form = document.forms.taskEditForm;
            form.elements.task_description.value = desc.innerText;
            form.elements.task_hiprio.checked = !!hiprio.innerText;

        }
    }
    var card = document.getElementsByClassName('edit-form')[0];
    card.style.opacity = '1';
}

let saveTask = function() {
    let form = document.forms.taskEditForm;

    if (editableTask) {
        let desc = editableTask.querySelector('.task-list__description');
        let hiprio = editableTask.querySelector('.task-list__hiprio');

        if (desc) {
            desc.innerText = form.elements.task_description.value;
            if (form.elements.task_hiprio.checked) {
                hiprio.innerHTML = "<img src='img/hiprio.svg' />";
            } else {
                hiprio.innerText = '';
            }
        }
    } else if (mainList) {
        let newItem = mainList.querySelector('li:first-child').cloneNode(true);

        console.log(newItem);

        let desc = newItem.querySelector('.task-list__description');
        let hiprio = newItem.querySelector('.task-list__hiprio');

        if (desc) {
            desc.innerText = form.elements.task_description.value;
            if (form.elements.task_hiprio.checked) {
                hiprio.innerHTML = "<img src='img/hiprio.svg' />";
            } else {
                hiprio.innerText = '';
            }
        }
        mainList.append(newItem);
    }
    var card = document.getElementsByClassName('edit-form')[0];
    card.style.opacity = '0';
}

let mainList;

let addTask = function(btn) {
    let form = document.forms.taskEditForm;
    form.reset();
    editableTask = null;
    var card = document.getElementsByClassName('edit-form')[0];
    card.style.opacity = '1'
    mainList = btn.closest('.list-container').querySelector('.task-list');
}

let cancelForm = function(btn) {
    var card = document.getElementsByClassName('edit-form')[0];
    card.style.opacity = '0'
}

function done(btn) {
    let li = btn.parentNode.parentNode
    let span = li.querySelector(".task-list__description")
    let edit = li.querySelector(".edit")
    let del = li.querySelector(".delete")

    if (btn.checked) {
        span.style.opacity = ".3"
        span.style.textDecoration = "line-through"
        edit.style.opacity = ".3"
        del.style.opacity = ".3"
    } else {
        span.style.opacity = "1"
        span.style.textDecoration = "inherit"
        edit.style.opacity = "1"
        del.style.opacity = "1"
    }
}