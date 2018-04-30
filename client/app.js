
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
            console.log('addddd')
            socket.emit('add-project',app.newProjectName)
            // send project and add it to the list || db
        },
        selectProject: function (id) {
            app.currentProject = app.projects.find( project => {
                return project.id === id;
            });
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

            socket.emit('add-todo', { projectID: this.currentProject.id, description: this.newToDoDesc })
        },
        completeToDo: function() {
            //need to figure out why the checkbox wont show in the table

            if(!this.currentProject)
                return
        
            socket.emit('complete-todo', { projectID: this.currentProject.id, todoID: this.currentToDo.id})
        }
    },
    components: {
    }
});


// when user first opens up browser to obtain their projects.
socket.on('send-projects', projects => {
    app.projects = projects
    console.log(projects)
});

socket.on('send-current-project', currentProject => {
    app.currentProject = currentProject
});

//socket.on... when the server sends to the client
//socket.emit when client sends to server