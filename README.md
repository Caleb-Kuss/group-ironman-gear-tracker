# Old School RuneScape Group Ironman Gear Tracker

## Description

This Next.js application serves as a front-end interface for tracking gear and clue items of users, as well as their group's items in Old School RuneScape. It utilizes MongoDB as the backend database to store and manage the data. I created this specific to my groupmates needs, however this is a great baseline for anyone that wants to add to or take away from this code. I also created an [OSRS-BOT](https://github.com/Caleb-Kuss/osrs-bot) that alerts our discord channel as soon as someone inputs that they own a new item from this application. That bot pairs nicely with this application and I recommend giving it a look.

## Features

- **User Gear Tracking:** Users can log in and track their personal gear and clue items.
- **Group Gear Tracking:** Users can also track items for their group or clan.
- **MongoDB Integration:** The application seamlessly integrates with MongoDB to store and retrieve user and group item data.
- **Responsive Design:** The application is built with responsiveness in mind, ensuring a smooth experience across different devices and screen sizes.
- **Google Provider** Integrates with google provider to let users log in via SSO
- **User Dashboard** Users can set their username and select their unique color identifier to be easily identified by their group mates. Users can also check their highscores here.

## Installation

1. Clone the repository
2. Navigate to the project directory: `cd your_repo`
3. Install dependencies: `npm install`

## Configuration

1. Create a MongoDB Atlas account and set up a cluster.
1. Obtain your MongoDB connection URI.
1. Connect the app with a provider (I used google)
1. Create a `.env` file from the example env file in the root directory of the project.

## Usage

1. Start the development server: `npm run dev`
2. Access the application in your web browser at `http://localhost:3000`

## Images

**Signed in homepage**
![Logged in home view](/public/readme/loggedinhome.png)

**Clues**
_Note_ The third clue card has an olive dot signifing a clan mate owns this clue item already.
![hard clue reward selection](/public/readme/hardcluerewards.png)

**Gear**
_Note_ If you tap/select a card it will show you the name of the item
![Mage gear selection](/public/readme/magegearselection.png)

**User Settings**

![User Settings page](/public/readme/usersettings.png)

## Disclaimer

This application is not affiliated with, endorsed, sponsored, or specifically approved by Jagex Ltd. Old School RuneScape and related trademarks are the property of Jagex Ltd. This application is built for educational and entertainment purposes only. The developers of this application are not responsible for any misuse of the application or any consequences arising from the use of this application. By using this application, you agree to use it at your own risk.

With that being said, I cannot provide the OSRS images used to seed the database or the application; however, I am sure one could find them very easily.
