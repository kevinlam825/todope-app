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
    email: String,
    password: String,
    role: String
}, { strict: false })

const ToDoSchema = new Mongoose.Schema({
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


const getAllProjects = () => Project.find().sort('_id') // sorted by creation date 

const getAllTodos = () => Todo.find().sort('_id') // (_id is based on timestamp)

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
    console.log('Attempting to Registering User')

    return findUserByEmail(data.email)
        .then(found => {
            if(found) {
                console.log("Error! User already exists.")
                return Promise.reject(new Error('User already exists'))
            } 
                
            return {
                id: new Mongoose.Types.ObjectId,
                name: data.name,
                email: data.email,
                password: generateHash(data.password),
                role: data.role
            }

        })
        .then(user => {
            console.log(user)
            return User.create(user)
        })
        .catch(err=>{
            console.log("error")
            return Promise.reject(err)
        })
}

const loginUser=(user)=>{
    console.log('Logging User')
    console.log(user)
    return User.findOne({'email':user.email})
        .then(found => {
            if(!found) {
                console.log('User does not exist!')
                throw new Error('User does not exist!')
            }
            const valid = validatePassword(user.password, found.password)
            if (!valid) {
                console.log('Invalid Password')
                throw new Error('Invalid Password')
            }
            return found
        })
}

const findUserByEmail = email => {
    atIndex = email.indexOf('@')
    dotIndex = email.lastIndexOf('.')
    if(atIndex >= dotIndex || atIndex==-1 || dotIndex==-1) {
        console.log('Invalid email. Throwing...')
        return Promise.reject(new Error('Invalid Email'))
    }
    // some filtering for dup gmail tricks
    if(email.substring(atIndex+1, dotIndex).toLowerCase() == 'gmail') {
        preAt = email.substring(0, atIndex)
        preAt = preAt.replace('.',"")
        
        plusIndex = preAt.indexOf('+')
        if(plusIndex > -1) {
            preAt = preAt.substring(0, plusIndex)
        }

        email = preAt + email.substring(atIndex)
    }
    console.log("Searching for email: " + email)
    return User.findOne({ email: { $regex: `^${email}$`, $options: 'i' } })
} 

const getUsersList = () => User.find({},'name email role')

const updateUser = (id, changes) => {
    console.log("Changes obj: ", changes,"END CHANGESOBJ")
    return User.findByIdAndUpdate(id, changes , { "new": true })
}

module.exports = {
    addProject,
    getAllProjects,
    getAllTodos,
    addTodo,
    findProject,
    saveProject,
    deleteProject,
    createUser,
    loginUser,
    getUsersList,
    updateUser
}