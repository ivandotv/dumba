import { Typography } from '@material-ui/core'
import FormDemo from './components/FormDemo'
import FormStatus from './components/FormStatus'
import Link from '@material-ui/core/Link'
function App() {
  return (
    <>
      <div className="title">
        <Typography variant="h4">Dumba Form Demo Fix</Typography>
        <Typography>
          Checkout the documentation at <Link href="www.google.com">Dumba</Link>
        </Typography>
      </div>
      <div className="app">
        <FormDemo />
        <FormStatus />
      </div>
    </>
  )
}

export default App
