import { shell, app } from "electron";
import path from "path";
import fs from "fs";
import http from "http";
import url from "url";
import { OAuth2Client } from "google-auth-library";

function getTokenPath() {
	return path.join(app.getPath("userData"), "token.json");
}

function getCredentialsPath() {
	return path.join(process.cwd(), "config", "client_secret.json");
}

export function getOAuthClient(): OAuth2Client {
	const tokens = JSON.parse(
		fs.readFileSync(getTokenPath(), "utf-8")
	);

	const credentials = JSON.parse(
		fs.readFileSync(getCredentialsPath(), "utf-8")
	);

	const { client_id, client_secret } = credentials.installed;

	const client = new OAuth2Client(client_id, client_secret);

	client.setCredentials(tokens);

	return client;
}

export async function refreshIfNeeded(client: OAuth2Client) {
	const tokens = client.credentials;
	const BUFFER_MS = 60 * 1000; // refresh 1 minute early

	if (!tokens.expiry_date || tokens.expiry_date <= Date.now() + BUFFER_MS) {
		const { credentials } = await client.refreshAccessToken();
		client.setCredentials(credentials);

		fs.writeFileSync(
			getTokenPath(),
			JSON.stringify(credentials, null, 2)
		);
	}
}

export async function loginWithGoogle(): Promise<{ success: boolean, error?: string }> {

	const oauth2Client = getOAuthClient();

	//Create temporary server
	return new Promise((resolve => {
		const server = http.createServer(async (req, res) => {
			try {
				if (!req.url) 
					return;
				
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
				const tokenPath = path.join( app.getPath("userData"), "token.json" );
				fs.writeFileSync( tokenPath, JSON.stringify(tokens));
				console.log("TOKEN SAVED:", tokenPath);

				resolve({ success: true })
			}
			catch (err: any) {
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
				"https://www.googleapis.com/auth/drive.file",
				"https://www.googleapis.com/auth/userinfo.profile",
				"https://www.googleapis.com/auth/userinfo.email"
			]
		});

		shell.openExternal(authUrl);
	}));
}

export async function authorizedFetch( 
	client: OAuth2Client, 
	url: string, 
	options: RequestInit = { method: "GET" },
	headers: Record<string, string> = { "Content-Type": "application/json" }
) {
	
	await refreshIfNeeded(client);
	const accessToken = client.credentials.access_token;

	const res = await fetch(url, {
		...options,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			...(options.body ? { "Content-Type": "application/json" } : {}),
			...headers
		}
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(errorText);
	}

	if (res.status === 204) {
		return null;
	}

	const text = await res.text();

	if (!text) {
		return null;
	}

	return JSON.parse(text);
}

export async function debugUser(client: OAuth2Client) {
	const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
		headers: {
			Authorization: `Bearer ${client.credentials.access_token}`
		}
	});

	return await res.json()
}

export async function getUserInfo() {
	const oauth2Client = getOAuthClient()
	await refreshIfNeeded(oauth2Client)
	const accessToken = oauth2Client.credentials.access_token;

	const res = await fetch(
		"https://www.googleapis.com/oauth2/v2/userinfo",
		{
			headers: {
				Authorization:
					`Bearer ${accessToken}`
			}
		}
	);

	const data = await res.json();

	if (!data.name && !data.email) {
        throw new Error("Empty userinfo response");
    }

	return {
		name: data.name,
		email: data.email,
		picture: data.picture
	}
}

export function isAlreadyLoggedIn() {
	const tokenPath = path.join(
		app.getPath("userData"),
		"token.json"
	);

	return fs.existsSync(tokenPath);
}

export async function logoutGoogle(): Promise<{ success: boolean }> {
	try {
		const tokenPath = path.join(app.getPath("userData"), "token.json")

		if (!fs.existsSync(tokenPath))
			return { success: true }

		const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf-8"))

		//revoke token at google
		if (tokens.acces_token) {
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

		return { success: true }
	}
	catch {
		return { success: false }
	}
}

export function isRequestAllowed(): boolean { // Check if drive scope is already granted

	const tokenPath = path.join(app.getPath("userData"), "token.json");
	const existing = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));

	const scopes = existing.scope ? existing.scope.split(" ") : [];
	if (scopes.includes("https://www.googleapis.com/auth/drive"))
		return true

	return false
}

export async function requestDriveScope(): Promise<{ success: boolean, error?: string }> {

	const credentialsPath = path.join(process.cwd(), "config", "client_secret.json");
	const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
	const { client_id, client_secret } = credentials.installed;

	const oauth2Client = new OAuth2Client(client_id, client_secret, "http://localhost:3000");

	return new Promise((resolve) => {
		const server = http.createServer(async (req, res) => {
			try {
				if (!req.url) return;
				const query = url.parse(req.url, true).query;
				const code = query.code as string;
				if (!code) { res.end(); return; }

				res.end("Permission granted. You can close this tab.");
				server.close();

				const { tokens } = await oauth2Client.getToken(code);

				// Merge new tokens with existing ones
				const tokenPath = path.join(app.getPath("userData"), "token.json");
				const existing = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
				fs.writeFileSync(tokenPath, JSON.stringify({ ...existing, ...tokens }));

				resolve({ success: true });
			} catch (err: any) {
				resolve({ success: false, error: err.message });
			}
		});

		server.listen(3000);

		const authUrl = oauth2Client.generateAuthUrl({
			access_type: "offline",
			scope: [
				"https://www.googleapis.com/auth/userinfo.profile",
				"https://www.googleapis.com/auth/userinfo.email",
				"https://www.googleapis.com/auth/drive"
			],
			prompt: "consent"
		});

		shell.openExternal(authUrl);
	});
}

