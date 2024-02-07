## Description

Sample api for scheduling meetings based on own basic backend core.

## Used technologies

<img src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" height="40" style="margin-right: 10px"> 
<img src="https://cdn.freebiesupply.com/logos/large/2x/jest-logo-png-transparent.png" height="40" style="margin-right: 10px"> 

## Demo

# POST: /user
Adding new user.

exanple body:
```
    {
        "name": "John",
        "surname": "Snow",
        "email": "john.snow@adrianwii.pl"
    }
```
<div style="text-align:center;">
    <img src="docs/screenshots/postUser.png">
</div>


# GET: /user
Listing list of all users.
<div style="text-align:center;">
    <img src="docs/screenshots/getUsers.png">
</div>

# Running the app

```bash
$ npx tsc

$ node main.js

```

## Test

```bash
# unit tests
$ npm run test

```

## Author

- [@AdrianWii](https://www.github.com/AdrianWii)
