# tse-react-chatrooms

This is a simple application that provides semi-realtime chatting functionality. 
As a user, you set your name and then you are allowed to join and talk in any number of 
channels. If you join a channel that does not exist already, it will be created for you.
There are some caveats to this approach; we will go over them towards the end of the workshop. 

## Your Job

There are several `TODO`s scattered through the code. It will be your job to patch them
using similar functionality to what has been written. The affected files are listed below.
It is recommended that you attempt them in the given order; it will be harder to understanding
how everything meshes together if you do them out-of-order.

* backend/app.js 
* backend/models.js 
* backend/routes/channels.js 
* backend/routes/messages.js 
* frontend/index.js 
* frontend/App.js 
* frontend/components/home.js 
* frontend/components/channel.js 

Hints: I would advise that you look through all of the files in the repository and not just the ones
listed. Again, it will help you understand how everything works in tandem. Additionally,
start with the backend first, and then move on to the frontend. The backend has 5 routes
associated with it, each corresponding to a particular REST function. These have been detailed
below in the REST API section. I also highly advise that you know the difference between
`req.params`, `req.query`, and `req.body`. These all tie into fundamental structures
in HTTP packets.

## Installation

1. Clone this repository.

2. Switch to the `missing` branch for practice. Answers are in the `master` branch.

3. Change directory into the frontend folder, run `yarn install`

4. Change directory into the backend folder, run `npm install`

5. Make sure to set up the `MONGO_URI` environment variable in the frontend/.env file. 
You will need to create this file. The URI has been provided in the slides. 

## Running

Since there are two servers, you need to have at least two terminal windows open for
this to work.

1. Open one window. Change directory into the frontend folder, run `npm start`.

2. Open another window. Change directory into the backend folder, run `npm start`.

## REST API

* __GET__ /api/channels?limit={LIMIT}: This will fetch a list of the most popular channel objects, limited
  by the provided limit argument in the query string. The channel objects are sorted in decreasing order
  by the number of messages in each, which determines their popularity (i.e. a channel with more messages
  is more popular than a channel with fewer). The limit argument is technically optional and does not have
  to be provided. 

  Returns `{ success: true, data: [...] }` on success.

  Returns `{ error: true, message: '...' }` on error.

* __GET__ /api/channels/{NAME}: This will fetch a single channel object, which contains the channel name
  (redundant, of course) and the number of messages that the channel owns. Will return a 404 if no channel
  matches the name that was provided.

  Returns `{ success: true, data: {...} }` on success.

  Returns `{ error: true, message: '...' }` on error.

* __POST__ /api/channels: Using the arguments provided in `req.body`, this will create a channel. The
  only argument required is `req.body.name`, which defines the name of the channel to be created. Will return
  a 409 if a channel already exists with the given name. 

  Returns `{ success: true }` on success.

  Returns `{ error: true, message: '...' }` on error.

* __GET__ /api/messages?limit={LIMIT}&channel={NAME}&after={DATE}: The channel argument is required in the 
  query string; the after and limit arguments are optional. This will return a list of the most recent
  messages belonging to the given channel. The limit parameter limits the number of messages that are returned.
  The after parameter sets a minimum date for messages; all returned messages must have a creation date
  occurring AFTER the given date. Will return a 404 if no channel matches the name that was provided.

  Returns `{ success: true, data: [...] }` on success.

  Returns `{ error: true, message: '...' }` on error.

* __POST__ /api/messages: Using the arguments provided in `req.body`, this will create a message to be added
  to a channel. The arguments provided must be `req.body.channel` (the channel name), `req.body.sender`
  (the sender name), and `req.body.content` (the content of the message).  

  Returns `{ success: true }` on success.

  Returns `{ error: true, message: '...' }` on error.

