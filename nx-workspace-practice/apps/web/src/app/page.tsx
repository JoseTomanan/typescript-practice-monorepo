import styles from './page.module.css';
import { Message } from 'shared';

async function getMessage(): Promise<Message> {
  const response = await fetch('http://localhost:3000/api', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

export default async function Index() {
  const message = await getMessage();  

  return (
    <div className={styles.page}>
      <h1>Welcome to web!</h1>
      <p>{message.message}</p>
    </div>
  );
}
