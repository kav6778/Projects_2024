document.addEventListener('DOMContentLoaded', function() {
    const taskContainers = document.querySelectorAll('.col-md-12');
    const categories = ['Personal', 'Work', 'Grocery List'];
     // Simulated user data - replace this with actual data fetching logic
     const userData = {
        username: "Kavin",
        profilePicUrl: "https://img.logoipsum.com/300.svg"
    };

    // Function to update the user profile in the header
    function updateUserProfile() {
        const userProfileDiv = document.querySelector('.user-profile');
        const profilePic = userProfileDiv.querySelector('.profile-pic');
        const username = userProfileDiv.querySelector('.username');

        profilePic.src = userData.profilePicUrl;
        username.textContent = userData.username;
    }

    // Call the function to update the profile
    updateUserProfile();

    taskContainers.forEach(container => {
        const addTaskButton = container.querySelector('.addTaskButton');
        const taskInput = container.querySelector('.taskInput');
        const taskList = container.querySelector('.taskList');

        addTaskButton.addEventListener('click', () => addTask(taskInput, taskList));
    });

    function addTask(taskInput, taskList) {
        let taskText = taskInput.value.trim();

        if (taskText) {
            let newTask = { 
                id: Date.now(), 
                title: taskText,
                category: 'Personal'  // Default category
            };

            let newCard = createTaskCard(newTask);
            taskList.appendChild(newCard);

            taskInput.value = '';
            updateCategoryBadges();
        }
    }

    function createTaskCard(task) {
        let card = document.createElement('div');
        card.className = 'card-body-task rounded-3 mb-3';
        card.dataset.id = task.id;
        card.innerHTML = `
            <ul class="list-unstyled rounded-3 my-3" style="background-color:rgba(66,66,66,.8);">
                <li class="md-3 mx-3 my-3">
                    <small class="text-white-50">My lists > <span class="task-category">${task.category}</span></small>
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <input type="radio" class="me-2">
                            <span class="text-white task-title">${task.title}</span>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-link text-white" type="button" id="dropdownMenuButton-${task.id}" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton-${task.id}">
                                <li><a class="dropdown-item edit-task" href="#">Edit</a></li>
                                <li><a class="dropdown-item delete-task" href="#">Delete</a></li>
                                <li><a class="dropdown-item change-category" href="#">Change Category</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        `;

        card.querySelector('.edit-task').addEventListener('click', function(e) {
            e.preventDefault();
            editTask(task.id);
        });

        card.querySelector('.delete-task').addEventListener('click', function(e) {
            e.preventDefault();
            deleteTask(task.id);
        });

        card.querySelector('.change-category').addEventListener('click', function(e) {
            e.preventDefault();
            changeCategory(task.id);
        });

        return card;
    }

    function changeCategory(taskId) {
        const taskElement = document.querySelector(`.card-body-task[data-id="${taskId}"]`);
        if (taskElement) {
            const currentCategory = taskElement.querySelector('.task-category').textContent;
            const categorySelect = createCategorySelect(currentCategory);
            
            taskElement.querySelector('.task-category').replaceWith(categorySelect);
            
            categorySelect.focus();
            
            categorySelect.addEventListener('change', function() {
                const newCategory = this.value;
                const newCategorySpan = document.createElement('span');
                newCategorySpan.className = 'task-category';
                newCategorySpan.textContent = newCategory;
                this.replaceWith(newCategorySpan);
                
                updateCategoryBadges();
            });
        }
    }

    function createCategorySelect(currentCategory) {
        const select = document.createElement('select');
        select.className = 'form-select form-select-sm';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            if (category === currentCategory) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        return select;
    }

    function deleteTask(taskId) {
        let taskElement = document.querySelector(`.card-body-task[data-id="${taskId}"]`);
        if (taskElement) {
            taskElement.remove();
            updateCategoryBadges();
        }
    }

    function editTask(taskId) {
        const taskElement = document.querySelector(`.card-body-task[data-id="${taskId}"]`);
        if (taskElement) {
            const taskTitleElement = taskElement.querySelector('.task-title');
            const currentTitle = taskTitleElement.textContent;

            // Create an input field
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = currentTitle;
            inputField.className = 'form-control';

            // Replace the task title with the input field
            taskTitleElement.replaceWith(inputField);

            // Focus on the input field
            inputField.focus();

            // Add event listener for when the user is done editing
            inputField.addEventListener('blur', () => saveEditedTask(taskId, inputField, taskTitleElement));
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveEditedTask(taskId, inputField, taskTitleElement);
                }
            });
        }
    }

    function saveEditedTask(taskId, inputField, taskTitleElement) {
        const newTitle = inputField.value.trim();
        if (newTitle) {
            taskTitleElement.textContent = newTitle;
            inputField.replaceWith(taskTitleElement);
            // Here you would typically update the task's title in your data structure or backend
            console.log(`Task ${taskId} title changed to ${newTitle}`);
        } else {
            // If the new title is empty, revert to the original title
            inputField.replaceWith(taskTitleElement);
        }
    }

    function updateCategoryBadges() {
        const categoryItems = document.querySelectorAll('.AppSidebarGroupsItems_item a');
        categoryItems.forEach(item => {
            const categoryName = item.textContent.trim().split(' ')[0];
            const count = document.querySelectorAll(`.task-category:not(select)`).length;
            
            let badge = item.querySelector('.AppSidebarGroupsItems_item_badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'AppSidebarGroupsItems_item_badge';
                item.appendChild(badge);
            }
            badge.textContent = count > 0 ? count : '';
        });
    }

    updateCategoryBadges(); // Initial update of badges
});


