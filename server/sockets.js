const Project = require('../models/project.js');
const ToDo = require('../models/todo.js');
const User = require('../models/user.js');


module.exports = (server,db) => {
    const io = require('socket.io')(server);
    // const projects = [];
    let counter = 0

    // const projects = [
    //     new Project(counter++,'berlin wall','',[ new ToDo(0,'divide germany into 4 parts','',false)]),
    //     new Project(counter++, 'robot waifus','', [new ToDo(0,'robot titties','',false)]),
    //     new Project(counter++, 'laser beam sharks','', [new ToDo(0,'find sharks','',false)]),
    // ];

    // when the page is loaded in the browser the connection event is fired
    io.on('connection', socket => {


        db.getAllProjects().then(projects =>
            // on making a connection refresh all the projects
            socket.emit('refresh-projects', projects))

        socket.on('add-project', projectname => {
            //add the project to the list
            console.log("add project")
            const project = new Project(counter++, projectname, '', [])
            // projects.push(project)
            db.addProject(project).then(project => {
                db.getAllProjects().then(projects => {
                    socket.emit('refresh-projects', projects)
                    console.log(projects)
                })
            })
        });
        socket.on('remove-completed-todos', data => {
            projects.forEach(project => {
                if(project.id == data){
                    project.toDoList.forEach(todo =>{
                        if(todo.completed == true){
                            const index = project.toDoList.indexOf(todo);
                            project.toDoList.splice(index, 1);
                        }
                    })
                    io.emit('send-current-project', project)
                }
            })
        });
        socket.on('add-todo', data => {
           //Create new ToDo
           projects.forEach(project =>{    //Iterate through all projects
            if(project.id == data.projectID) {
                project.toDoCounter++
                const newToDo = new ToDo(project.toDoCounter, data.description, false) 
                project.toDoList.push(newToDo)  //Add new todo to corresponding project
                io.emit('send-current-project', project)    //Refresh UI
            }
        })
        });
        socket.on('complete-todo', data => {
            // find the todo from its project and change it to completed
            projects.forEach(project =>{
                if(project.id == data.projectID){
                    project.toDoList.forEach(todo =>{
                        if(todo.id == data.todoID)
                            todo.completed = true
                    })
                }
                io.emit('send-current-project', project)
            })
        });
        socket.on('disconnect', () => {
        })
    })
}
