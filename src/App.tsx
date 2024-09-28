import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from "aws-amplify/data";
import { type Schema } from '../amplify/data/resource'
import { useState, useEffect } from 'react';

const userId = "59a0ecad-9939-4c7d-a6d3-aaae198a4fbe";

export default function App() {
  const client = generateClient<Schema>();
  const [ bonuses, setBonuses ] = useState<number>(0);

  async function setBonus() {
    const { data: result, errors: error } = await client
      .mutations.AddBonus({
        userId: userId,
      })
    if (!result) return;
    setBonuses(result.bonusPoints ?? 0);
    console.log(result, error)
  };

  async function getBonuses() {
    const { data: customer, errors: error } =  await client
      .models.User.get({ 
        id: userId,
      });
    if (!customer) return;
    setBonuses(customer.bonusPoints ?? 0);
    console.log(customer, error)
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
          <h2>Bonuses: { bonuses }</h2>
          <button onClick={setBonus}>Set Bonus</button>
          <a onClick={signOut}>Sign out</a>
        </main>
      )}
    </Authenticator>
  );
};
