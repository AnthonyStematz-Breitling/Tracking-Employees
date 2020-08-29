const inquirer = require("inquirer");
//const console = require("console.table")
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
  
    password: "",
    database: "work-force_db"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
  });

function initiate(){
inquirer.prompt([
    {
        type:"list",
        name: "adminFunctions",
        message: "What would you like to do?",
        choices: [
             "Create Employee",
            //"Delete an Employee",
            "View All Employees",
            "Create Department",
            //"Delete a Department",
            "Create Role",
            //"Delete a role",
            "View Employees by Department", 
            "View Employees by Role", 
            //"View Employees by Manager",
            "Change an Employees Role" 
            //"Change an Employees Manager", 
        ]
    }

])
}

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
    //insert into database
}

function createDepartment(){
    inquirer.prompt(
        {
            type: "input",
            message: "Name of the Deparment?",
            name:"departmentName"
        }
    )
    //insert into database
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
    //insert query
}

function viewEmployees(){
    //console.table(employees)
    //look up how to use console.table wiht SQL
}

function viewByDepartment(){
    //get departments from database

    inquirer.prompt(
        {
            type: "list",
            message: "" //list of departments from DB
        }
    )
    //may need a switch statement 
    //then show all employees from that department
}

function viewByRole(){
    //get roles from database

    inquirer.prompt(
        {
            type: "list",
            message: "" //list all roles from DB
        }
    )
    //made need a switch statement
    //then show all employees with that role
}

function changeRole(){
    inquirer.prompt(
        {
            type: "input",
            message: "What is the first name of the employee?",
            name: "changeFirst" 
        },
        {
            type: "input",
            message: "What is the last name of the employee?",
            name: "changeLast"
        },
        //get all employees with that first and last name from DB
        //create an error message if there is no matching employee
        {
            type: "list",
            message: "", //list of employees with that first and last name 
            //including thier unique id & current role
            name: "chosenEmployee"
        },
        console.log("What role would you like the employee to have?"),
        {
            type: "list",
            message: "", //list of roles from database
            name: "newRole"
        }
    )
    //using the newRole change the role of the chosen employee in the DB
}


//CRUD
//Create is going to have a second inquirer prompt 
//and an INSERT mysql function

//(READ)View is going to have a second inquirer prompt
//and use that input to select certain parts of the table and then present those parts

//(UPDATE)Change is going to have a second inquirer prompt
//and find an employee by unique id and then change the chosen column as desired

//Delete is going to have a second inquirer prompt
//and use that input to select a row by unique id and then remove that row 