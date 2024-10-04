import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from "aws-amplify/data";
import { 
  useState, useEffect,
} from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { type Schema } from "../amplify/data/resource";

const wrighOff = [5, 7, 10];
const client = generateClient<Schema>();

type CustomerSchema = Schema["User"]["type"];

interface CustomerStateType {
  customer: CustomerSchema;
  setCustomer: (value: CustomerSchema) => void;
}

function SetBonusButton({customer, setCustomer}: CustomerStateType) {
  
  function setBonus() {
    client
      .mutations.AddBonus({
        userId: customer.id,
      }).then(({ data }) => {
        if (data) {
          setCustomer(data);
        } else {
          console.log(data);
        }
      })
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          variant="default"
          size="lg"
        >
          Set Bonus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={setBonus}
          >Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function WriteOffBonusesButton(
  {customer, setCustomer, count}: CustomerStateType & { count: number }) {
  
  function writeOffBonuses() {
    client
      .mutations.WriteOffBonuses({
        userId: customer.id,
        decrement: count
      }).then(({ data }) => {
        if (data) {
          setCustomer(data);
        } else {
          console.log(data);
        }
      })
  };

  return (
    <Button
      onClick={writeOffBonuses}
      variant="outline"
      size="sm"
      className="mb-4"
    >
      Write Off {count} Bonuses
    </Button>
  );
}

export default function App() {

  const [ customer, setCustomer ] = useState<Schema["User"]["type"] | null>(null);

  useEffect(() => {
  }, [customer]);

  function getCustomer(customerId: string) {
    client
      .models.User.get({ 
        id: customerId,
      })
      .then(({ data }) => {
        setCustomer(data);
      })
      .catch((err) => alert(err));
  }

  return (
          <div className="flex flex-col items-center justify-center h-screen"> 
      <Authenticator hideSignUp={true}>
        {({ signOut }) => (
          <> 
            { customer ? (
              <>
                <h1 className="text-3xl font-bold mb-6">
                  Бонуси клієнта { customer.id }
                </h1>

                <div className="text-2xl mb-6">
                  Поточні бонуси: { customer.bonusPoints }
                </div>

                <SetBonusButton {...{ customer, setCustomer }}/>

                <Separator className="my-6" />

                <div className="space-x-4 mb-16">
                  { wrighOff.map((num) => (
                    <WriteOffBonusesButton {...{ 
                      customer, 
                      setCustomer, 
                      count: num }}/>
                  ))}
                </div>      

              </>
            ) : (
              <div className="w-[500px] h-[500px]">
                <Scanner onScan={
                  (result) => getCustomer(
                    result[0].rawValue.toString()
                  )} />
              </div>
            )}
              <Button 
                 onClick={ () => setCustomer(null) }
                 className='m-12'
              > 
                 Змінити клієнта
              </Button>

              <Button onClick={ signOut } variant='link' >
                Вихід
              </Button>
          </>
        )}
      </Authenticator>
    </div>
  );
}
