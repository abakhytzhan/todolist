'use strict';

document.addEventListener('DOMContentLoaded', () => {

function alert(message) {
    const modal = document.querySelector('.modal');
    modal.classList.toggle('inactive');
    modal.querySelector('.file').textContent = "🌐 file://" + window.location.href;
    modal.querySelector('.task').innerHTML = `<img src="img/bell.png"><span> Не забудь: ${message}</span>`;
    document.querySelector('.overlay').classList.toggle('inactive');
    const modalBtn = modal.querySelector('.ok');
    modalBtn.addEventListener('click', function confirm() {
        modal.classList.add('inactive');
        document.querySelector('.overlay').classList.toggle('inactive');
        modalBtn.removeEventListener('click', confirm);
    });
}

let todos = [];
let id = 1;
let info = "created";

const btn = document.querySelector('button');
const textarea = document.querySelector(".textarea1");
const list1 = document.querySelector('.list1');
const list2 = document.querySelector('.list2');
const paragraph = document.querySelector('p');

textarea.addEventListener('input', function() {
    btn.disabled = false;
    btn.style.opacity = 1;
    if (textarea.value === "") {
        btn.disabled = true;
        btn.style.opacity = 0.8;
    }
});

textarea.addEventListener('keypress', function(event) {
    if (event.which == 13) {
        event.preventDefault();
    }
    let text = textarea.value.trim();
    if ( text !== "" && event.which == 13) {
        addItem();
    }
});

btn.addEventListener('click', function() {
    let text = textarea.value.trim();
    if ( text !== "") {
        addItem();
    }
});

function addItem() {
    createNewTodo();
    let todos = getAllTodos();
    renderTodoList(todos);

    paragraph.style.display = 'none';
    let text = textarea.value;
    setTimeout(() => alert(`${text}`), 10000);
    textarea.value = "";
    btn.disabled = true;
    btn.style.opacity = 0.8;
}

function deleteItem(element) {
    deleteTodo(element);
    todos = getAllTodos();
    renderTodoList(todos);
}

function editItem(element) {
    updateTodo(element);   
}

function doneItem(element) {
    changeList(element);
    setTimeout(() => {
        todos = getAllTodos();
        renderTodoList(todos);
    }, 1000);
}

function changeList(element) {
    setTimeout(() => {
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id == element.dataset.id) {
                todos[i].mainList = false;
                break;
            }
        }
    }, 1000);       
}

function createNewTodo() {
    const date = `created ${generateDate()}`;
    const id = generateID();
    const description = textarea.value;
    let newTodo = {
        id: id,
        content: description,
        date: date,
        mainList: true,
    }
    todos[todos.length] = newTodo;
}

function renderTodoList(todos) {
    list1.querySelectorAll('.edit img').forEach(elem => elem.removeEventListener('click', editItem));
    list1.querySelectorAll('.delete img').forEach(elem => elem.removeEventListener('click', deleteItem));
    list1.querySelectorAll('label').forEach(elem => elem.removeEventListener('click', doneItem));

    list2.querySelectorAll('.edit img').forEach(elem => elem.removeEventListener('click', editItem));
    list2.querySelectorAll('.delete img').forEach(elem => elem.removeEventListener('click', deleteItem));
    list2.querySelectorAll('label').forEach(elem => elem.removeEventListener('click', doneItem));

    list1.length = 0;
    list2.length = 0;
    list1.innerHTML = "";
    list2.innerHTML = "";
        
    for (let i = todos.length - 1; i >= 0; i--) {
        const element = document.createElement('li');
        element.classList.add('item');
        element.dataset.id = `${todos[i].id}`;
        element.innerHTML = 
        `<div class="wrapper">
            <div class="done">
                <input type="checkbox" id=${todos[i].id} />
                <label for=${todos[i].id}></label>
            </div>
            <div class="text">${todos[i].content}</div>
            <textarea name="" id="" cols="30" class="textarea2 inactive"></textarea>
            <div class="edit"><img src="img/image120.png" alt="edit"></div>
            <div class="delete"><img src="img/image114.png" alt="delete"></div>
            <div class="save inactive"><span>Сохранить</span></div>
        </div>
        <div class="date">${todos[i].date}</div>
        <div class="line"></div>`;

        if (todos[i].mainList) {
            list1.append(element);
        } else {
            const textElem = element.querySelector('.text');
            textElem.innerHTML = `<del>${textElem.textContent}</del>`;
            element.querySelector('label').style.display = "none";
            element.querySelector('.edit img').style.display = "none";
            list2.append(element);
        }

        element.querySelector('.edit img').addEventListener('click', () => {
           editItem(element);
        });
        element.querySelector('.delete img').addEventListener('click', () => {
            deleteItem(element);
        });
        element.querySelector('label').addEventListener('click', () => {
           doneItem(element);
        });
    }
}

function deleteTodo(element) {
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id == element.dataset.id) {
            todos.splice(i, 1);
            element.remove();
        }
    }  
    if (todos.length === 0) {
        paragraph.style.display = 'block';
    }
}

function updateTodo(element) {
    toggleMode(element);
    const saveBtn = element.querySelector('.save');
    const textarea2 = element.querySelector('.textarea2');
    const textElem = element.querySelector('.text');
        
    textarea2.value = textElem.textContent;
    textElem.classList.toggle('inactive');
    textarea2.classList.toggle('inactive');
        
    saveBtn.addEventListener('click', saveFunc);  
    textarea2.addEventListener('keypress', keyPressFunc);

    function removeListener() {
        saveBtn.removeEventListener('click', saveFunc);
        textarea2.removeEventListener('keypress', keyPressFunc);
    }

    function saveFunc() {
        let text = textarea2.value.trim();
        if (text !== "") {
            let content = textarea2.value;
        textarea2.classList.toggle('inactive');
        textElem.classList.toggle('inactive');
        toggleMode(element);
        changeContentAndDate(element, content);
        removeListener();
        todos = getAllTodos();
        renderTodoList(todos);
        }
    }

    function keyPressFunc(event) {
        if (event.which == 13) {
            event.preventDefault();
        }
        if (textarea2.value !== "" && event.which == 13) {
            saveFunc();
        }
    }

    function changeContentAndDate(element, content) {
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id == element.dataset.id) {
                todos[i].content = content;
                info = "last update";
                todos[i].date = `${info} ${generateDate()}`;
            }
        }
    }
}

function toggleMode(element) {
    element.querySelector('.done').classList.toggle('inactive');
    element.querySelector('.edit').classList.toggle('inactive');
    element.querySelector('.delete').classList.toggle('inactive');
    element.querySelector('.save').classList.toggle('inactive');
}

function getAllTodos() {
    return todos;
}

function generateDate() {
    const now = new Date();
    let minutes = now.getMinutes();
    
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    const date = now.getDate() + " " + now.toLocaleString("en-US", {month: "short"}) + " " + now.getFullYear() + " " + now.getHours() + ":" + minutes;
    return date;
}

function generateID() {
    return id++;
}
      
});