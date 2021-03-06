// Components
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
            <select v-model="register.role" class="browser-default">
                <option>Admin</option>
                <option>User</option>
            </select>
        </div>   
    </div>
    <div slot="footer">
        <p v-if="app.failedRegister" style="color: #fb78ad">{{app.failedRegister}}</p>
        <button @click="submit()" class="btn waves-effect waves-light" type="submit" name="action">Submit
        <i class="material-icons right">send</i>
        </button>
    </form>
    </div>
    </modal>`,

    methods:{
        submit: function(){
            if(this.register.name && this.register.email && this.register.password && this.register.role){
                console.log(this.register.role)
                socket.emit('register',this.register)
            }
            
        },
        cancel: function(){
            app.showRegister=false
        }
    },
    props:['register', 'failedRegister']
}

const loginComponent={
    template: 
    `
    <modal>
    <h3 slot="header">Login
    <span><img @click="cancel()" @click="$emit('close')" style='float: right;' src='img/letter-x.png'></span>
    </h3>
    <div slot="body">
        <input type="email" name="email" placeholder="email" v-model="login.email" @keyup.enter="submit()">
        <input type="password" name="password" placeholder="Password" v-model="login.password" @keyup.enter="submit()">
    </div>
    <div slot="footer">
        <p v-show="app.failedLogin" style="color: #fb78ad">Invalid Username/Password!</p>
        <button @click="submit()" class="btn waves-effect waves-light" type="submit" name="action">Submit
        <i class="material-icons right">send</i>
        </button>
    </div>
    </modal>`,    
    methods:{
        submit: function(){
            if(this.login.email && this.login.password){
                socket.emit('login',this.login)
            }
            
        },
        cancel: function(){
            app.showLogin=false
        }
    },
    props:['login', 'failedLogin']
}

const landingPageComponent = {
    template: 
    `<div id='landing-page' class='landing-container'> 
        <div class='title-container'>
            <h2 class='title'>ToDope</h2>
            <h4 class='description'>The dopest ToDo App by the dopest developers</h4>
        </div>
    </div>`,
    created:particlesJS.load('landing-page', 'particles.json', function() {
        console.log('callback - particles.js config loaded');
      })

}

Vue.component('modal', {
    template: '#modal-template'
  })

const socket = io();

const app = new Vue({
    el: '#to-do-app',
    data: {
        user:{name:'Anonymous',role:'Guest'},
        failedRegister: '',
        failedLogin: false,
        loggedIn:false,
        projects:[],
        currentProject:{},
        showProject:false,
        newToDoDesc:'',
        newProjectName:'',
        showRegister:false,
        showLogin:false,
        register:{},
        login:{},
        users:[],
        newUserName:'',
        showUser:false,
        selectedUserNameAndEmailString:'',
        selectedUserName:'',
        selectedUserEmail:'',
        selectedUserRole:'',
        adminUserMode:false
    },
    methods: {
        addProject: function () {
            console.log(app.newProjectName)
            socket.emit('add-project',app.newProjectName)
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
            location.reload();
            app.loggedIn=false
            app.user={name:'Anonymous',role:'Guest'}
        },
        updateSelectedUser: function() {
            socket.emit('update-selected-user', {id:app.selectedUserId, name:app.selectedUserName, email:app.selectedUserEmail, role:app.selectedUserRole})
        },
        selectUser: function(id) {
            console.log('Looking for user id: ', id)
            const selectedUser = app.users.find( user => {
                return user._id === id;
            });
            if(selectedUser!=null){
                app.selectedUserId = selectedUser._id
                app.selectedUserName = selectedUser.name
                app.selectedUserEmail = selectedUser.email
                app.selectedUserRole = selectedUser.role
                app.selectedUserNameAndEmailString = app.selectedUserName + ' | ' + app.selectedUserEmail
                app.showUser = true
                // M.updateTextFields()
                this.$nextTick().then(()=>{ M.updateTextFields()}) // refresh Materialize text fields so labels don't overlap
            } else {
                console.log('Invalid User ID!')
            }
        },
        toggleUsersEditor: function() {
            if(!app.adminUserMode) {
                app.adminUserMode = true
                socket.emit('open-users-list')
            } else {
                app.adminUserMode = false
            }

        }
    },
    components: {
        'reg-component':registrationComponent,
        'login-component':loginComponent,
        'landing-page-component':landingPageComponent
    }
});

// when receiving project list from server, replace local copy
socket.on('refresh-projects', projects => {
    app.projects = projects

    if(app.currentProject.name == null) return
    console.log("app.js: refresh-projects (pre): app.currentProject:", app.currentProject)
    const index = app.projects.findIndex(elem => elem._id == app.currentProject._id)
    if(index==-1) {
        console.log("Can't find current project in the current projectlist with index: " + index)
    } else {
        app.currentProject = app.projects.find(elem => elem._id == app.currentProject._id)
        console.log("app.js: refresh-projects (post): app.currentProject:", app.currentProject)
        console.log("app.js: refresh-projects (post): index:", index)
    }
    
    console.log(projects)
});

socket.on('check-current-project', deletedProjectID => {
    if(app.currentProject._id == deletedProjectID) app.showProject = false
});

socket.on('anonymous-user',user=>{
    app.user=user
})

socket.on('refresh-user',user=>{
    console.log(user)
    app.user=user   
    if (user.role.toLowerCase() != 'guest') {
        app.failedRegister = ''
        app.loggedIn = true
        app.showLogin = false
        app.showRegister=false
    }
})

socket.on('failed-login', err => {
    app.failedLogin = true
    console.log("Failed login!")
})

socket.on('failed-register', err => {
    console.log("Failed register! app.js: ", err)
    app.failedRegister = err
})

socket.on('refresh-users-list', users => {
    if(app.user.role!='Admin') {
        console.log('Not admin so not refreshing users-list changes from other users.')
    } else {
        console.log('Refreshing users list', users)
        app.users = users
        app.selectedUserNameAndEmailString = app.selectedUserName + ' | ' + app.selectedUserEmail
    }
})