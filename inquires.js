const inquirer = require("inquirer")

function initiate(){
inquirer.prompt(
    {
        type:"list",
        message: "What would you like to do?",
        choices: [
             "Create Employee",
            //{message: "Delete an Employee", name: ""},
            "View All Employees",
            "Create Department",
            //{message: "Delete a Department"},
            "Create Role",
            //{message: "Delete a role"},
            "View Employees by Department", 
            "View Employees by Role", 
            //{message: "View Employees by Manager", name: ""},
            "Change an Employees Role", 
            //{message: "Change an Employees Manager", name: ""}
        ]
    }

)}

//function with switch statement
function choice(data){
    switch(data){
        case "Create Employee":
        break;

        case "Create Role":
        break;

        case "Create Department":
        break;

        case "View All Employees":
        break;

        case "View Employees by Department":
        break;

        case "View Employees by Role":
        break;

        case "Change an Employees Role":
        break;
    }

}


//Create is going to have a second inquirer prompt and an INSERT mysql function
//View is going to select certain parts of the table and then present those parts
//Change is going to find an employee by unique id and then change the chosen column as desired
//Delete is going to find a row by unique id and then remove that row 