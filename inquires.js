const inquirer = require("inquirer")

function initiate(){
inquirer.prompt(
    {
        type:"",
        message: "What would you like to do?",
        choices: [
            {message: "Add an Employee", name: ""},
            //{message: "Delete an Employee", name: ""},
            {message: "View all Employees", name: ""},
            {message: "Creaet Department", name:""},
            //{message: "Delete a Department"},
            {message:"Create Role", name:""},
            //{message: "Delete a role"},
            {message: "View Employees by Department", name: ""},
            {message: "View Employees by Role", name: ""},
            //{message: "View Employees by Manager", name: ""},
            {message: "Change an Employees Role", name: ""},
            //{message: "Change an Employees Manager", name: ""}
        ]
    }

)}

function Choice(){
    switch
}
