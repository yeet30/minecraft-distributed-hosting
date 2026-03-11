import './greeting-section.css'

export default function GreetingSection({userProps, loadingUser,servers,selectedServer,setSelectedServer}:any){

    if(loadingUser)
        return <h2 className="greeting-title">Loading user information...</h2>
    else
        return (
            <section id="greeting-wrapper">
                <h2 className="greeting-title">Welcome, {userProps.name}!</h2>
                <h3>Current selected server is {selectedServer?.name || "Loading"}</h3>
            </section>
        )
}