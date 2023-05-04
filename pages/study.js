import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"
import GetSentence from "../components/GetSentence"
import CollisionDetectionFlow from "../components/SentenceBuilder"
import BuildingBlocks from "../components/BuildingBlocks"
import styles from "../components/getsentence.module.css"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const [content, setContent] = useState()
  const [activity, setActivity] = useState(null)

  console.log("1")
  console.log(session?.user?.email)

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
    if (session?.user?.email != undefined) {
      randAct()
    }
  }, [session])


  console.log("2")
  console.log(session?.user?.email)

  function randAct() {
    const activities = [<BuildingBlocks userEmail={session?.user?.email} onNew={next} />, <GetSentence userEmail={session?.user?.email} onNew={next} />]

    const activity = (Math.floor(Math.random() * activities.length));
    console.log(activity)
    console.log(activities)

    setActivity(activities[activity])
  }

  const next = (response) => {
    console.log("YP")
    if (response) {
      randAct();
    }
  }

  // Randomize which component is served to user
  console.log("change or na")
  // userEmail={session?.user?.email}
  // If session exists, display content
  return (
    <Layout>
      {session ? (
        <div>
          {activity}
        </div>
      ) : (
        <AccessDenied />
      )
      }
      <p>
        <strong>{content ?? "\u00a0"}</strong>
      </p>
    </Layout >

  )
}
