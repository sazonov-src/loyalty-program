import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from "aws-amplify/data";
import { type Schema } from '../amplify/data/resource'
import { useState, useEffect } from 'react';



export default function App() {
  const client = generateClient<Schema>();
  const [ bonuses, setBonuses ] = useState<Array<any>>([]);

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
      authMode: "userPool"
    });
    if (!customer) return;
    const coffeeCups = await customer.coffeeCups()
    setBonuses(coffeeCups.data);
    console.log(customer, coffeeCups)
  };

  useEffect(() => {
    getBonuses();
  }, []);

  getBonuses();

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>

          <h2>Bonuses</h2>
          <ul>
            {bonuses.map((bonus) => (
              <li key={bonus.id}>{bonus.id}</li>
            ))}
          </ul>

          <button onClick={setBonus}>Set Bonus</button>
          <a onClick={signOut}>Sign out</a>
        </main>
      )}
    </Authenticator>
  );
};
