const inquirer = require("inquirer");
const { createPromptModule } = require("inquirer");

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
            createEmployee()
        break;

        case "Create Role":
            createRole()
        break;

        case "Create Department":
            createDepartment()
        break;

        case "View All Employees":
            viewEmployees()
        break;

        case "View Employees by Department":
            viewByDepartment()
        break;

        case "View Employees by Role":
            viewByRole()
        break;

        case "Change an Employees Role":
            changeRole()
        break;
    }

}

function createEmployee(){
    inquirer.prompt(
        { 
            type:"input",
            message:"First Name?",
            name:"firstName"
        },
        {
            type:"input",
            message: "Last Name?",
            name: "lastName"
        },
        //department id
        //role id
    )
}

function createDepartment(){
    inquirer.prompt(
        {
            type: "input",
            message: "Name of the Deparment?",
            name:"departmentName"
        }
    )
}

function createRole(){
    inquirer.prompt(
        {
            type: "input",
            message: "Role Title?",
            name: "roleTitle"
        },
        {
            type: "input",
            message: "What is the salary of this Role?",
            name: "roleSalary"
        },
        //add some error handling to make sure salary input is a number
        //department id
    )
}




//Create is going to have a second inquirer prompt 
//and an INSERT mysql function

//View is going to have a second inquirer prompt
//and use that input to select certain parts of the table and then present those parts

//Change is going to have a second inquirer prompt
//and find an employee by unique id and then change the chosen column as desired

//Delete is going to have a second inquirer prompt
//and use that input to select a row by unique id and then remove that row 