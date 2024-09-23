import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from "aws-amplify/data";
import { type Schema } from '../amplify/data/resource'


export default function App() {
  const client = generateClient<Schema>();

  async function setBonus() {
    const { errors, data: newCoffeeCup } =  await client.models.CoffeeCup.create({ 
      customerId: "222",
    }, {
      authMode: "userPool"
    })
    console.log(errors, newCoffeeCup)
  };

  async function getBonuses() {
    const { data: customer } =  await client.models.Customer.get({ 
      id: "222",
    }, {
      authMode: "apiKey"
    });
    const coffeeCups = await customer?.coffeeCups()
    coffeeCups?.data.forEach((coffeeCup) => {
      console.log(coffeeCup)
    })
  };

  getBonuses();

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>

          <button onClick={setBonus}>Set Bonus</button>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
};
