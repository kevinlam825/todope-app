const Project = require('../models/project.js');
const ToDo = require('../models/todo.js');

module.exports = (server) => {
    const io = require('socket.io')(server);
    // const projects = [];
    let counter =0
    const projects = [
        new Project(counter++,'berlin wall',[ new ToDo(0,'divide germany into 4 parts',false)]),
        new Project(counter++, 'robot waifus', [new ToDo(0,'robot titties',false)]),
        new Project(counter++, 'laser beam sharks', [new ToDo(0,'find sharks',false)]),
    ];

    // when the page is loaded in the browser the connection event is fired
    io.on('connection', socket => {

        // on making a connection send all the projects
        socket.emit('send-projects', projects);

        socket.on('add-project', projectname => {
            //add the project to the list
            console.log("add project")
            projects.push(new Project(counter++,projectname,[]))
            socket.emit('send-projects',projects);
        });
        socket.on('remove-completed-todos', data => {
            //remove the completed todos of a project
        });
        socket.on('add-todo', data => {
            // add a new todo to a specified project
        });
        socket.on('complete-todo', data => {
            // find the todo from its project and change it to completed
        });
        socket.on('disconnect', () => {
        })
    })
}
