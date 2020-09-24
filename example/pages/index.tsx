import React, { useEffect, useState } from 'react'
import Head from 'next/head'

import { AnalyticsSettings, Analytics } from '../../dist/commonjs'

const settings: AnalyticsSettings = {
  // segment.com
  // writeKey: '***REMOVED***',

  // segment app
  writeKey: '***REMOVED***',
}

export default function Home(): React.ReactElement {
  const [analytics, setAnalytics] = useState<Analytics | undefined>(undefined)
  const [analyticsReady, setAnalyticsReady] = useState<boolean>(false)

  useEffect(() => {
    async function fetchAnalytics() {
      const response = await Analytics.load(settings)
      if (response) {
        setAnalytics(response)
        setAnalyticsReady(true)
      }
    }
    if (!analyticsReady && !analytics) {
      fetchAnalytics()
    }
  }, [analytics, analyticsReady])

  const track = async (e) => {
    e.preventDefault()

    if (!analyticsReady) {
      console.log('not ready yet')
    }

    await analytics.track('Track Event', {
      banana: 'phone',
    })

    const [ctx] = await analytics.queue.flush()
    ctx?.logger.flush()
  }

  const identify = async (e) => {
    e.preventDefault()

    if (!analyticsReady) {
      console.log('not ready yet')
    }

    await analytics.identify('Test User', {
      banana: 'phone',
    })

    const [ctx] = await analytics.queue.flush()
    ctx?.logger.flush()
  }

  return (
    <div>
      <Head>
        <title>Tester App</title>
      </Head>

      <main>
        <form>
          <button onClick={(e) => track(e)}>Track</button>
          <button onClick={(e) => identify(e)}>Identify</button>
        </form>
      </main>
    </div>
  )
}
