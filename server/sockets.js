const Project = require('../models/project.js');
const ToDo = require('../models/todo.js');
const User = require('../models/user.js');


module.exports = (server, db) => {
    const io = require('socket.io')(server);
    // const projects = [];
    let counter = 0

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
                    io.emit('refresh-projects', projects)
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
                            io.emit('refresh-projects', projects)
                            console.log(projects)
                        })
                    })
            })
        });
        socket.on('add-todo', todo => {
            //Create new ToDo
            console.log("add todo")

            console.log("todo.projectID = " + todo.projectID)
            db.findProject(todo.projectID).then(project => {
                if (project == null) {
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
                                io.emit('refresh-projects', projects)
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
                            io.emit('refresh-projects', projects)
                            console.log(projects)
                        })
                    })
            })
        });

        socket.on('set-todo', data => {

            db.findProject(data.projectID).then(project => {
                if (project == null) {
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
                                io.emit('refresh-projects', projects)
                                console.log(projects)
                            })
                        })
                }
            })

        });

        socket.on('delete-project', data => {
            if (data == null) {
                console.log("ERROR: project id is null")
                return
            }

            db.deleteProject(data).then(projects => {
                io.emit('refresh-projects', projects)

            })

        })

        socket.on('register', data => {
            if (data == null) {
                console.log("Error occurred while registering user")
            }
            db.createUser(data)
                .then(user => {
                    user.name = data.name
                    user.password = data.password
                    db.loginUser(user).then(user => {
                        socket.emit('refresh-user', user)
                    })
                })
                .catch(err => {
                    console.log("Failed register! sockets.js: " + err.message)
                    socket.emit('failed-register', err.message)
                })

        })

        socket.on('login', data => {
            if (data == null) {
                console.log("Error occurred while logging in")
                socket.emit('failed-login')
                throw new Error('Null data trying to login')
            }
            console.log("logging in")
            db.loginUser(data)
                .then(user => {
                    console.log(user)
                    if (user) socket.emit('refresh-user', user)
                })
                .catch(err => {
                    console.log("Failed-login error caught!")
                    socket.emit('failed-login')
                })
        })

        socket.on('open-users-list', () => {
            db.getUsersList()
                .then(users => {
                    if(users==null) {
                        console.log("wtf no users?")
                        // throw new Error('Null users list!')
                    } else {
                        console.log("Emitting refresh-users-list")
                        socket.emit('refresh-users-list', users)
                    }
                })

        })

        socket.on('disconnect', () => {
        })
    })
}
