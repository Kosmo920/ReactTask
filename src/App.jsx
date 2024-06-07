import { useEffect, useState } from 'react';
import { Box, Button, Input, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';

const Expenses = [
  { name: 'ATB', sum: '10$', category: 'Products', date: '05.05.2023' },
  { name: 'TBA', sum: '20$', category: 'Cars', date: '19.10.2023' },
  { name: 'GASD', sum: '190$', category: 'Gas', date: '22.01.2024' },
  { name: 'TGVZX', sum: '220$', category: 'Games', date: '12.07.2024' },
  { name: 'TRQW', sum: '1230$', category: 'Bank', date: '02.09.2024' },
];

function ExpenseForm({ onAddExpense }) {
  const [name, setName] = useState('');
  const [sum, setSum] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  return (
    <Box border='2px solid black' w='500px'>
      <Input
        placeholder='Введіть назву'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        placeholder='Введіть сумму'
        value={sum}
        onChange={(e) => setSum(e.target.value)}
      />
      <Input
        placeholder='Введіть категорію'
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <Input
        placeholder='Введіть дату'
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button onClick={() => {
        setName('');
        setSum('');
        setCategory('');
        setDate('');
        onAddExpense({ name, sum, category, date });
      }}>Додати витрату</Button>
    </Box>
  );
}

function ExpenseItem({ expense, onDelete, onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  let itemContent;
  if (isEditing) {
    itemContent = (
      <>
        <Td>
          <Input
            value={expense.name}
            onChange={e => {
              onChange({...expense,
                name: e.target.value
              });
            }}
          />
        </Td>
        <Td>
          <Input
            value={expense.sum}
            onChange={e => {
              onChange({...expense,
                sum: e.target.value
              });
            }}
          />
        </Td>
        <Td>
          <Input
            value={expense.category}
            onChange={e => {
              onChange({...expense,
                category: e.target.value
              });
            }}
          />
        </Td>
        <Td>
          <Input
            value={expense.date}
            onChange={e => {
              onChange({...expense,
                date: e.target.value
              });
            }}
          />
        </Td>
        <Td>
          <Button onClick={() => setIsEditing(false)}>Save</Button>
        </Td>
      </>
    );
  } else {
    itemContent = (
      <>
        <Td>{expense.name}</Td>
        <Td>{expense.sum}</Td>
        <Td>{expense.category}</Td>
        <Td>{expense.date}</Td>
        <Td>
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
          <Button onClick={() => onDelete(expense)}>Delete</Button>
        </Td>
      </>
    );
  }

  return <Tr>{itemContent}</Tr>;
}

function ExpenseList({ expenses, onDeleteExpense, onChangeExpense }) {
  const rows = expenses.map((expense, index) => (
    <ExpenseItem
      key={index}
      expense={expense}
      onDelete={onDeleteExpense}
      onChange={onChangeExpense}
    />
  ));

  return (
    <Table border='2px solid black' w='500px'>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Sum</Th>
          <Th>Category</Th>
          <Th>Date</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>{rows}</Tbody>
    </Table>
  );
}

function Statistics({expenses}){
  const [filter, setFilter] = useState('');

  const filteredExpenses = expenses.filter(expense =>
    expense.date.includes(filter)
  );

  return (
    <Box border='2px solid black' w='500px' p='4' mt='4'>
      <Input
        placeholder='Введіть дату'
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <Table border='2px solid black' w='500px'>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Sum</Th>
            <Th>Category</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredExpenses.map((expense, index) => (
            <Tr key={index}>
              <Td>{expense.name}</Td>
              <Td>{expense.sum}</Td>
              <Td>{expense.category}</Td>
              <Td>{expense.date}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default function App() {
  const [expenses, setExpenses] = useState(Expenses);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);
  
  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const handleDeleteExpense = (expenseToDelete) => {
    setExpenses(expenses.filter(expense => expense !== expenseToDelete));
  };

  const handleChangeExpense = (updatedExpense) => {
    setExpenses(expenses.map(expense => {
      if (expense.name === updatedExpense.name) {
        return updatedExpense;
      } else {
        return expense;
      }
    }));
  };

  return (
    <Box>
      <ExpenseForm onAddExpense={handleAddExpense} />
      <ExpenseList
        expenses={expenses}
        onDeleteExpense={handleDeleteExpense}
        onChangeExpense={handleChangeExpense}
      />
      <Statistics expenses={expenses}/>
    </Box>
  );
}
