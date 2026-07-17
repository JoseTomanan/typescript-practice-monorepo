import styles from './page.module.css';
import { Message } from 'shared';
import fetchApi from 'shared';

export default async function Index() {
  const message: Message = await fetchApi('message', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return (
    <div className={styles.page}>
      <h1>Welcome to web!</h1>
      <p>Message from backend (placeholder): {message.message}</p>
      <h2>TO DO LIST ITEMS</h2>
      
    </div>
  );
}
