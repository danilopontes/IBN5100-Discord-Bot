<h1 align="center">IBN 5100 - Discord Bot</h1>

<p align="center">
  A discord bot with cool and useful commands to help users.
</p>

## Available Commands:

* !commands
* !help
* !task

## !task command:

<p>This command is focused to helping students to keep track of their assignments and exams.</p>

### Adding a new Task:
```
!task add <Title>;<Course>;<Due_date>
```
#### Example of usage:
```
!task add Assignment 4;Java OOP;09/22/2020
```
<hr>

### Listing all due tasks:
```
!task list 
```
<hr>

### Listing all tasks (Due and Overdue Tasks):
```
!task list all 
```
<hr>

### Listing all tasks due by specific amount of days:
```
!task list due <Amount_Of_Days> 
```
#### Example of usage (Listing all tasks that are due for the next 10 days):
```
!task list due 10 
```
<hr>

### Listing all tasks due for a specific Course:
```
!task list course <Course_Name> 
```
#### Example of usage (Listing all tasks due for the Java OOP course):
```
!task list course Java OOP
```
<hr>

## Deleting a Task:
```
!task delete <Task_ID>
```
#### Example of usage:
```
!task delete xcf36d49d108725c4c1f1545 
```
