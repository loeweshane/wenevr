import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"
import styles from "../components/dictionary.module.css"
import Component1 from "../components/component1"
import Component2 from "../components/component2"
import GetSentence from "../components/GetSentence"
import BuildingBlocks from "../components/BuildingBlocks"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const [content, setContent] = useState()
  const [activity, setActivity] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [resultMessage, setResultMessage] = useState("")
  const [nextQuestion, setShowNextQuestion] = useState(true)

  useEffect(() => {
    console.log("useEffect thing inside act. ran!")
    console.log(session?.user?.email)
    if (session?.user?.email != undefined) {
      next(true)
    }
  }, [session])

  const next = (response) => {
    const activities = [<GetSentence userEmail={session?.user?.email} onNew={next} />, <BuildingBlocks userEmail={session?.user?.email} onNew={next} />]
    const act = (Math.floor(Math.random() * activities.length));
    console.log("YP")
    if (response) {
      setActivity(activities[act])
      setShowResult(true);
      setResultMessage("很好!")
    }
    if (!response) {
      setActivity(activities[act])
      setShowResult(true);
      setResultMessage("不太对...")
    }
    setTimeout(() => {
      setShowResult(false);
    }, 1950);
  }


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


  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <Layout>
      {showResult ? (
        <h1 className={styles.success}>{resultMessage}</h1>
      ) : (
        <div>
          {activity}
        </div>
      )}
      <p>
        <strong>{content ?? "\u00a0"}</strong>
      </p>
    </Layout>
  )
}


