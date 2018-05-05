const
    config = require('./config.json'),
    Mongoose = require('mongoose'),
    { generateHash, validatePassword } = require('./validate'),
    ProjectModel = require('../models/project.js');
    ToDoModel = require('../models/todo.js');

Mongoose.connect(config.uri)
Mongoose.connection.on('error', err => {
    console.log('MongoDB Connection Error:' + err)
})

const UserSchema = new Mongoose.Schema({
    id: Mongoose.Schema.Types.ObjectId,
    name: String,
    password: String,
    role: String
}, { strict: false })

const ToDoSchema = new Mongoose.Schema({
    //(id, description, completed, creator, users)
    id: Mongoose.Schema.Types.ObjectId,
    name: String, 
    description: String,
    completed: Boolean
}, { strict: false })

const ProjectSchema = new Mongoose.Schema({
    id: Mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    toDoList: [ToDoSchema]
})

const
    User = Mongoose.model('users', UserSchema),
    ToDo = Mongoose.model('todos', ToDoSchema),
    Project = Mongoose.model('projects', ProjectSchema)


const getAllProjects = () => Project.find()

const getAllTodos = () => Todo.find()

const addProject = (project) => {
    const content = {
        id: new Mongoose.Types.ObjectId,
        name: project.name,
        description: project.description,
        todos: project.toDoList
    }
    return Project.create(content)
}

const saveProject = (project) => {
    return Project.findOneAndUpdate({'_id':project._id}, project, {upsert: true})
}


const addTodo = (todo) => {
    const content = {
        id: new Mongoose.Types.ObjectId,
        name: todo.name, 
        completed: todo.completed
    }
    return ToDo.create(content)
}

const findProject = id => {
    return Project.findOne({ 'id': id })
}

const deleteProject=(id)=>{
    console.log('DELETE'+id)
    Project.remove({'_id':id},function(err){
        if(err) return handleError(err) 
        
    })
    return getAllProjects()

}

const createUser=(data)=>{
    console.log('Registering User')

    const content={
        id:new Mongoose.Types.ObjectId,
        name:data.name,
        //email:data.email,
        password:data.password,
        role:data.role
    }
    console.log(content)
    return User.create(content)
    //User.create(content)
}

const loginUser=(user)=>{
    console.log('Logging User')
    console.log(user)
    return User.findOne({'name':user.name, 'password':user.password})
}
// const createMessage = data => {
//     const content = {
//         user: data.user,
//         message: data.message,
//         date: new Date().getTime()
//     }
//     return Message.create(content)
// }

// const activeUsers = () => User.find({ socketId: { $ne: null } }, { password: 0 })

// const allMessages = () => Message.find()

// const findUserByName = userName => User.findOne({ name: { $regex: `^${userName}$`, $options: 'i' } })

// const loginUser = (userName, password, socketId) => {
//     // find if the username is in the db
//     return findUserByName(userName)
//         .then(found => {
//             if (!found)
//                 throw new Error('User does not exists')

//             // validate the password
//             const valid = validatePassword(password, found.password)
//             if (!valid)
//                 throw new Error('Invalid Password')

//             return found
//         })
//         // active == have socketId
//         .then(({ _id }) => User.findOneAndUpdate({ _id }, { $set: { socketId } }))
//         // return name and avatar
//         .then(({ name, avatar }) => {
//             return { name, avatar }
//         })
// }

// const createUser = (userName, password, socketId) => {
//     // find if username is in db
//     return findUserByName(userName)
//         .then(found => {
//             if (found)
//                 throw new Error('User already exists')

//             return {
//                 socketId,
//                 name: userName,
//                 password: generateHash(password),
//                 avatar: `https://robohash.org/${userName}?set=set3`
//             }
//         })
//         // create user
//         .then(user => User.create(user))
//         // return avatar and name
//         .then(({ name, avatar }) => {
//             return { name, avatar }
//         })
// }



// const logoutUser = socketId => {
//     return User.findOneAndUpdate({ socketId }, { $set: { socketId: null } })
// }

module.exports = {
    addProject,
    getAllProjects,
    getAllTodos,
    addTodo,
    findProject,
    saveProject,
    deleteProject,
    createUser,
    loginUser
    // activeUsers,
    // allMessages,
    // createUser,
    // createMessage,
    // loginUser,
    // logoutUser
}