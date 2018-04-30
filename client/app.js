
const socket = io();
const app = new Vue({
    el: '#to-do-app',
    data: {
        projects:[],
        currentProject:{},
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
            app.currentProject = app.projects.find( project => {
                return project.id === id;
            });
            app.showProject = true;
        },
        removeCompletedToDos: function () {
            console.log(app.currentProject.id)
            //send the id of the project 
        },
        addToDo: function () {
            console.log(app.newToDoDesc)
            //send project id and add the todo to the toDoList
        },
        deleteToDo: function (){
            console.log("delete")
        },
        completeToDo: function() {
            //need to figure out why the checkbox wont show in the table
            //send the todo id and set the todo.complete field to true
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

//socket.on... when the server sends to the client
//socket.emit when client sends to server