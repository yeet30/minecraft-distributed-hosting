export default function GreetingSection({userProps, loadingUser}:any){


    if(loadingUser)
        return <h2>Loading user information...</h2>
    else
        return (
            <section style={{
                width: "100%",
                textAlign: "center"
            }}>
                <h2
                    style={{fontSize:"2rem"}}
                >Welcome, {userProps.name}!
                </h2>
            </section>
        )
}