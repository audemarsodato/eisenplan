# Task management app

A full-stack task management application that organizes tasks using the **Eisenhower Matrix**, helping users prioritize work based on urgency and importance. Tasks can be created, organized through drag-and-drop, and stored in a MongoDB database.

## Live Demo
[▶ https://tasks-today-time-management.netlify.app/](https://tasks-today-time-management.netlify.app/)

## Demo Video
[▶ Watch the demo](https://youtu.be/T3retC5oUMo)

## Screenshots
![Quadrants](./assets/screen2.png)
![Tasks](./assets/screen1.png)

## Features
- Create new tasks
- Organize tasks into the four Eisenhower Matrix quadrants
- Drag and drop tasks between quadrants
- Mark tasks as completed
- Delete tasks
- Persist tasks using MongoDB

## Tech Stack

### Frontend
- React.js
- React Router
- dnd-kit(drag-and-drop)

### Backend
- Node.js 
- Express.js

### Database
- MongoDB
- Mongoose

## Future improvements
- Responsive mobile layout
- User authentication
- Edit existing tasks
- Delete confirmation dialog
- Dedicated completed tasks section
- Parsing input and check for deadline
- Entered task with deadline be automatically added in Q1