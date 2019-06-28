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

## Setting up automated reminders for Tasks:

<p>It is possible to set automated reminders for the tasks that are due using Cron patterns.</p>
<p>Future implementation of this feature will be more user friendly without the need to know Cron patterns.</p>

```
 Cron Pattern:
 ┌────────────── seconds (optional): 0-59
 │ ┌──────────── minutes: 0-59
 │ │ ┌────────── hours: 0-23
 │ │ │ ┌──────── day of month: 1-31
 │ │ │ │ ┌────── months: 0-11 (Jan-Dec)
 │ │ │ │ │ ┌──── day of week: 0-6 (Sun-Sat)
 │ │ │ │ │ │
 │ │ │ │ │ │
 * * * * * *
```

### Adding a new Reminder:
```
!task reminders add <Channel_Name>;<Due_next_X_Days>;<Cron_Pattern>
```
#### Example of usage:
```
!task reminders add reminders;7;0 0 12 * * 1
```

In this case, we are adding a new reminder where the message will be sent to a channel called reminders.
It will show all tasks that are due during the next 7 days, and the Cron pattern is set to every Monday at 12:00 PM.

<hr>

### Listing existing reminders:
```
!task reminders list
```

<hr>

### Deleting an existing Reminder:
```
!task reminders delete <Reminder_ID>
```