# Meraki Duo Integration
---
## What is it?
An awesome webapp that can be used as a Meraki WiFi captive portal. Capabilityies include the ability to use OKTA SSO or your own authentication, enhanced with Cisco DUO MFA!

Supported Features:

1. OKTA SSO integration.
2. Custom authentication process (Sample code includes APRIL Authentication!).
3. Cisco DUO Multi-factor authentication.
4. Fully customisable UI 
5. User logging
6. Container Support!


## How does it work?
The Captive Portal utilises Cisco Merakis Click through authentication, where we build in our own authentication flow before serving the user a Meraki URL which enables network access. 

## How do I deploy this?
***Important: All deployment methods heavily rely on enviroment variables, these are outlined at the bottom of the page.***

Building the application couldn't be easier. You have three awesome options:

1. Bare-metal server
2. Virtual Machine
3. Container 

#### 1. Bare-metal Deployment

1. Download the Repository (Click Code at the top right and Download ZIP)
2. Download and Install Node.js ([Downloads Page](https://nodejs.org/en/))
3. Unzip the folder and place it where you want the Node.js Web-Server to run. 
4. Navigate into /customSplashPage of the unzipped file in your Terminal/Command Prompt (It works on both!)
5. Run `npm install` - This will download all of our dependencies (easy right?)
6. Run `npm run build` - This builds our front-end dependencies that are needed
7. Run `npm start` - This starts the webserver 
8. You'll be able to access your captive portal at localhost:3006/signonokta (Okta SSO) *or* localhost:3006/signon (Custom)

#### 2. Virtual Machine Deployment
*Coming Soon*

#### 3. Docker Deployment
*Coming Soon*

#### Enviroment Variables
Everyones enviroments and authentication keys are different, to make it simple to deploy you'll need to set some of these variables. The variables needed to be set are listed below: 

**Custom Authentication:**

baseUrlAuth=`The base url of your auth api goes here`

**OKTA Authentication:**

baseUrlOKTA=`Okta base url goes here`

**DUO MFA:**

ikey=`ikey goes here`

skey=`skey goes here`

akey=`akey goes here`

host=`host goes here`

## Authors & Maintainers

- [Pedro Oliveira](peolivei@cisco.com)
- [Josh Dean](joshudea@cisco.com)

## License

This project is licensed to you under the terms of the [Cisco Sample
Code License](./LICENSE).




