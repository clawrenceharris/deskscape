export function Chalkboard({ deskId }: { deskId: string }) {
    const messages = [
        {id: 1, message: "Hey, everyone! I'm excited to share my latest project with you all. It's a new way to learn about the human body and how it works. I hope you enjoy it!", userId: "1", createdAt: new Date(), updatedAt: new Date()},
        
        {id: 2, message: "I'm not sure if I'm doing this right, but I'm trying to learn about the human body and how it works. I hope you enjoy it!", userId: "2", createdAt: new Date(), updatedAt: new Date()}

        ,

    ]
    return (
        <div>
            <h1>Chalkboard</h1>
        </div>
    );
}