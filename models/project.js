class Project {
    //private id:number;
    //private name: string;
    //private toDoList: Todo[];
    constructor(id, name, description, toDoList) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.toDoList = toDoList;
        this.toDoCounter = 0;
    }
    // METHODS
    // add to todo to list
    // change the status of a todo
    // remove all the completed to do list from toDoList

}

module.exports = Project;
