import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from "aws-amplify/data";
import { type Schema } from '../amplify/data/resource'
import { 
  useState, useEffect,
  createContext, 
  useContext,
} from 'react';
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

const userId = "fdd53ed9-d0ee-4ccf-a72e-8178e009df83";
const wrighOff = [5, 7, 10];
const client = generateClient<Schema>();

interface StateContextType {
  value: number;
  setValue: (value: number) => void;
}

const BonusesContext = createContext<StateContextType | undefined>(undefined);

function SetBonusButton() {
  const context = useContext(BonusesContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  const {setValue: setBonuses} = context;
  
  async function setBonus() {
    const { data: result, errors: error } = await client
      .mutations.AddBonus({
        userId: userId,
      })
    if (!result) return;
    setBonuses(result.bonusPoints ?? 0);
    console.log(result, error)
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

function WriteOffBonusesButton( { 
  count, 
}: { count: number } ) {
  const context = useContext(BonusesContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  const {setValue: setBonuses} = context;
  
  async function writeOffBonuses() {
    const { data: customer, errors: error } = await client
      .mutations.WriteOffBonuses({
        userId: userId,
        decrement: count
      })
    if (!customer) {
      alert("not enough bonuses");
      return;
    }
    setBonuses(customer.bonusPoints ?? 0);
    console.log(customer, error)
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

  const [ bonuses, setBonuses ] = useState<number>(0);

  useEffect(() => {
    getBonuses();
  }, []);

  async function getBonuses() {
    const { data: customer } = await client
      .models.User.get({ 
        id: userId,
      });
    if (!customer) return;
    setBonuses(customer.bonusPoints ?? 0);
  }

  return (
    <BonusesContext.Provider value={{ value: bonuses, setValue: setBonuses }}>
      <div className="flex flex-col items-center justify-center h-screen"> 
      <Authenticator>
        {({ signOut }) => (
          <>
          <h1 className="text-3xl font-bold mb-6">
            Бонуси клієнта { userId }
          </h1>

          <div className="text-2xl mb-6">
            Поточні бонуси: { bonuses }
          </div>

          <SetBonusButton />

          <Separator className="my-6" />

          <div className="space-x-4 mb-16">
            { wrighOff.map((num) => (
              <WriteOffBonusesButton count={ num } />
            ))}
          </div>

          <Button onClick={ signOut } variant='link' >
            Вихід
          </Button>
          </>
        )}
      </Authenticator>
    </div>      
    </BonusesContext.Provider>
  );
};

