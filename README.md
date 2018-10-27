### Node Server Requirements

**package.json** <br/>
The server should have a package.json file that is properly filled out.
  - It should include but not limited to (name, version, author, contributors, dependencies, etc)

**Server** <br/>
    - Responsible for serving the Vue frontend.
    - Responsible for data. Meaning delivering data from API or databases, maintaining data between users, etc.

**Additional Guidelines**
Your Node.js server is responsible communicating with your Vue.js frontend via HTTP or Sockets.
  - API interactions should go through the server.
  - Database transactions should go through the server.
  - Socket messages should go through the server.

---
### Vue Requirements

**App &  Components**
The Vue frontend should have at least (1) component.

**CSS**
The Vue frontend should be styled. Use a css framework (bootstrap, materilize) or create your own custom styles.

**HTML**
Use HTML5. Proper indentations. Ensure all html elements are properly closed.

**Additional Guidelines**
The frontend should allow for user interaction - button clicks, input, forms, uploads, etc.  The actions should call a Vue app method which then interacts with your Node.js server. The frontend should not be making any third-party (external) HTTP calls, database connections or socket connections.



## To-Do

To-Do application should allow Users to create a project, and within the project create To-Do’s

UI must allow Users to do the following:

- See a list of all projects
- Navigate into a project and view all To-Do’s associated with the project.
- Add a new To Do
- Toggle an existing To Do between done and not done.
- Remove all completed To Do’s.

### Synchronization 
- Whenever a project or To Do is created, modified, or deleted, the UI should be updated in real-time.
