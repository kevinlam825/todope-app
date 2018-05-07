// Components
//Bar for the top of the page. Contains login/logout/register and an admin page

const navBarComponent={
    template: ` <div class="nav-bar">
                    <button v-if='loggedIn' type='button' v-on:click='login()'>Login</button>
                    <button v-else type='button' v-on:click='logout()'>Logout</button>
                </div>`,
    props:['user']
}

const registrationComponent={
    template: 
    `
    <modal>

    <h3 slot="header">Register
    <span><img @click="cancel()" @click="$emit('close')" style='float: right;' src='img/letter-x.png'></span>
    </h3>
    <div slot="body">
    <form @submit.prevent="submit()">
        <label v-if="register.errorName">Error</label><input type="text" name="name" placeholder="Name" v-model="register.name">
        <input type="email" name="email" placeholder="Email" v-model="register.email">
        <input type="password" name="password" placeholder="Password" v-model="register.password">
        <div>
        <label>Select a User Role</label>
            <select v-model="register.role">
                <option>Admin</option>
                <option>User</option>
            </select>
        </div>   
    </div>
    <div slot="footer">
        <input type="submit" @click="submit()" id="registerSubmit" @click="$emit('close')">
    </form>
    </div>
    </modal>`,

    methods:{
        submit: function(){
            if(this.register.name && this.register.email && this.register.password){
                this.register.role='User'
                app.showRegister=false
                app.loggedIn=true
                socket.emit('register',this.register)
            }
            
        },
        cancel: function(){
            app.showRegister=false
        }
    },
    props:['register']
}

const regmodal={
    template: ''
}

const adminComponent={

}

const loginComponent={
    template: 
    `
    <modal>
    <h3 slot="header">Login
    <span><img @click="cancel()" @click="$emit('close')" style='float: right;' src='img/letter-x.png'></span>
    </h3>
    <div slot="body">
        <input type="email" name="name" placeholder="email" v-model="login.name">
        <input type="password" name="password" placeholder="Password" v-model="login.password">
    </div>
    <div slot="footer">
        <input type="submit" @click="submit()" id="loginSubmit" @click="$emit('close')">
    </div>
    </modal>`,    
    methods:{
        submit: function(){
            if(this.login.name && this.login.password){
                app.showLogin=false
                app.loggedIn=true
                socket.emit('login',this.login)
            }
            
        },
        cancel: function(){
            app.showLogin=false
        }
    },
    props:['login']
}

Vue.component('modal', {
    template: '#modal-template'
  })

const socket = io();

const app = new Vue({
    el: '#to-do-app',
    data: {
        user:{name:'Anonymous',role:'Guest'},
        loggedIn:false,
        projects:[],
        currentProject:{},
        showProject:false,
        newToDoDesc:'',
        newProjectName:'',
        showRegister:false,
        showLogin:false,
        register:{},
        login:{}
    },
    methods: {
        addProject: function () {
            console.log(app.newProjectName)
            socket.emit('add-project',app.newProjectName)
            // send project and add it to the list || db
            app.newProjectName = ''
        },
        deleteProject: function(id){
            console.log('DELETE'+ id)
            app.showProject=false
            socket.emit('delete-project',id)
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
            socket.emit('add-todo', { projectID: app.currentProject.id, name: this.newToDoDesc, completed: false })
            app.newToDoDesc = ''
        },
        deleteToDo: function (id){
            if (!this.currentProject || id==null)
                return

            socket.emit('remove-todo', { projectID: app.currentProject.id, todoID: id })
        },
        completeToDo: function(id) {
            //need to figure out why the checkbox wont show in the table

            console.log("completeToDo: id: ", id)
            if(!this.currentProject || id==null)
                return
            console.log("CLICK CLICK")
            const index = this.currentProject.toDoList.findIndex(elem => elem._id == id)
            this.currentProject.toDoList[index].completed = !this.currentProject.toDoList[index].completed 
            socket.emit('set-todo', { projectID: app.currentProject.id, todoObj: app.currentProject.toDoList[index]})
        },
        logout: function(){
            console.log("LOGOUT USER")
            app.loggedIn=false
            app.user={name:'Anonymous',role:'Guest'}
        },
        submit: function(data,state){
            if(state==='register')socket.emit('register', data)
            if(state==='login')socket.emit('login',data)
        }
    },
    components: {
        'nav-component':navBarComponent,
        'reg-component':registrationComponent,
        'login-component':loginComponent
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

socket.on('anonymous-user',user=>{
    app.user=user
})

socket.on('refresh-user',user=>{
    console.log(user)
    app.user=user
})
//socket.on... when the server sends to the client
//socket.emit when client sends to server