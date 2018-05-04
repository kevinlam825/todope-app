const Project = require('../models/project.js');
const ToDo = require('../models/todo.js');
const User = require('../models/user.js');


module.exports = (server, db) => {
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

        //THIS NEEDS TO BE CHANGED TO ANONYMOUS WHEN THE MODALS ARE WORKING
        socket.emit('anonymous-user',new User(1,'Anonymous','none','Admin'))
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
        socket.on('remove-completed-todos', projectID => {

            db.findProject(projectID).then(project => {
                if (project == null) {
                    console.log("Something seriously went wrong")
                    return
                }
   
                project.toDoList = project.toDoList.filter(todo => todo.completed == false)

                db.saveProject(project)
                    .then(_ => {
                        db.getAllProjects().then(projects => {
                            console.log("removing all compelted todos, about to call refresh-projects")
                            socket.emit('refresh-projects', projects)
                            console.log(projects)
                        })
                    })
            })
        });
        socket.on('add-todo', todo => {
            //Create new ToDo
            console.log("add todo")
            // db.addTodo(todo).then(project => {
            //     db.getAllProjects().then(projects => {
            //         socket.emit('refresh-projects', projects)
            //         console.log(projects)
            //     })
            // })

            // { projectID: this.currentProject._id, name: this.newToDoDesc, completed: false }

            console.log("todo.projectID = "+ todo.projectID)
            db.findProject(todo.projectID).then(project => {
                if(project == null) {
                    console.log("Something seriously went wrong")
                    return
                }
                const index = project.toDoList.findIndex(elem => elem._id == todo.todoID)
                if (index != -1) {
                    console.log("Todo already exists! TODO: add failure emit here: " + index)
                } else {
                    project.toDoList.push(todo)
                    db.saveProject(project)
                        .then(_ => {
                            db.getAllProjects().then(projects => {
                                console.log("Adding todo, about to call refresh-projects")
                                socket.emit('refresh-projects', projects)
                                console.log(projects)
                            })
                        })
                }
            })
        });

        socket.on('remove-todo', data => {
 
            db.findProject(data.projectID).then(project => {
                if (project == null) {
                    console.log("Something seriously went wrong")
                    return
                }

                project.toDoList = project.toDoList.filter(todo => todo._id != data.todoID)

                db.saveProject(project)
                    .then(_ => {
                        db.getAllProjects().then(projects => {
                            console.log("removing selected todo, about to call refresh-projects")
                            socket.emit('refresh-projects', projects)
                            console.log(projects)
                        })
                    })
            })
        });

        socket.on('set-todo', data => {
            
            db.findProject(data.projectID).then(project => {
                if(project==null) {
                    console.log("socket.js: findProject: FAIL")
                    return
                }
                console.log("data.todoObj: ", data.todoObj)
                const index = project.toDoList.findIndex(elem => elem._id == data.todoObj._id)
                if (index == -1) {
                    console.log("set-todo invalid project")
                } else {
                    project.toDoList[index] = data.todoObj
                    db.saveProject(project)
                        .then(project => {
                            db.getAllProjects().then(projects => {
                                socket.emit('refresh-projects', projects)
                                console.log(projects)
                            })
                        })
                }
            })


            // // find the todo from its project and change it to completed
            // projects.forEach(project => {
            //     if (project.id == data.projectID) {
            //         project.toDoList.forEach(todo => {
            //             if (todo.id == data.todoID)
            //                 todo.completed = true
            //         })
            //     }
            //     io.emit('send-current-project', project)
            // })
        });

        socket.on('delete-project',data=>{
            if(data==null){
                console.log("ERROR: project id is null")
                return
            }

            db.deleteProject(data).then(projects=>{
                socket.emit('refresh-projects', projects)
            })
            
        })
        socket.on('disconnect', () => {
        })
    })
}
