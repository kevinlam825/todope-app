const Project = require('../models/project.js');
const ToDo = require('../models/todo.js');

module.exports = (server) => {
    const io = require('socket.io')(server);
    // const projects = [];
    const projects = [
        new Project(0,'berlin wall',[ new ToDo(0,'divide germany into 4 parts',false)]),
        new Project(1, 'robot waifus', [new ToDo(0,'robot titties',false)]),
        new Project(2, 'laser beam sharks', [new ToDo(0,'find sharks',false)]),
    ];

    // when the page is loaded in the browser the connection event is fired
    io.on('connection', socket => {

        // on making a connection send all the projects
        socket.emit('send-projects', projects);

        socket.on('add-project', data => {
            //add the project to the list
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
