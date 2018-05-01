// Components
//Bar for the top of the page. Contains login/logout/register and an admin page
const navBarComponent={
    template: ` <div class="nav-bar">
                    <button v-if='logged' type='button' v-on:click='login()'>Login</button>
                    <button v-else type='button' v-on:click='logout()'>Logout</button>
                </div>`,
    props:['user']
}

const registrationComponent={
    template: 
    `
    <div class="register-modal-container" id="register-modal" @click="close">
        <div class="register-modal">
            <div class="form-register" :class="{ 'active': active == 'register' }" id="form-register">
                <div class="error-message" v-text="registerError"></div>
                <input type="text" name="name" placeholder="Name" v-model="registerName" @keyup.enter="submit()">
                <input type="email" name="email" placeholder="Email" v-model="registerEmail" @keyup.enter="submit()">
                <input type="password" name="password" placeholder="Password" v-model="registerPassword" @keyup.enter="submit()">
                <input type="submit" :class="{ 'disabled': submitted == 'register' }" @click="submit()" v-model="registerSubmit" id="registerSubmit">
            </div>
        </div>
    </div>`
}

const regmodal={
    template: '#modal-template'
}

const adminComponent={

}

const loginComponent={

}

//MIGHT NOT NEED THIS ONE
const logoutComponent={

}


const socket = io();

const modal=new Vue({
    el:'#reg-modal',
    data:{
        active:false,
        submitted:false,
        name:'',
        password:'',

    },
    methods:{
        submit: function(){

        }
    },
    components:{
        'reg-component':registrationComponent
    }
});

const app = new Vue({
    el: '#to-do-app',
    data: {
        user:'',
        logged:false,
        projects:[],
        currentProject:{},
        showProject:false,
        newToDoDesc:'',
        newProjectName:'',

        //MODAL
        showRegisterModal:false,
        showLoginModal:false
    },
    methods: {
        addProject: function () {
            console.log(app.newProjectName)
            socket.emit('add-project',app.newProjectName)
            // send project and add it to the list || db
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
        },
        deleteToDo: function (){
            console.log("delete")
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
        register: function(){
            modal.active
            console.log("CREATED THE USER")
        },
        login: function(){
            console.log("LOGIN USER")
        },
        logout: function(){
            console.log("LOGOUT USER")   
        }
    },
    components: {
        'nav-component':navBarComponent,
        'reg-component':registrationComponent
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

//socket.on... when the server sends to the client
//socket.emit when client sends to server