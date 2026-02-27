import { shell, app } from "electron";
import path from "path";
import fs from "fs";
import http from "http";
import url from "url";
import { OAuth2Client } from "google-auth-library";

export async function loginWithGoogle(): Promise<{success: boolean, error?: string}> {

  const credentialsPath = path.join(
    process.cwd(),
    "config",
    "client_secret.json"
  );

  const credentials = JSON.parse(
    fs.readFileSync(credentialsPath, "utf-8")
  );

  const { client_id, client_secret } =
    credentials.installed;

  const redirectUri = "http://localhost:3000";

  const oauth2Client = new OAuth2Client(
    client_id,
    client_secret,
    redirectUri
  );


  //Create temporary server
  return new Promise((resolve=> {
    const server = http.createServer(async (req, res) => {

      try {
        if (!req.url) return;

        const query = url.parse(req.url, true).query;  
       
        const code = query.code as string;
        
        if (!code) {

          res.end();

          return;
        }

        res.end("Login successful. You can close this tab.");

        server.close();

        //Exchange code for token
        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);

        //Save token
        const tokenPath = path.join(
          app.getPath("userData"),
          "token.json"
        );

        fs.writeFileSync(
          tokenPath,
          JSON.stringify(tokens)
        );

        console.log("TOKEN SAVED:", tokenPath);

        resolve ({success:true})
      }
      catch (err:any) {
        resolve({
          success: false,
          error: err.message
        })
      }

    });
  
    //Start server
    server.listen(3000);

    //Open browser
    const authUrl = oauth2Client.generateAuthUrl({

      access_type: "offline",

      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/drive.appdata"
      ]
    });

    shell.openExternal(authUrl);
    }));
}

export async function getUserInfo() {

  const tokenPath = path.join(
    app.getPath("userData"),
    "token.json"
  );

  const tokens = JSON.parse(
    fs.readFileSync(tokenPath, "utf-8")
  );

  const credentialsPath = path.join(
    process.cwd(),
    "config",
    "client_secret.json"
  );

  const credentials = JSON.parse(
    fs.readFileSync(credentialsPath, "utf-8")
  );

  const { client_id, client_secret } =
    credentials.installed;

  const oauth2Client = new OAuth2Client(
    client_id,
    client_secret
  );

  oauth2Client.setCredentials(tokens);


  const res = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization:
          `Bearer ${tokens.access_token}`
      }
    }
  );

  const data= await res.json();
  
  return {
    name: data.name,
    picture: data.picture
  }
}

export function isAlreadyLoggedIn(){
  const tokenPath = path.join(
    app.getPath("userData"),
    "token.json"
  );

  return fs.existsSync(tokenPath);
}

export async function logoutGoogle(): Promise<{ success: boolean}> {
  try {
    const tokenPath = path.join(app.getPath("userData"), "token.json")

    if(!fs.existsSync(tokenPath))
      return { success : true}

    const tokens = JSON.parse(fs.readFileSync(tokenPath,"utf-8"))

    //revoke token at google
    if(tokens.acces_token) {
      await fetch(
        `https://oauth2.googleapis.com/revoke?token=${tokens.access_token}`,
        {
          method: "POST",
          headers: {
            "Content-type":
              "application/x-www-form-urlencoded"
          }
        }
      );
    }

    //Delete local token
    fs.unlinkSync(tokenPath)

    console.log("TOKEN DELETED:", tokenPath);

    return {success:true}
  }
  catch {
    return {success:false}
  }

}