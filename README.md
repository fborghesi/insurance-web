# ML Demo
This is the web frontend for the Machine Learning Demo Project.

## Before you Begin
For log ins to work you'll need to 


## Local Development 

To run this project in development mode, you need to set up the environment 
first. In order to do so you must copy the file .env.example in the root folder
in this project to .env:

```bash
cp .env.example .env
```

Then you'll need to edit the file using vi or any other text editor of your
preference and set the following variables:

* **NEXT_PUBLIC_BACKEND_URL**: contains the url where your lambda functions
    are running, it could be your local host if you're running lambda locally
    via docker (sam local start-api) or the actual lambda address on AWS 
    (https://pgqxqlayj1.execute-api.us-east-1.amazonaws.com/dev).
* **NEXT_PUBLIC_GOOGLE_CLIENT_ID**: sets Google's client id as obtained from 
  Google's API and Services section. The value will be string like the 
  following 123456789012-abcdefghijklmnopqrstuvwxyz012345.apps.googleusercontent.com.

 You're all set. Now it's time to run the project with the command below:

 ```bash
npm run dev
```


## Deploying to Vercel

 Just as you did in the previous section for local development, you'll need to 
 define your environment. In this case you won't enter the values into a file
 but into the UI. Vercel will take care of exporting these value into the 
 environment at deployment time.

 For this to work you'll need to:
 * Log in to vercel (https://vercel.com/)
 * Select the project (insurance-web)
 * Click on **Settings** on the top menu
 * Click on **Environment Variables** on the left menu
  
There you must define the values for **NEXT_PUBLIC_BACKEND_URL** and 
**NEXT_PUBLIC_GOOGLE_CLIENT_ID**. Keep in mind that variables can be set for
the different environments individually or can be share by all of them.
 
 Every time you push to the main branch on github.com:fborghesi/insurance-web.git, 
 the project will get deployed to vercel. You can also re-deploy by going to 
 the **Deployments** section on the top menu and click on the **Redeploy**
 menu option for any of the existing deployments.

