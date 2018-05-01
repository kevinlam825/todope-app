// Components
//Bar for the top of the page. Contains login/logout/register and an admin page
const navBarComponent={
    template: ` <div class="nav-bar">
                    <button v-if='logged' type='button' v-on:click='login()'>Login</button>
                    <button v-else type='button' v-on:click='logout()'>Logout</button>
                </div>`,
    props:['user']
}

const registrationComponent={
    template: `<script type="text/x-template" id="modal-template">
                    <transition name="modal">
                    <div class="modal-mask">
                        <div class="modal-wrapper">
                        <div class="modal-container">
                
                            <div class="modal-header">
                            <slot name="header">
                                default header
                            </slot>
                            </div>
                
                            <div class="modal-body">
                            <slot name="body">
                                default body
                            </slot>
                            </div>
                
                            <div class="modal-footer">
                            <slot name="footer">
                                default footer
                                <button class="modal-default-button" @click="$emit('close')">
                                OK
                                </button>
                            </slot>
                            </div>
                        </div>
                        </div>
                    </div>
                    </transition>
            </script>`
}

const adminComponent={

}

const loginComponent={

}

//MIGHT NOT NEED THIS ONE
const logoutComponent={

}


const socket = io();
const app = new Vue({
    el: '#to-do-app',
    data: {
        user:'',
        logged:false,
        projects:[],
        currentProject:{},
        showProject:false,
        newToDoDesc:'',
        newProjectName:'',

        //MODAL
        showRegisterModal:false,
        showLoginModal:false
    },
    methods: {
        addProject: function () {
            console.log(app.newProjectName)
            socket.emit('add-project',app.newProjectName)
            // send project and add it to the list || db
        },
        selectProject: function (id) {
            console.log("app.js: selectProject(): call")
            app.currentProject = app.projects.find( project => {
                return project.id === id;
            });
            console.log("app.js: selectProject: app.currentProject: ", app.currentProject)
            console.log("app.js: selectProject: id: ", id)
            app.showProject = true;
        },
        removeCompletedToDos: function () {
            if (!this.currentProject)
                return

            socket.emit('remove-completed-todos', this.currentProject.id)
        },
        addToDo: function () {
            if (!this.newToDoDesc)
                return

            console.log("app.js: addToDo: app.currentProject: ", app.currentProject)
            socket.emit('add-todo', { projectID: app.currentProject.id, name: this.newToDoDesc, completed: false })
        },
        deleteToDo: function (){
            console.log("delete")
        },
        completeToDo: function(id) {
            //need to figure out why the checkbox wont show in the table

            console.log("completeToDo: id: ", id)
            if(!this.currentProject || id==null)
                return
            console.log("CLICK CLICK")
            const index = this.currentProject.toDoList.findIndex(elem => elem._id == id)
            this.currentProject.toDoList[index].completed = !this.currentProject.toDoList[index].completed 
            socket.emit('set-todo', { projectID: app.currentProject.id, todoObj: app.currentProject.toDoList[index]})
        },
        register: function(){
            console.log("CREATED THE USER")
        },
        login: function(){
            console.log("LOGIN USER")
        },
        logout: function(){
            console.log("LOGOUT USER")   
        }
    },
    components: {
        'nav-component':navBarComponent
    }
});


// when user first opens up browser to obtain their projects.
socket.on('refresh-projects', projects => {
    app.projects = projects

    if(app.currentProject.name == null) return
    console.log("app.js: refresh-projects (pre): app.currentProject:", app.currentProject)
    const index = app.projects.findIndex(elem => elem._id == app.currentProject._id)
    if(index==-1) {
        console.log("Can't find current project in the current projectlist with index: " + index)
    } else {
        // app.currentProject = app.projects[index]
        app.currentProject = app.projects.find(elem => elem._id == app.currentProject._id)
        console.log("app.js: refresh-projects (post): app.currentProject:", app.currentProject)
        console.log("app.js: refresh-projects (post): index:", index)
    }
    
    console.log(projects)
});

socket.on('send-current-project', currentProject => {
    app.currentProject = currentProject
});

//socket.on... when the server sends to the client
//socket.emit when client sends to server