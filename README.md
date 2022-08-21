# A Simple Microservice System
An app which allows user to create posts, comments to the post  
The app is backed by a system of microservices and a React frontend

## posts-service
handle request to create a post

## comments-service
handle request to create a post's comment

## query-service
join data from posts-service and comments-service and serve the data to frontend

## event-bus-service
function as a communication channel to which other services can emmit events, then it will broadcast the events to other services

## moderation-service
an add-on service to moderate comments. In this case, it just simply rejects comments which have the word 'orange'

## client
a simple frontend using React
