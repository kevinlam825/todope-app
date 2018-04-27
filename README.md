## PROJECT DUE DATE - 05/13 - 11:59PM - CSNS
---
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




## API App (Continuation of Midterm App)

Your application should allow Users to perform a search using your selected API from the midterm.  Your App must follow the guidelines below.

### Guidelines
Your server should use the custom module built for the midterm.  Create a frontend (UI) that must allow Users to do the following:

- Indicate to the User the type of search that is available, so the User knows what to type into the input field.
    - For example if you have a Music API - indicate the search will work on song titles
- Have an input field the User types into.
- When the search results are return, present the user with a list of results.
    - ONLY display a result set that is 10 or fewer
- When the User selects the result, show the Details of the selected result.
- The details should be formatted cleanly. So that it is easily readable.
    - DO NOT display JSON structures.
- The details should include an image and if no image is present uses a default image.
- Allow the user to have the option to search again.


### Extra Credit - Synchronization (10pts)
- Whenever a search is performed add it to a list of previous searches. The UI should be display the previous searches in real-time.  This list should be clickable and take the User to a search results page.
- To receive credit - you must accomplish this with WebSockets.
