
const socket = io();
const app = new Vue({
    el: '#to-do-app',
    data: {
        projects:[],
        currentProject:{},
        currentToDo: {},
        showProject:false,
        newToDoDesc:'',
        newProjectName:''
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
            socket.emit('add-todo', { projectID: app.currentProject.id, app: this.newToDoDesc, completed: false })
        },
        deleteToDo: function (){
            console.log("delete")
        },
        completeToDo: function() {
            //need to figure out why the checkbox wont show in the table

            if(!this.currentProject)
                return
            console.log("CLICK CLICK")
            this.currentToDo.completed = !this.currentToDo.completed
            socket.emit('set-todo', { projectID: app.currentProject.id, todoObj: app.currentToDo})
        }
    },
    components: {
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