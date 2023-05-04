import Layout from "../components/layout"
import styles from "../components/header.module.css"
import indexStyles from '../components/index.module.css'
import { useSession } from "next-auth/react"
import GetUserId from '../components/GetUserId'
import { useState, useEffect } from "react"
import Head from 'next/head';

export default function IndexPage() {
  const { data: session, status } = useSession()
  const [content, setContent] = useState()
  console.log(typeof session?.user?.email)

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/examples/protected")
      const json = await res.json()
      if (json.content) {
        setContent(json.content)
      }
    }
    fetchData()
  }, [session])

  // If no session exists, display Home Page with no Buttons
  if (!session) {
    return (
      <Layout>
        <h1 className={indexStyles.homeText}>WHENEVER</h1>
        <h1 className={indexStyles.homeText2}>WHEREVER</h1>
        <p className={indexStyles.splashText}>Your Mandarin learning and translating journey starts here</p>
      </Layout>
    )
  }
  // If session exists, display Home Page content
  return (
    <div>
      <Head>
        <link rel="shortcut icon" href="images/favicon.ico" />
      </Head>
      <Layout>
        <a href="/activity" className={indexStyles.container}>
          <h1 className={indexStyles.homeText3}>Practice your vocab</h1>
        </a>
        <a href="/" className={indexStyles.container}>
          <h1 className={indexStyles.homeText4}>Practice your grammar</h1>
        </a>
        <GetUserId userEmail={session?.user?.email} />
      </Layout>
    </div>
  )
}

