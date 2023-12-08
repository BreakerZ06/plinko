'use server'
import styles from './page.module.css'
import PlinkoGame from './plinkogame'

export default async function Home() {
  return (
    <main className={styles.main}>
      <PlinkoGame />
    </main>
  )
}
